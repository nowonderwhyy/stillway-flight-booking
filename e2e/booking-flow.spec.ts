import { expect, test } from "@playwright/test";

test("default ATL round trip persists and is recoverable in My Trips", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Search flights" }).click();
  await expect(page.getByRole("heading", { name: "ATL to SFO" })).toBeVisible();
  await page.getByRole("button", { name: "Choose" }).first().click();
  await expect(page.getByRole("heading", { name: "SFO to ATL" })).toBeVisible();
  await page.getByRole("button", { name: "Choose" }).first().click();
  await page.getByRole("link", { name: /continue to details/i }).click();
  await page.getByLabel("First name").fill("Avery");
  await page.getByLabel("Last name").fill("Morgan");
  await page.getByLabel("Email").fill("avery.e2e@example.com");
  await page.getByLabel("Phone").fill("404-555-0142");
  await page.getByRole("button", { name: /confirm sample booking/i }).click();
  await expect(page).toHaveURL(/\/confirmation\//);
  const code = (await page.locator(".confirmation-code-row strong").textContent())?.trim();
  expect(code).toMatch(/^STW-[A-F0-9]{6}$/);

  await page.goto("/trips");
  await page.getByLabel("Confirmation code").fill(code!);
  await page.getByLabel("Email").fill("avery.e2e@example.com");
  await page.getByRole("button", { name: "Find my trip" }).click();
  await expect(page.getByRole("heading", { name: code! })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: /your journey/i })).toBeVisible();
});

test("one-way selection reaches guest checkout", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "One way" }).click();
  await page.getByRole("button", { name: "Search flights" }).click();
  await page.getByRole("button", { name: "Choose" }).first().click();
  await page.getByRole("link", { name: /continue to details/i }).click();
  await expect(page.getByRole("heading", { name: /one last step/i })).toBeVisible();
  await expect(page.getByText(/sample total/i).first()).toBeVisible();
});

test("no-result search and sold-out conflict return clear states", async ({ page, request }) => {
  await page.goto("/");
  const seededDate = await page.locator('input[type="date"]').first().inputValue();
  await page.getByRole("button", { name: "One way" }).click();
  await page.locator('input[type="date"]').first().fill("2030-01-01");
  await page.getByRole("button", { name: "Search flights" }).click();
  await expect(page.getByRole("heading", { name: /no sample flights match/i })).toBeVisible();

  const health = await request.get("/api/health");
  expect(health.ok()).toBeTruthy();
  const defaultPage = await request.get("/");
  expect(defaultPage.ok()).toBeTruthy();
  const search = await request.get(`/api/flights?origin=ATL&destination=SEA&date=${seededDate}&travelers=1`);
  const flights = (await search.json()).flights as { id: number; availableSeats: number }[];
  if (flights.length) {
    const chosen = flights.sort((a, b) => a.availableSeats - b.availableSeats)[0];
    for (let seats = chosen.availableSeats; seats > 0; seats -= Math.min(6, seats)) {
      const count = Math.min(6, seats);
      const response = await request.post("/api/bookings", { data: { outboundFlightId: chosen.id, travelerCount: count, firstName: "Load", lastName: "Test", email: `load${seats}@example.com`, phone: "404-555-0123", seatPreference: "NO_PREFERENCE" } });
      expect(response.status()).toBe(201);
    }
    const conflict = await request.post("/api/bookings", { data: { outboundFlightId: chosen.id, travelerCount: 1, firstName: "Load", lastName: "Conflict", email: "conflict@example.com", phone: "404-555-0123", seatPreference: "NO_PREFERENCE" } });
    expect(conflict.status()).toBe(409);
  }
});

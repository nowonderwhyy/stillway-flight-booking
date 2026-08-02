import { defineConfig, devices } from "@playwright/test";

const e2eDatabaseUrl = "file:./data/stillway.e2e.db";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"], ["html", { outputFolder: "playwright-report", open: "never" }]],
  use: {
    baseURL: "http://127.0.0.1:3100",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "npm run e2e:server",
    url: "http://127.0.0.1:3100/api/health",
    env: { DATABASE_URL: e2eDatabaseUrl },
    reuseExistingServer: false,
    timeout: 120_000,
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
});

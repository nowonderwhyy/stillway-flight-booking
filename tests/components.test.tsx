import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BookingForm } from "@/components/booking-form";
import { HomeExperience } from "@/components/home-experience";
import { JourneyFitPanel } from "@/components/journey-fit-panel";
import { TripSummary } from "@/components/trip-summary";
import { JOURNEY_PRESETS } from "@/lib/journey-fit";
import { flight } from "./fixtures";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("booking interface components", () => {
  it("selects a Journey Fit preset and reveals custom tuning", async () => {
    const user = userEvent.setup();
    const onPreset = vi.fn();
    const onToggleTuning = vi.fn();
    render(<JourneyFitPanel activePreset="balanced" weights={JOURNEY_PRESETS.balanced} tuningOpen={false} onPreset={onPreset} onWeights={vi.fn()} onToggleTuning={onToggleTuning} />);
    await user.click(screen.getByRole("button", { name: /arrive rested/i }));
    expect(onPreset).toHaveBeenCalledWith("rested");
    await user.click(screen.getByRole("button", { name: /fine-tune/i }));
    expect(onToggleTuning).toHaveBeenCalledOnce();
  });

  it("keeps checkout disabled until the required itinerary is selected", () => {
    const { rerender } = render(<TripSummary outbound={null} returning={null} travelers={1} roundTrip={true} onEditOutbound={vi.fn()} onEditReturn={vi.fn()} />);
    expect(screen.getByRole("button", { name: /continue to details/i })).toBeDisabled();
    rerender(<TripSummary outbound={flight()} returning={flight({ id: 2, origin: flight().destination, destination: flight().origin })} travelers={2} roundTrip={true} onEditOutbound={vi.fn()} onEditReturn={vi.fn()} />);
    expect(screen.getByRole("link", { name: /continue to details/i })).toHaveAttribute("href", expect.stringContaining("travelers=2"));
  });

  it("shows same-page search validation before making a request", async () => {
    const user = userEvent.setup();
    render(<HomeExperience airports={[flight().origin, flight().destination]} defaultSearch={{ origin: "ATL", destination: "SFO", departureDate: "2026-08-07", returnDate: "2026-08-10" }} />);
    await user.selectOptions(screen.getByRole("combobox", { name: /from/i }), "SFO");
    await user.click(screen.getByRole("button", { name: "Search flights" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Choose two different airports.");
  });

  it("surfaces checkout API errors without navigating", async () => {
    const user = userEvent.setup();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, json: async () => ({ error: "That flight just sold out." }) }));
    render(<BookingForm outbound={flight()} travelers={1} />);
    await user.type(screen.getByLabelText("First name"), "Avery");
    await user.type(screen.getByLabelText("Last name"), "Morgan");
    await user.type(screen.getByLabelText("Email"), "avery@example.com");
    await user.type(screen.getByLabelText("Phone"), "404-555-0142");
    await user.click(screen.getByRole("button", { name: "Confirm sample booking" }));
    expect(await screen.findByText("That flight just sold out.")).toHaveAttribute("role", "alert");
  });
});

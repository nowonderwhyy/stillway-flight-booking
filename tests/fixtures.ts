import type { FlightResult } from "@/lib/types";

export function flight(overrides: Partial<FlightResult> = {}): FlightResult {
  return {
    id: 1,
    flightNumber: "DL 0421",
    carrier: { code: "DL", name: "Delta Air Lines" },
    origin: { code: "ATL", city: "Atlanta", name: "Hartsfield–Jackson Atlanta International", timezone: "America/New_York" },
    destination: { code: "SFO", city: "San Francisco", name: "San Francisco International", timezone: "America/Los_Angeles" },
    departureAt: "2026-08-07T12:10:00.000Z",
    arrivalAt: "2026-08-07T17:15:00.000Z",
    durationMinutes: 305,
    stops: 0,
    priceCents: 32800,
    co2Kg: 421,
    availableSeats: 18,
    ...overrides,
  };
}

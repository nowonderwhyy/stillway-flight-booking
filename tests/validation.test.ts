import { describe, expect, it } from "vitest";
import { bookingLookupSchema, createBookingSchema, flightSearchSchema } from "@/lib/validation";

describe("input validation", () => {
  it("normalizes a valid flight search", () => {
    expect(flightSearchSchema.parse({ origin: "atl", destination: "sfo", date: "2026-08-07", travelers: "2" })).toEqual({ origin: "ATL", destination: "SFO", date: "2026-08-07", travelers: 2 });
  });

  it("rejects identical airports, impossible dates, and large parties", () => {
    expect(flightSearchSchema.safeParse({ origin: "ATL", destination: "ATL", date: "2026-08-07", travelers: 1 }).success).toBe(false);
    expect(flightSearchSchema.safeParse({ origin: "ATL", destination: "SFO", date: "2026-02-30", travelers: 1 }).success).toBe(false);
    expect(flightSearchSchema.safeParse({ origin: "ATL", destination: "SFO", date: "2026-08-07", travelers: 7 }).success).toBe(false);
  });

  it("validates booking contact details and protects lookup shape", () => {
    const valid = createBookingSchema.safeParse({ outboundFlightId: 1, travelerCount: 1, firstName: "Avery", lastName: "Morgan", email: "AVERY@EXAMPLE.COM", phone: "(404) 555-0142", seatPreference: "WINDOW" });
    expect(valid.success).toBe(true);
    if (valid.success) expect(valid.data.email).toBe("avery@example.com");
    expect(bookingLookupSchema.parse({ confirmationCode: "stw-abcdef", email: "AVERY@EXAMPLE.COM" })).toEqual({ confirmationCode: "STW-ABCDEF", email: "avery@example.com" });
  });
});

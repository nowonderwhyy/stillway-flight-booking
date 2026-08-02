import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { BookingConflictError, BookingNotFoundError, createBooking, createConfirmationCode, lookupBooking } from "@/lib/booking-service";
import { prisma } from "@/lib/prisma";

let outboundId = 0;
let returnId = 0;
let outboundSeats = 0;
let returnSeats = 0;

beforeAll(async () => {
  const outbound = await prisma.flight.findFirst({ where: { origin: { code: "ATL" }, destination: { code: "SFO" } }, orderBy: { departureAt: "asc" } });
  if (!outbound) throw new Error("Seeded ATL-SFO flight is missing");
  const returning = await prisma.flight.findFirst({ where: { originId: outbound.destinationId, destinationId: outbound.originId, departureAt: { gt: outbound.arrivalAt } }, orderBy: { departureAt: "asc" } });
  if (!returning) throw new Error("Seeded SFO-ATL return is missing");
  outboundId = outbound.id;
  returnId = returning.id;
  outboundSeats = outbound.availableSeats;
  returnSeats = returning.availableSeats;
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("SQLite booking transaction", () => {
  it("creates one booking with two locked-price legs and decrements both flights", async () => {
    const booking = await createBooking({ outboundFlightId: outboundId, returnFlightId: returnId, travelerCount: 2, firstName: "Avery", lastName: "Morgan", email: "AVERY@EXAMPLE.COM", phone: "404-555-0142", seatPreference: "WINDOW" });
    expect(booking.legs).toHaveLength(2);
    expect(booking.totalCents).toBe(booking.legs.reduce((sum, leg) => sum + leg.priceCents, 0) * 2);
    const [outbound, returning] = await Promise.all([prisma.flight.findUniqueOrThrow({ where: { id: outboundId } }), prisma.flight.findUniqueOrThrow({ where: { id: returnId } })]);
    expect(outbound.availableSeats).toBe(outboundSeats - 2);
    expect(returning.availableSeats).toBe(returnSeats - 2);
    const found = await lookupBooking({ confirmationCode: booking.confirmationCode.toLowerCase(), email: "  AVERY@example.com " });
    expect(found.id).toBe(booking.id);
  });

  it("rolls back the outbound decrement when the return lacks capacity", async () => {
    const outbound = await prisma.flight.findFirstOrThrow({ where: { origin: { code: "ATL" }, destination: { code: "SEA" } } });
    const returning = await prisma.flight.findFirstOrThrow({ where: { originId: outbound.destinationId, destinationId: outbound.originId } });
    const before = outbound.availableSeats;
    await prisma.flight.update({ where: { id: returning.id }, data: { availableSeats: 0 } });
    await expect(createBooking({ outboundFlightId: outbound.id, returnFlightId: returning.id, travelerCount: 1, firstName: "Rowan", lastName: "Vale", email: "rowan@example.com", phone: "404-555-0199", seatPreference: "AISLE" })).rejects.toBeInstanceOf(BookingConflictError);
    expect((await prisma.flight.findUniqueOrThrow({ where: { id: outbound.id } })).availableSeats).toBe(before);
  });

  it("generates readable unique-shaped codes and does not reveal mismatched lookups", async () => {
    expect(createConfirmationCode()).toMatch(/^STW-[A-F0-9]{6}$/);
    await expect(lookupBooking({ confirmationCode: "STW-000000", email: "nobody@example.com" })).rejects.toBeInstanceOf(BookingNotFoundError);
  });
});

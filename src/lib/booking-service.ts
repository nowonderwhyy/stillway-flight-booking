import { randomUUID } from "node:crypto";
import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { flightInclude, toFlightResult } from "@/lib/flight-service";
import type { BookingConfirmation, BookingLookupInput, CreateBookingInput } from "@/lib/types";

const bookingInclude = {
  legs: {
    include: { flight: { include: flightInclude } },
    orderBy: { sequence: "asc" as const },
  },
} satisfies Prisma.BookingInclude;

type BookingWithLegs = Prisma.BookingGetPayload<{ include: typeof bookingInclude }>;

export class BookingConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BookingConflictError";
  }
}

export class BookingNotFoundError extends Error {
  constructor() {
    super("We could not find a trip with that confirmation code and email.");
    this.name = "BookingNotFoundError";
  }
}

function toConfirmation(booking: BookingWithLegs): BookingConfirmation {
  return {
    id: booking.id,
    confirmationCode: booking.confirmationCode,
    firstName: booking.firstName,
    lastName: booking.lastName,
    email: booking.email,
    phone: booking.phone,
    seatPreference: booking.seatPreference as BookingConfirmation["seatPreference"],
    travelerCount: booking.travelerCount,
    totalCents: booking.totalCents,
    status: "CONFIRMED",
    createdAt: booking.createdAt.toISOString(),
    legs: booking.legs.map((leg) => ({
      direction: leg.direction as "OUTBOUND" | "RETURN",
      sequence: leg.sequence,
      priceCents: leg.priceCents,
      flight: toFlightResult(leg.flight),
    })),
  };
}

export function createConfirmationCode() {
  return `STW-${randomUUID().replaceAll("-", "").slice(0, 6).toUpperCase()}`;
}

export async function createBooking(input: CreateBookingInput) {
  const flightIds = [input.outboundFlightId, ...(input.returnFlightId ? [input.returnFlightId] : [])];

  const booking = await prisma.$transaction(async (transaction) => {
    const flights = await transaction.flight.findMany({
      where: { id: { in: flightIds } },
      include: flightInclude,
    });
    if (flights.length !== flightIds.length) throw new BookingConflictError("One of the selected flights is no longer available.");

    const outbound = flights.find((flight) => flight.id === input.outboundFlightId);
    const returning = input.returnFlightId
      ? flights.find((flight) => flight.id === input.returnFlightId)
      : undefined;
    if (!outbound) throw new BookingConflictError("The outbound flight is no longer available.");
    if (outbound.departureAt <= new Date()) throw new BookingConflictError("The outbound flight has already departed.");

    if (returning) {
      const isReverseRoute =
        returning.originId === outbound.destinationId && returning.destinationId === outbound.originId;
      if (!isReverseRoute || returning.departureAt <= outbound.arrivalAt) {
        throw new BookingConflictError("The return flight does not form a valid round trip.");
      }
    }

    for (const flight of [outbound, ...(returning ? [returning] : [])]) {
      if (flight.availableSeats < input.travelerCount) {
        throw new BookingConflictError(`${flight.flightNumber} no longer has enough seats for this party.`);
      }
      const update = await transaction.flight.updateMany({
        where: { id: flight.id, availableSeats: { gte: input.travelerCount } },
        data: { availableSeats: { decrement: input.travelerCount } },
      });
      if (update.count !== 1) {
        throw new BookingConflictError(`${flight.flightNumber} changed while you were booking. Please choose again.`);
      }
    }

    const orderedFlights = [outbound, ...(returning ? [returning] : [])];
    const totalCents = orderedFlights.reduce((sum, flight) => sum + flight.priceCents, 0) * input.travelerCount;

    return transaction.booking.create({
      data: {
        confirmationCode: createConfirmationCode(),
        firstName: input.firstName.trim(),
        lastName: input.lastName.trim(),
        email: input.email.trim().toLowerCase(),
        phone: input.phone.trim(),
        seatPreference: input.seatPreference,
        travelerCount: input.travelerCount,
        totalCents,
        legs: {
          create: orderedFlights.map((flight, index) => ({
            flightId: flight.id,
            direction: index === 0 ? "OUTBOUND" : "RETURN",
            sequence: index,
            priceCents: flight.priceCents,
          })),
        },
      },
      include: bookingInclude,
    });
  });

  return toConfirmation(booking);
}

export async function getBookingById(id: string) {
  const booking = await prisma.booking.findUnique({ where: { id }, include: bookingInclude });
  return booking ? toConfirmation(booking) : null;
}

export async function lookupBooking(input: BookingLookupInput) {
  const booking = await prisma.booking.findFirst({
    where: {
      confirmationCode: input.confirmationCode.trim().toUpperCase(),
      email: input.email.trim().toLowerCase(),
    },
    include: bookingInclude,
  });
  if (!booking) throw new BookingNotFoundError();
  return toConfirmation(booking);
}

import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type { FlightResult, FlightSearchInput } from "@/lib/types";

export const flightInclude = {
  carrier: true,
  origin: true,
  destination: true,
} satisfies Prisma.FlightInclude;

export type FlightWithRelations = Prisma.FlightGetPayload<{ include: typeof flightInclude }>;

function localDate(timestamp: Date, timeZone: string) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(timestamp);
}

export function toFlightResult(flight: FlightWithRelations): FlightResult {
  return {
    id: flight.id,
    flightNumber: flight.flightNumber,
    carrier: { code: flight.carrier.code, name: flight.carrier.name },
    origin: {
      code: flight.origin.code,
      city: flight.origin.city,
      name: flight.origin.name,
      timezone: flight.origin.timezone,
    },
    destination: {
      code: flight.destination.code,
      city: flight.destination.city,
      name: flight.destination.name,
      timezone: flight.destination.timezone,
    },
    departureAt: flight.departureAt.toISOString(),
    arrivalAt: flight.arrivalAt.toISOString(),
    durationMinutes: flight.durationMinutes,
    stops: flight.stops,
    priceCents: flight.priceCents,
    co2Kg: flight.co2Kg,
    availableSeats: flight.availableSeats,
  };
}

export async function searchFlights(input: FlightSearchInput) {
  const candidates = await prisma.flight.findMany({
    where: {
      origin: { code: input.origin },
      destination: { code: input.destination },
      availableSeats: { gte: input.travelers },
    },
    include: flightInclude,
    orderBy: { departureAt: "asc" },
  });

  return candidates
    .filter((flight) => localDate(flight.departureAt, flight.origin.timezone) === input.date)
    .map(toFlightResult);
}

export async function getFlightById(id: number) {
  const flight = await prisma.flight.findUnique({ where: { id }, include: flightInclude });
  return flight ? toFlightResult(flight) : null;
}

export async function listAirports() {
  return prisma.airport.findMany({ orderBy: [{ code: "asc" }] });
}

export async function getDefaultSearch() {
  const flight = await prisma.flight.findFirst({
    where: { origin: { code: "ATL" }, destination: { code: "SFO" }, availableSeats: { gt: 0 } },
    include: flightInclude,
    orderBy: { departureAt: "asc" },
  });

  if (!flight) return null;
  const returnFlight = await prisma.flight.findFirst({
    where: {
      originId: flight.destinationId,
      destinationId: flight.originId,
      departureAt: { gt: flight.arrivalAt },
      availableSeats: { gt: 0 },
    },
    include: flightInclude,
    orderBy: { departureAt: "asc" },
  });

  return {
    origin: flight.origin.code,
    destination: flight.destination.code,
    departureDate: localDate(flight.departureAt, flight.origin.timezone),
    returnDate: returnFlight ? localDate(returnFlight.departureAt, returnFlight.origin.timezone) : "",
  };
}

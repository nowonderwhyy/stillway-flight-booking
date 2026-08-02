import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";

const databaseUrl = process.env.DATABASE_URL ?? "file:./data/stillway.db";

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({ url: databaseUrl }),
});

type AirportSeed = {
  code: string;
  city: string;
  name: string;
  timezone: string;
};

type FlightTemplate = {
  carrier: string;
  flightNumber: string;
  destination: string;
  outboundLocal: [number, number];
  returnLocal: [number, number];
  durationMinutes: number;
  returnDurationMinutes: number;
  stops: number;
  priceCents: number;
  returnPriceCents: number;
  co2Kg: number;
  seats: number;
};

const airports: AirportSeed[] = [
  { code: "ATL", city: "Atlanta", name: "Hartsfield–Jackson Atlanta International", timezone: "America/New_York" },
  { code: "JFK", city: "New York", name: "John F. Kennedy International", timezone: "America/New_York" },
  { code: "SFO", city: "San Francisco", name: "San Francisco International", timezone: "America/Los_Angeles" },
  { code: "MIA", city: "Miami", name: "Miami International", timezone: "America/New_York" },
  { code: "SEA", city: "Seattle", name: "Seattle–Tacoma International", timezone: "America/Los_Angeles" },
  { code: "ORD", city: "Chicago", name: "O'Hare International", timezone: "America/Chicago" },
];

const carriers = [
  { code: "DL", name: "Delta Air Lines" },
  { code: "UA", name: "United Airlines" },
  { code: "AA", name: "American Airlines" },
  { code: "AS", name: "Alaska Airlines" },
  { code: "B6", name: "JetBlue" },
];

const templates: FlightTemplate[] = [
  { carrier: "DL", flightNumber: "DL 0421", destination: "SFO", outboundLocal: [8, 10], returnLocal: [10, 20], durationMinutes: 305, returnDurationMinutes: 270, stops: 0, priceCents: 32800, returnPriceCents: 30600, co2Kg: 421, seats: 18 },
  { carrier: "UA", flightNumber: "UA 1867", destination: "SFO", outboundLocal: [17, 45], returnLocal: [18, 15], durationMinutes: 405, returnDurationMinutes: 365, stops: 1, priceCents: 27100, returnPriceCents: 25900, co2Kg: 458, seats: 14 },
  { carrier: "DL", flightNumber: "DL 0912", destination: "JFK", outboundLocal: [7, 5], returnLocal: [9, 0], durationMinutes: 135, returnDurationMinutes: 155, stops: 0, priceCents: 22500, returnPriceCents: 21800, co2Kg: 164, seats: 23 },
  { carrier: "B6", flightNumber: "B6 0719", destination: "JFK", outboundLocal: [12, 40], returnLocal: [16, 30], durationMinutes: 145, returnDurationMinutes: 150, stops: 0, priceCents: 19900, returnPriceCents: 19400, co2Kg: 173, seats: 17 },
  { carrier: "DL", flightNumber: "DL 1330", destination: "MIA", outboundLocal: [9, 20], returnLocal: [11, 15], durationMinutes: 115, returnDurationMinutes: 120, stops: 0, priceCents: 18400, returnPriceCents: 17800, co2Kg: 138, seats: 27 },
  { carrier: "AA", flightNumber: "AA 1048", destination: "MIA", outboundLocal: [16, 30], returnLocal: [19, 5], durationMinutes: 125, returnDurationMinutes: 125, stops: 0, priceCents: 16300, returnPriceCents: 16900, co2Kg: 146, seats: 20 },
  { carrier: "DL", flightNumber: "DL 0814", destination: "SEA", outboundLocal: [10, 5], returnLocal: [8, 25], durationMinutes: 325, returnDurationMinutes: 285, stops: 0, priceCents: 35500, returnPriceCents: 34100, co2Kg: 438, seats: 16 },
  { carrier: "AS", flightNumber: "AS 0346", destination: "SEA", outboundLocal: [17, 55], returnLocal: [15, 45], durationMinutes: 420, returnDurationMinutes: 390, stops: 1, priceCents: 29900, returnPriceCents: 28700, co2Kg: 472, seats: 12 },
  { carrier: "UA", flightNumber: "UA 2240", destination: "ORD", outboundLocal: [6, 50], returnLocal: [8, 10], durationMinutes: 130, returnDurationMinutes: 120, stops: 0, priceCents: 21400, returnPriceCents: 20700, co2Kg: 151, seats: 21 },
  { carrier: "AA", flightNumber: "AA 2875", destination: "ORD", outboundLocal: [14, 10], returnLocal: [17, 40], durationMinutes: 135, returnDurationMinutes: 125, stops: 0, priceCents: 18800, returnPriceCents: 19100, co2Kg: 159, seats: 19 },
];

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function nextDemoFriday() {
  const now = new Date();
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  let days = (5 - today.getUTCDay() + 7) % 7;
  if (days < 3) days += 7;
  return addDays(today, days);
}

function timeZoneOffsetMilliseconds(date: Date, timeZone: string) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });
  const parts = Object.fromEntries(
    formatter.formatToParts(date).filter((part) => part.type !== "literal").map((part) => [part.type, Number(part.value)]),
  );
  const representedAsUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
  return representedAsUtc - date.getTime();
}

function zonedDate(date: Date, hour: number, minute: number, timeZone: string) {
  const guess = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), hour, minute));
  const firstOffset = timeZoneOffsetMilliseconds(guess, timeZone);
  const adjusted = new Date(guess.getTime() - firstOffset);
  const correctedOffset = timeZoneOffsetMilliseconds(adjusted, timeZone);
  return new Date(guess.getTime() - correctedOffset);
}

async function main() {
  for (const airport of airports) {
    await prisma.airport.upsert({
      where: { code: airport.code },
      update: airport,
      create: airport,
    });
  }

  for (const carrier of carriers) {
    await prisma.carrier.upsert({
      where: { code: carrier.code },
      update: carrier,
      create: carrier,
    });
  }

  const existingFlights = await prisma.flight.count();
  if (existingFlights > 0) {
    console.log(`Seed skipped: ${existingFlights} flights already exist.`);
    return;
  }

  const airportRows = await prisma.airport.findMany();
  const carrierRows = await prisma.carrier.findMany();
  const byAirport = new Map(airportRows.map((airport) => [airport.code, airport]));
  const byCarrier = new Map(carrierRows.map((carrier) => [carrier.code, carrier]));
  const atl = byAirport.get("ATL");
  const outboundDate = nextDemoFriday();
  const returnDate = addDays(outboundDate, 3);

  if (!atl) throw new Error("ATL seed airport is missing");

  for (const template of templates) {
    const destination = byAirport.get(template.destination);
    const carrier = byCarrier.get(template.carrier);
    if (!destination || !carrier) throw new Error(`Missing seed reference for ${template.destination}/${template.carrier}`);

    const outboundDeparture = zonedDate(outboundDate, template.outboundLocal[0], template.outboundLocal[1], atl.timezone);
    const outboundArrival = new Date(outboundDeparture.getTime() + template.durationMinutes * 60_000);
    const returnDeparture = zonedDate(returnDate, template.returnLocal[0], template.returnLocal[1], destination.timezone);
    const returnArrival = new Date(returnDeparture.getTime() + template.returnDurationMinutes * 60_000);

    await prisma.flight.createMany({
      data: [
        {
          carrierId: carrier.id,
          flightNumber: template.flightNumber,
          originId: atl.id,
          destinationId: destination.id,
          departureAt: outboundDeparture,
          arrivalAt: outboundArrival,
          durationMinutes: template.durationMinutes,
          stops: template.stops,
          priceCents: template.priceCents,
          co2Kg: template.co2Kg,
          availableSeats: template.seats,
        },
        {
          carrierId: carrier.id,
          flightNumber: `${template.carrier} ${Number(template.flightNumber.replace(/\D/g, "")) + 1}`,
          originId: destination.id,
          destinationId: atl.id,
          departureAt: returnDeparture,
          arrivalAt: returnArrival,
          durationMinutes: template.returnDurationMinutes,
          stops: template.stops,
          priceCents: template.returnPriceCents,
          co2Kg: Math.max(1, template.co2Kg - 8),
          availableSeats: template.seats + 2,
        },
      ],
    });
  }

  console.log(`Seeded ${templates.length * 2} flights for ${outboundDate.toISOString().slice(0, 10)} and ${returnDate.toISOString().slice(0, 10)}.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

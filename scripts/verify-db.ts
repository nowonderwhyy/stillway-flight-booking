import "dotenv/config";
import path from "node:path";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";

const url = process.env.DATABASE_URL ?? "file:./data/stillway.db";

const prisma = new PrismaClient({ adapter: new PrismaBetterSqlite3({ url }) });

async function main() {
  try {
    const [flightCount, bookingCount, airports, routeRows, firstFlight] = await Promise.all([
      prisma.flight.count(),
      prisma.booking.count(),
      prisma.airport.count(),
      prisma.flight.findMany({ select: { originId: true, destinationId: true } }),
      prisma.flight.findFirst({ orderBy: { departureAt: "asc" }, select: { departureAt: true } }),
    ]);
    const routes = new Set(routeRows.map((row) => `${row.originId}:${row.destinationId}`));
    const databasePath = url.startsWith("file:") ? path.resolve(url.slice(5)) : url;

    console.log("Stillway SQLite verification");
    console.log(`  database: ${databasePath}`);
    console.log("  schema: connected");
    console.log(`  airports: ${airports}`);
    console.log(`  flights: ${flightCount}`);
    console.log(`  directional routes: ${routes.size}`);
    console.log(`  bookings: ${bookingCount}`);
    console.log(`  earliest departure: ${firstFlight?.departureAt.toISOString() ?? "none"}`);

    if (flightCount < 20) {
      throw new Error(`Expected at least 20 seeded flights, found ${flightCount}`);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

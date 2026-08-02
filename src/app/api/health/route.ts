import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [airports, flights, bookings] = await Promise.all([
      prisma.airport.count(),
      prisma.flight.count(),
      prisma.booking.count(),
    ]);
    return Response.json({ status: "ok", database: "sqlite", airports, flights, bookings });
  } catch (error) {
    console.error("Health check failed", error);
    return Response.json({ status: "error" }, { status: 503 });
  }
}

import { serverErrorResponse, validationResponse } from "@/lib/http";
import { searchFlights } from "@/lib/flight-service";
import { flightSearchSchema } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = flightSearchSchema.safeParse({
    origin: url.searchParams.get("origin"),
    destination: url.searchParams.get("destination"),
    date: url.searchParams.get("date"),
    travelers: url.searchParams.get("travelers"),
  });

  if (!parsed.success) return validationResponse(parsed.error);

  try {
    const flights = await searchFlights(parsed.data);
    return Response.json({ flights });
  } catch (error) {
    console.error("Flight search failed", error);
    return serverErrorResponse();
  }
}

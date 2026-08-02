import { BookingNotFoundError, lookupBooking } from "@/lib/booking-service";
import { serverErrorResponse, validationResponse } from "@/lib/http";
import { bookingLookupSchema } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Use a valid JSON request body." }, { status: 400 });
  }

  const parsed = bookingLookupSchema.safeParse(payload);
  if (!parsed.success) return validationResponse(parsed.error);

  try {
    const booking = await lookupBooking(parsed.data);
    return Response.json({ booking });
  } catch (error) {
    if (error instanceof BookingNotFoundError) {
      return Response.json({ error: error.message }, { status: 404 });
    }
    console.error("Booking lookup failed", error);
    return serverErrorResponse();
  }
}

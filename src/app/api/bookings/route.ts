import { BookingConflictError, createBooking } from "@/lib/booking-service";
import { serverErrorResponse, validationResponse } from "@/lib/http";
import { createBookingSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Use a valid JSON request body." }, { status: 400 });
  }

  const parsed = createBookingSchema.safeParse(payload);
  if (!parsed.success) return validationResponse(parsed.error);

  try {
    const booking = await createBooking(parsed.data);
    return Response.json({ booking }, { status: 201 });
  } catch (error) {
    if (error instanceof BookingConflictError) {
      return Response.json({ error: error.message }, { status: 409 });
    }
    console.error("Booking creation failed", error);
    return serverErrorResponse();
  }
}

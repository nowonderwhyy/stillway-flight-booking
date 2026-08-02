import { z } from "zod";

const airportCode = z
  .string()
  .trim()
  .length(3)
  .transform((value) => value.toUpperCase())
  .refine((value) => /^[A-Z]{3}$/.test(value), "Use a valid three-letter airport code");

const localDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use a date in YYYY-MM-DD format")
  .refine((value) => {
    const [year, month, day] = value.split("-").map(Number);
    const parsed = new Date(Date.UTC(year, month - 1, day));
    return parsed.getUTCFullYear() === year && parsed.getUTCMonth() === month - 1 && parsed.getUTCDate() === day;
  }, "Use a valid date");

export const flightSearchSchema = z
  .object({
    origin: airportCode,
    destination: airportCode,
    date: localDate,
    travelers: z.coerce.number().int().min(1).max(6),
  })
  .refine((value) => value.origin !== value.destination, {
    message: "Origin and destination must be different",
    path: ["destination"],
  });

export const createBookingSchema = z
  .object({
    outboundFlightId: z.coerce.number().int().positive(),
    returnFlightId: z.coerce.number().int().positive().optional(),
    travelerCount: z.coerce.number().int().min(1).max(6),
    firstName: z.string().trim().min(1).max(50),
    lastName: z.string().trim().min(1).max(50),
    email: z.string().trim().toLowerCase().email().max(160),
    phone: z
      .string()
      .trim()
      .min(7)
      .max(24)
      .refine((value) => /^[+\d()\-.\s]+$/.test(value), "Use a valid phone number"),
    seatPreference: z.enum(["WINDOW", "AISLE", "NO_PREFERENCE"]),
  })
  .refine((value) => value.returnFlightId !== value.outboundFlightId, {
    message: "Outbound and return flights must be different",
    path: ["returnFlightId"],
  });

export const bookingLookupSchema = z.object({
  confirmationCode: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^STW-[A-F0-9]{6}$/, "Use a valid Stillway confirmation code"),
  email: z.string().trim().toLowerCase().email().max(160),
});

export type FlightSearchParsed = z.infer<typeof flightSearchSchema>;
export type CreateBookingParsed = z.infer<typeof createBookingSchema>;
export type BookingLookupParsed = z.infer<typeof bookingLookupSchema>;

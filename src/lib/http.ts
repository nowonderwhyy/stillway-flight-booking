import { ZodError } from "zod";

export function validationResponse(error: ZodError) {
  return Response.json(
    {
      error: "Please review the highlighted information.",
      fields: error.flatten().fieldErrors,
    },
    { status: 400 },
  );
}

export function serverErrorResponse() {
  return Response.json(
    { error: "Stillway could not complete that request. Please try again." },
    { status: 500 },
  );
}

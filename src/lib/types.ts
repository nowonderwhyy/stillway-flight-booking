export type AirportSummary = {
  code: string;
  city: string;
  name: string;
  timezone: string;
};

export type CarrierSummary = {
  code: string;
  name: string;
};

export type FlightResult = {
  id: number;
  flightNumber: string;
  carrier: CarrierSummary;
  origin: AirportSummary;
  destination: AirportSummary;
  departureAt: string;
  arrivalAt: string;
  durationMinutes: number;
  stops: number;
  priceCents: number;
  co2Kg: number;
  availableSeats: number;
};

export type FlightSearchInput = {
  origin: string;
  destination: string;
  date: string;
  travelers: number;
};

export type JourneyWeights = {
  value: number;
  speed: number;
  rest: number;
  impact: number;
};

export type JourneyDimensionScores = JourneyWeights;

export type JourneyScoreBreakdown = {
  score: number;
  dimensions: JourneyDimensionScores;
  weights: JourneyWeights;
  explanations: string[];
};

export type RankedFlight = FlightResult & {
  journeyFit: JourneyScoreBreakdown;
};

export type CreateBookingInput = {
  outboundFlightId: number;
  returnFlightId?: number;
  travelerCount: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  seatPreference: "WINDOW" | "AISLE" | "NO_PREFERENCE";
};

export type BookingLookupInput = {
  confirmationCode: string;
  email: string;
};

export type BookingLegResult = {
  direction: "OUTBOUND" | "RETURN";
  sequence: number;
  priceCents: number;
  flight: FlightResult;
};

export type BookingConfirmation = {
  id: string;
  confirmationCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  seatPreference: "WINDOW" | "AISLE" | "NO_PREFERENCE";
  travelerCount: number;
  totalCents: number;
  status: "CONFIRMED";
  createdAt: string;
  legs: BookingLegResult[];
};

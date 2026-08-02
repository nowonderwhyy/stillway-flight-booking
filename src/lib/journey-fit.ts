import type {
  FlightResult,
  JourneyDimensionScores,
  JourneyScoreBreakdown,
  JourneyWeights,
  RankedFlight,
} from "@/lib/types";

export const JOURNEY_PRESETS = {
  balanced: { value: 25, speed: 25, rest: 25, impact: 25 },
  value: { value: 55, speed: 15, rest: 15, impact: 15 },
  rested: { value: 15, speed: 20, rest: 50, impact: 15 },
  fastest: { value: 15, speed: 60, rest: 15, impact: 10 },
  lighter: { value: 15, speed: 15, rest: 10, impact: 60 },
} satisfies Record<string, JourneyWeights>;

export type JourneyPreset = keyof typeof JOURNEY_PRESETS;

const dimensionCopy: Record<keyof JourneyWeights, string> = {
  value: "Strong value for this search",
  speed: "A shorter, more direct journey",
  rest: "Timing that supports an easier arrival",
  impact: "Lower estimated emissions than nearby options",
};

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function normalizedScore(value: number, min: number, max: number, inverse = false) {
  if (min === max) return 1;
  const score = (value - min) / (max - min);
  return inverse ? 1 - score : score;
}

function localHour(timestamp: string, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(timestamp));
  return Number(parts.find((part) => part.type === "hour")?.value ?? 12);
}

function departureComfort(hour: number) {
  if (hour >= 7 && hour < 12) return 1;
  if (hour >= 12 && hour < 17) return 0.88;
  if (hour >= 6 && hour < 7) return 0.74;
  if (hour >= 17 && hour < 21) return 0.62;
  return 0.32;
}

function arrivalComfort(hour: number) {
  if (hour >= 8 && hour < 20) return 1;
  if (hour >= 20 && hour < 22) return 0.7;
  if (hour >= 6 && hour < 8) return 0.62;
  return 0.3;
}

export function normalizeJourneyWeights(weights: JourneyWeights): JourneyWeights {
  const nonNegative = {
    value: Math.max(0, weights.value),
    speed: Math.max(0, weights.speed),
    rest: Math.max(0, weights.rest),
    impact: Math.max(0, weights.impact),
  };
  const total = Object.values(nonNegative).reduce((sum, value) => sum + value, 0);
  if (total === 0) return { value: 0.25, speed: 0.25, rest: 0.25, impact: 0.25 };
  return {
    value: nonNegative.value / total,
    speed: nonNegative.speed / total,
    rest: nonNegative.rest / total,
    impact: nonNegative.impact / total,
  };
}

export function rebalanceJourneyWeights(
  weights: JourneyWeights,
  changedKey: keyof JourneyWeights,
  requestedValue: number,
): JourneyWeights {
  const keys = Object.keys(weights) as (keyof JourneyWeights)[];
  const otherKeys = keys.filter((key) => key !== changedKey);
  const requestedUnits = Math.round(clamp(requestedValue / 100) * 20);
  const remainingUnits = 20 - requestedUnits;
  const otherTotal = otherKeys.reduce((total, key) => total + Math.max(0, weights[key]), 0);
  const allocations = otherKeys.map((key, index) => {
    const exactUnits = otherTotal === 0
      ? remainingUnits / otherKeys.length
      : (Math.max(0, weights[key]) / otherTotal) * remainingUnits;
    return { key, index, units: Math.floor(exactUnits), remainder: exactUnits - Math.floor(exactUnits) };
  });
  let unassignedUnits = remainingUnits - allocations.reduce((total, allocation) => total + allocation.units, 0);

  allocations
    .slice()
    .sort((a, b) => b.remainder - a.remainder || a.index - b.index)
    .forEach((allocation) => {
      if (unassignedUnits > 0) {
        allocations[allocation.index].units += 1;
        unassignedUnits -= 1;
      }
    });

  const result = { ...weights, [changedKey]: requestedUnits * 5 };
  allocations.forEach(({ key, units }) => {
    result[key] = units * 5;
  });
  return result;
}

export function rankFlights(flights: FlightResult[], weights: JourneyWeights): RankedFlight[] {
  if (flights.length === 0) return [];

  const prices = flights.map((flight) => flight.priceCents);
  const durations = flights.map((flight) => flight.durationMinutes);
  const emissions = flights.map((flight) => flight.co2Kg);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const minDuration = Math.min(...durations);
  const maxDuration = Math.max(...durations);
  const minEmissions = Math.min(...emissions);
  const maxEmissions = Math.max(...emissions);
  const normalizedWeights = normalizeJourneyWeights(weights);

  return flights
    .map((flight) => {
      const durationScore = normalizedScore(flight.durationMinutes, minDuration, maxDuration, true);
      const stopsScore = flight.stops === 0 ? 1 : flight.stops === 1 ? 0.45 : 0.1;
      const dimensions: JourneyDimensionScores = {
        value: normalizedScore(flight.priceCents, minPrice, maxPrice, true),
        speed: clamp(durationScore * 0.78 + stopsScore * 0.22),
        rest: clamp(
          departureComfort(localHour(flight.departureAt, flight.origin.timezone)) * 0.45 +
            arrivalComfort(localHour(flight.arrivalAt, flight.destination.timezone)) * 0.55,
        ),
        impact: normalizedScore(flight.co2Kg, minEmissions, maxEmissions, true),
      };
      const contributions = (Object.keys(normalizedWeights) as (keyof JourneyWeights)[]).map((key) => ({
        key,
        contribution: dimensions[key] * normalizedWeights[key],
      }));
      const score = Math.round(
        contributions.reduce((total, contribution) => total + contribution.contribution, 0) * 100,
      );
      const explanations = contributions
        .filter(({ key, contribution }) => normalizedWeights[key] > 0 && contribution > 0)
        .sort((a, b) => b.contribution - a.contribution)
        .slice(0, 2)
        .map(({ key }) => dimensionCopy[key]);
      const journeyFit: JourneyScoreBreakdown = {
        score,
        dimensions,
        weights: normalizedWeights,
        explanations,
      };
      return { ...flight, journeyFit };
    })
    .sort((a, b) => b.journeyFit.score - a.journeyFit.score || a.priceCents - b.priceCents);
}

import { describe, expect, it } from "vitest";
import { JOURNEY_PRESETS, normalizeJourneyWeights, rankFlights, rebalanceJourneyWeights } from "@/lib/journey-fit";
import { flight } from "./fixtures";

describe("Journey Fit", () => {
  it("ships the approved preset weights", () => {
    expect(JOURNEY_PRESETS.value).toEqual({ value: 55, speed: 15, rest: 15, impact: 15 });
    expect(JOURNEY_PRESETS.rested).toEqual({ value: 15, speed: 20, rest: 50, impact: 15 });
    expect(JOURNEY_PRESETS.fastest).toEqual({ value: 15, speed: 60, rest: 15, impact: 10 });
    expect(JOURNEY_PRESETS.lighter).toEqual({ value: 15, speed: 15, rest: 10, impact: 60 });
  });

  it("normalizes custom weights and safely handles an all-zero choice", () => {
    expect(normalizeJourneyWeights({ value: 10, speed: 20, rest: 30, impact: 40 })).toEqual({ value: 0.1, speed: 0.2, rest: 0.3, impact: 0.4 });
    expect(normalizeJourneyWeights({ value: 0, speed: 0, rest: 0, impact: 0 })).toEqual({ value: 0.25, speed: 0.25, rest: 0.25, impact: 0.25 });
  });

  it("keeps custom priorities inside a fixed 100-point tradeoff budget", () => {
    const speedFirst = rebalanceJourneyWeights(JOURNEY_PRESETS.balanced, "speed", 70);
    expect(speedFirst).toEqual({ value: 10, speed: 70, rest: 10, impact: 10 });
    expect(Object.values(speedFirst).reduce((total, value) => total + value, 0)).toBe(100);

    const allSpeed = rebalanceJourneyWeights(speedFirst, "speed", 100);
    expect(allSpeed).toEqual({ value: 0, speed: 100, rest: 0, impact: 0 });
  });

  it("deterministically reorders the same result set by priority", () => {
    const cheapest = flight({ id: 1, priceCents: 19000, durationMinutes: 410, stops: 1, co2Kg: 490 });
    const fastest = flight({ id: 2, priceCents: 38000, durationMinutes: 260, stops: 0, co2Kg: 450 });
    const lighter = flight({ id: 3, priceCents: 33000, durationMinutes: 300, stops: 0, co2Kg: 350 });

    expect(rankFlights([fastest, lighter, cheapest], JOURNEY_PRESETS.value)[0].id).toBe(1);
    expect(rankFlights([cheapest, lighter, fastest], JOURNEY_PRESETS.fastest)[0].id).toBe(2);
    expect(rankFlights([cheapest, fastest, lighter], JOURNEY_PRESETS.lighter)[0].id).toBe(3);
    expect(rankFlights([cheapest, fastest, lighter], JOURNEY_PRESETS.lighter)[0].journeyFit.explanations).toHaveLength(2);
  });

  it("never explains a dimension the traveler assigned zero priority", () => {
    const fastest = flight({ id: 2, priceCents: 38000, durationMinutes: 260, stops: 0, co2Kg: 450 });
    const slower = flight({ id: 1, priceCents: 19000, durationMinutes: 410, stops: 1, co2Kg: 390 });
    const ranked = rankFlights([slower, fastest], { value: 0, speed: 100, rest: 0, impact: 0 });

    expect(ranked[0].journeyFit.explanations).toEqual(["A shorter, more direct journey"]);
  });
});

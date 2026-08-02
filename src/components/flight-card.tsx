"use client";

import type { CSSProperties } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Leaf, Plane, Sparkles } from "lucide-react";
import { formatCurrency, formatDuration, formatShortDate, formatTime } from "@/lib/format";
import type { RankedFlight } from "@/lib/types";

type FlightCardProps = {
  flight: RankedFlight;
  selected: boolean;
  onSelect: () => void;
};

export function FlightCard({ flight, selected, onSelect }: FlightCardProps) {
  const reduceMotion = useReducedMotion();
  const scoreStyle = { "--fit-score": `${flight.journeyFit.score * 3.6}deg` } as CSSProperties;

  return (
    <motion.article
      layout={!reduceMotion}
      transition={{ layout: { duration: reduceMotion ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] } }}
      className={selected ? "flight-card flight-card-selected" : "flight-card"}
    >
      <div className="flight-card-top">
        <div className="carrier-block">
          <span className="carrier-code">{flight.carrier.code}</span>
          <span>
            <strong>{flight.carrier.name}</strong>
            <small>{flight.flightNumber} · Sample schedule</small>
          </span>
        </div>
        <div className="fit-score" style={scoreStyle} aria-label={`Journey Fit score ${flight.journeyFit.score} out of 100`}>
          <span>{flight.journeyFit.score}</span>
        </div>
      </div>

      <div className="route-row">
        <div className="time-block">
          <strong>{formatTime(flight.departureAt, flight.origin.timezone)}</strong>
          <span>{flight.origin.code}</span>
          <small>{formatShortDate(flight.departureAt, flight.origin.timezone)}</small>
        </div>
        <div className="route-line" aria-label={`${formatDuration(flight.durationMinutes)}, ${flight.stops === 0 ? "nonstop" : `${flight.stops} stop`}`}>
          <span>{formatDuration(flight.durationMinutes)}</span>
          <div>
            <i />
            <Plane size={15} aria-hidden="true" />
          </div>
          <small>{flight.stops === 0 ? "Nonstop" : `${flight.stops} stop`}</small>
        </div>
        <div className="time-block time-block-right">
          <strong>{formatTime(flight.arrivalAt, flight.destination.timezone)}</strong>
          <span>{flight.destination.code}</span>
          <small>{formatShortDate(flight.arrivalAt, flight.destination.timezone)}</small>
        </div>
      </div>

      <div className="flight-card-bottom">
        <div className="fit-reasons">
          <span>
            <Sparkles size={14} aria-hidden="true" /> {flight.journeyFit.explanations[0]}
          </span>
          <span>
            <Leaf size={14} aria-hidden="true" /> {flight.co2Kg} kg estimated CO₂
          </span>
        </div>
        <div className="fare-block">
          <span>from</span>
          <strong>{formatCurrency(flight.priceCents)}</strong>
          <small>per traveler</small>
          <button type="button" onClick={onSelect} aria-pressed={selected}>
            {selected ? "Selected" : "Choose"}
            {!selected && <ArrowRight size={15} aria-hidden="true" />}
          </button>
        </div>
      </div>
    </motion.article>
  );
}

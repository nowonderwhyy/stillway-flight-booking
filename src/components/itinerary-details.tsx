import { ArrowRight, Plane } from "lucide-react";
import { formatCurrency, formatDuration, formatLongDate, formatTime } from "@/lib/format";
import type { FlightResult } from "@/lib/types";

export function ItineraryLeg({ flight, label, priceCents }: { flight: FlightResult; label: string; priceCents?: number }) {
  return (
    <article className="itinerary-leg">
      <div className="itinerary-leg-heading">
        <span>{label}</span>
        <small>{flight.carrier.name} · {flight.flightNumber}</small>
      </div>
      <p>{formatLongDate(flight.departureAt, flight.origin.timezone)}</p>
      <div className="itinerary-route">
        <div><strong>{formatTime(flight.departureAt, flight.origin.timezone)}</strong><span>{flight.origin.code}</span><small>{flight.origin.city}</small></div>
        <div className="itinerary-line"><span>{formatDuration(flight.durationMinutes)}</span><i><Plane size={14} /></i><small>{flight.stops === 0 ? "Nonstop" : `${flight.stops} stop`}</small></div>
        <div><strong>{formatTime(flight.arrivalAt, flight.destination.timezone)}</strong><span>{flight.destination.code}</span><small>{flight.destination.city}</small></div>
      </div>
      <div className="itinerary-leg-meta">
        <span>{flight.co2Kg} kg estimated CO₂</span>
        <strong>{formatCurrency(priceCents ?? flight.priceCents)}</strong>
      </div>
    </article>
  );
}

export function BookingItinerary({ outbound, returning, travelers }: { outbound: FlightResult; returning?: FlightResult | null; travelers: number }) {
  const total = (outbound.priceCents + (returning?.priceCents ?? 0)) * travelers;
  return (
    <aside className="booking-itinerary" aria-label="Trip summary">
      <p className="eyebrow">Your trip</p>
      <h2>{outbound.origin.city} <ArrowRight size={20} /> {outbound.destination.city}</h2>
      <ItineraryLeg flight={outbound} label="Outbound" />
      {returning && <ItineraryLeg flight={returning} label="Return" />}
      <div className="booking-total">
        <span><small>Sample total</small><strong>{formatCurrency(total)}</strong></span>
        <p>{travelers} {travelers === 1 ? "traveler" : "travelers"} · taxes represented · no payment</p>
      </div>
    </aside>
  );
}

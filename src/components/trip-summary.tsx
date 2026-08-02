"use client";

import Link from "next/link";
import { ArrowRight, Check, Plane } from "lucide-react";
import { formatCurrency, formatShortDate, formatTime } from "@/lib/format";
import type { FlightResult } from "@/lib/types";

type TripSummaryProps = {
  outbound: FlightResult | null;
  returning: FlightResult | null;
  travelers: number;
  roundTrip: boolean;
  onEditOutbound: () => void;
  onEditReturn: () => void;
};

function SummaryLeg({ label, flight, onEdit }: { label: string; flight: FlightResult; onEdit: () => void }) {
  return (
    <div className="summary-leg">
      <div>
        <span className="summary-check"><Check size={12} /></span>
        <small>{label}</small>
        <button type="button" onClick={onEdit}>Edit</button>
      </div>
      <strong>{flight.origin.code} <Plane size={13} /> {flight.destination.code}</strong>
      <p>
        {formatShortDate(flight.departureAt, flight.origin.timezone)} · {formatTime(flight.departureAt, flight.origin.timezone)}
      </p>
      <span>{flight.carrier.code} {flight.flightNumber.replace(`${flight.carrier.code} `, "")}</span>
    </div>
  );
}

export function TripSummary({ outbound, returning, travelers, roundTrip, onEditOutbound, onEditReturn }: TripSummaryProps) {
  const ready = Boolean(outbound && (!roundTrip || returning));
  const totalCents = ((outbound?.priceCents ?? 0) + (returning?.priceCents ?? 0)) * travelers;
  const bookingHref = ready
    ? `/book?outbound=${outbound?.id}${returning ? `&return=${returning.id}` : ""}&travelers=${travelers}`
    : "#";

  return (
    <aside className={ready ? "trip-summary trip-summary-ready" : "trip-summary"} aria-label="Selected itinerary">
      <p className="eyebrow">Your itinerary</p>
      <h3>{ready ? "A good journey, assembled." : "Choose your flights"}</h3>
      {!outbound && <p className="summary-empty">Select an outbound option and your trip will take shape here.</p>}
      {outbound && <SummaryLeg label="Outbound" flight={outbound} onEdit={onEditOutbound} />}
      {roundTrip && !returning && outbound && <p className="summary-empty summary-empty-return">Now choose your return to Atlanta.</p>}
      {returning && <SummaryLeg label="Return" flight={returning} onEdit={onEditReturn} />}
      <div className="summary-total">
        <span>
          <small>Sample total</small>
          <strong>{ready ? formatCurrency(totalCents) : "—"}</strong>
        </span>
        <small>{travelers} {travelers === 1 ? "traveler" : "travelers"} · no payment</small>
      </div>
      {ready ? (
        <Link href={bookingHref} className="primary-button summary-action">
          Continue to details <ArrowRight size={16} />
        </Link>
      ) : (
        <button type="button" className="primary-button summary-action" disabled>
          Continue to details
        </button>
      )}
    </aside>
  );
}

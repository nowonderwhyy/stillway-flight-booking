"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Mail, Search } from "lucide-react";
import { ItineraryLeg } from "@/components/itinerary-details";
import { formatCurrency, seatPreferenceLabel } from "@/lib/format";
import type { BookingConfirmation } from "@/lib/types";

export function TripsLookup() {
  const [booking, setBooking] = useState<BookingConfirmation | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    setBooking(null);
    const data = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/bookings/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          confirmationCode: data.get("confirmationCode"),
          email: data.get("email"),
        }),
      });
      const result = (await response.json()) as { booking?: BookingConfirmation; error?: string };
      if (!response.ok || !result.booking) throw new Error(result.error ?? "Stillway could not find that trip.");
      setBooking(result.booking);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Stillway could not find that trip.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="trips-page">
      <section className="shell trips-intro">
        <p className="eyebrow">My Trips</p>
        <h1>Your journey,<br />within easy reach.</h1>
        <p>Enter the confirmation code and email from your sample booking. No account is needed.</p>
      </section>

      <div className="shell trips-layout">
        <form className="lookup-form" onSubmit={submit}>
          <div className="lookup-icon"><Search size={22} /></div>
          <h2>Find a trip</h2>
          <p>Confirmation codes begin with STW- and are not case sensitive.</p>
          <label>
            <span>Confirmation code</span>
            <input name="confirmationCode" autoCapitalize="characters" autoComplete="off" required placeholder="STW-ABC123" pattern="[Ss][Tt][Ww]-[A-Za-z0-9]{6}" />
          </label>
          <label>
            <span>Email</span>
            <input name="email" type="email" autoComplete="email" required placeholder="avery@example.com" />
          </label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="primary-button lookup-button" type="submit" disabled={pending}>
            {pending ? <span className="button-spinner" /> : <Search size={16} />}
            {pending ? "Looking for your trip" : "Find my trip"}
          </button>
          <small className="lookup-privacy">Only the matching confirmation and normalized email reveal a booking.</small>
        </form>

        <section className={booking ? "lookup-result lookup-result-found" : "lookup-result"} aria-live="polite">
          {!booking ? (
            <div className="lookup-empty">
              <span><Mail size={24} /></span>
              <h2>Your saved itinerary will appear here.</h2>
              <p>Complete a sample booking first, then return with the code from its confirmation page.</p>
              <Link href="/" className="text-link">Search sample flights <ArrowRight size={15} /></Link>
            </div>
          ) : (
            <>
              <div className="lookup-result-heading">
                <span className="confirmation-check"><Check size={24} /></span>
                <div><p className="eyebrow">Confirmed</p><h2>{booking.confirmationCode}</h2><p>{booking.firstName} {booking.lastName} · {seatPreferenceLabel(booking.seatPreference)} seat</p></div>
              </div>
              {booking.legs.map((leg) => <ItineraryLeg key={leg.direction} label={leg.direction === "OUTBOUND" ? "Outbound" : "Return"} flight={leg.flight} priceCents={leg.priceCents} />)}
              <div className="confirmation-total"><span>Confirmed sample total</span><strong>{formatCurrency(booking.totalCents)}</strong></div>
              <Link href={`/confirmation/${booking.id}`} className="text-link">Open full confirmation <ArrowRight size={15} /></Link>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

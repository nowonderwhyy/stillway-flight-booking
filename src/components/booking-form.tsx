"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, LockKeyhole, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { BookingItinerary } from "@/components/itinerary-details";
import type { BookingConfirmation, FlightResult } from "@/lib/types";

export function BookingForm({ outbound, returning, travelers }: { outbound: FlightResult; returning?: FlightResult | null; travelers: number }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const data = new FormData(event.currentTarget);
    const payload = {
      outboundFlightId: outbound.id,
      returnFlightId: returning?.id,
      travelerCount: travelers,
      firstName: data.get("firstName"),
      lastName: data.get("lastName"),
      email: data.get("email"),
      phone: data.get("phone"),
      seatPreference: data.get("seatPreference"),
    };

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { booking?: BookingConfirmation; error?: string };
      if (!response.ok || !result.booking) throw new Error(result.error ?? "Stillway could not confirm this trip.");
      router.push(`/confirmation/${result.booking.id}`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Stillway could not confirm this trip.");
      setPending(false);
    }
  }

  return (
    <main className="booking-page">
      <div className="shell booking-page-heading">
        <Link href="/" className="back-link"><ArrowLeft size={15} /> Back to flight choices</Link>
        <p className="eyebrow">Guest details</p>
        <h1>One last step,<br />kept simple.</h1>
        <p>Tell us who is traveling. This class demonstration never asks for payment.</p>
      </div>
      <div className="shell booking-layout">
        <form className="traveler-form" onSubmit={submit}>
          <div className="form-intro">
            <span className="form-icon"><ShieldCheck size={20} /></span>
            <div><h2>Lead traveler</h2><p>We will use this email with your confirmation code to find the trip later.</p></div>
          </div>
          <div className="form-grid">
            <label><span>First name</span><input name="firstName" autoComplete="given-name" required maxLength={50} placeholder="Avery" /></label>
            <label><span>Last name</span><input name="lastName" autoComplete="family-name" required maxLength={50} placeholder="Morgan" /></label>
            <label className="form-grid-wide"><span>Email</span><input name="email" type="email" autoComplete="email" required maxLength={160} placeholder="avery@example.com" /></label>
            <label className="form-grid-wide"><span>Phone</span><input name="phone" type="tel" autoComplete="tel" required minLength={7} maxLength={24} placeholder="(404) 555-0142" /></label>
            <fieldset className="seat-fieldset form-grid-wide">
              <legend>Seat preference</legend>
              <label><input type="radio" name="seatPreference" value="WINDOW" defaultChecked /><span>Window<small>Light and a view</small></span></label>
              <label><input type="radio" name="seatPreference" value="AISLE" /><span>Aisle<small>Easy movement</small></span></label>
              <label><input type="radio" name="seatPreference" value="NO_PREFERENCE" /><span>No preference<small>Keep it flexible</small></span></label>
            </fieldset>
          </div>
          <div className="demo-notice"><LockKeyhole size={18} /><span><strong>Demo booking — no payment or charge.</strong> Submitting creates a real local SQLite booking and reduces sample seat inventory.</span></div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="primary-button confirm-button" type="submit" disabled={pending}>{pending ? <span className="button-spinner" /> : null}{pending ? "Confirming your trip" : "Confirm sample booking"}{!pending && <ArrowRight size={16} />}</button>
        </form>
        <BookingItinerary outbound={outbound} returning={returning} travelers={travelers} />
      </div>
    </main>
  );
}

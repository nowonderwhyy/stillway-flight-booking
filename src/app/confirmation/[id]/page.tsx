import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Mail } from "lucide-react";
import { CopyConfirmation } from "@/components/copy-confirmation";
import { ItineraryLeg } from "@/components/itinerary-details";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getBookingById } from "@/lib/booking-service";
import { formatCurrency, seatPreferenceLabel } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const booking = await getBookingById(id);
  if (!booking) notFound();

  return (
    <>
      <SiteHeader />
      <main className="confirmation-page">
        <div className="shell confirmation-shell">
          <section className="confirmation-hero">
            <span className="confirmation-check"><Check size={34} /></span>
            <p className="eyebrow">Trip confirmed</p>
            <h1>You are ready to move<br />at your own pace.</h1>
            <p>A local SQLite booking now holds your sample itinerary. Save the code below with your email.</p>
          </section>
          <div className="confirmation-grid">
            <section className="confirmation-details">
              <div className="confirmation-code-row"><span><small>Confirmation code</small><strong>{booking.confirmationCode}</strong></span><CopyConfirmation code={booking.confirmationCode} /></div>
              <div className="confirmation-person"><Mail size={18} /><span><strong>{booking.firstName} {booking.lastName}</strong><small>{booking.email} · {seatPreferenceLabel(booking.seatPreference)} seat</small></span></div>
              {booking.legs.map((leg) => <ItineraryLeg key={leg.direction} label={leg.direction === "OUTBOUND" ? "Outbound" : "Return"} flight={leg.flight} priceCents={leg.priceCents} />)}
              <div className="confirmation-total"><span>Confirmed sample total</span><strong>{formatCurrency(booking.totalCents)}</strong></div>
            </section>
            <aside className="confirmation-next">
              <p className="eyebrow">Keep this close</p><h2>Find the trip again anytime.</h2><p>Use the confirmation code and <strong>{booking.email}</strong> on My Trips. No account is required.</p>
              <Link href="/trips" className="primary-button">Open My Trips <ArrowRight size={16} /></Link>
              <Link href="/" className="text-link">Search another route</Link>
            </aside>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

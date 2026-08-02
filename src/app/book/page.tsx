import { notFound } from "next/navigation";
import { BookingForm } from "@/components/booking-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getFlightById } from "@/lib/flight-service";

export const dynamic = "force-dynamic";

export default async function BookPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const outboundId = Number(Array.isArray(params.outbound) ? params.outbound[0] : params.outbound);
  const returnId = Number(Array.isArray(params.return) ? params.return[0] : params.return);
  const travelers = Math.min(6, Math.max(1, Number(Array.isArray(params.travelers) ? params.travelers[0] : params.travelers) || 1));
  if (!Number.isInteger(outboundId) || outboundId <= 0) notFound();

  const [outbound, returning] = await Promise.all([
    getFlightById(outboundId),
    Number.isInteger(returnId) && returnId > 0 ? getFlightById(returnId) : Promise.resolve(null),
  ]);
  if (!outbound) notFound();

  return (
    <>
      <SiteHeader />
      <BookingForm outbound={outbound} returning={returning} travelers={travelers} />
      <SiteFooter />
    </>
  );
}

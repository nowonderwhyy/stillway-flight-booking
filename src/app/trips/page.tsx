import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TripsLookup } from "@/components/trips-lookup";

export const metadata: Metadata = {
  title: "My Trips | Stillway",
  description: "Recover a Stillway sample booking using its confirmation code and email.",
};

export default function TripsPage() {
  return (
    <>
      <SiteHeader />
      <TripsLookup />
      <SiteFooter />
    </>
  );
}

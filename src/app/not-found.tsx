import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function NotFoundPage() {
  return (
    <>
      <SiteHeader />
      <main className="error-state">
        <div className="error-state-card">
          <p className="eyebrow">404 · Route not found</p>
          <h1>That path is not part of this journey.</h1>
          <p>The sample flight or confirmation may no longer be available. Start again from Stillway search or recover a saved booking through My Trips.</p>
          <div>
            <Link className="primary-button" href="/">Search flights <ArrowRight size={15} /></Link>
            <Link className="text-link" href="/trips">Open My Trips</Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

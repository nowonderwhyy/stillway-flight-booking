"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowRight, RefreshCcw } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";

export default function ErrorPage({ error, unstable_retry }: { error: Error & { digest?: string }; unstable_retry: () => void }) {
  useEffect(() => {
    console.error("Stillway route error", error);
  }, [error]);

  return (
    <main className="error-state">
      <div className="error-state-card">
        <BrandMark />
        <p className="eyebrow">A pause in the journey</p>
        <h1>Stillway could not reach its local data.</h1>
        <p>Check that the SQLite setup is complete and the production server is running, then try this page again.</p>
        <div>
          <button className="primary-button" type="button" onClick={() => unstable_retry()}><RefreshCcw size={16} /> Try again</button>
          <Link className="text-link" href="/">Return home <ArrowRight size={15} /></Link>
        </div>
      </div>
    </main>
  );
}

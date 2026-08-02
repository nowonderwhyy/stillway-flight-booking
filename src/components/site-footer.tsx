import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <BrandMark />
          <p className="footer-tagline">Travel at your rhythm.</p>
        </div>
        <div className="footer-links">
          <Link href="/">Search flights</Link>
          <Link href="/trips">Find my trip</Link>
          <a href="https://github.com/nowonderwhyy/stillway-flight-booking" target="_blank" rel="noreferrer">
            Source code
          </a>
        </div>
        <p className="footer-disclaimer">
          A class demonstration using fictional schedules and prices. Airline names identify sample carriers only;
          Stillway is not affiliated with or endorsed by them. No payment is collected.
        </p>
      </div>
    </footer>
  );
}

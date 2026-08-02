import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";

export function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  return (
    <header className={overlay ? "site-header site-header-overlay" : "site-header site-header-solid"}>
      <div className="shell header-inner">
        <Link href="/" className="header-brand" aria-label="Stillway home">
          <BrandMark />
        </Link>
        <nav aria-label="Primary navigation" className="header-nav">
          <Link href="/#explore">Explore</Link>
          <Link href="/trips">My trips</Link>
          <span className="sample-pill">Sample flights</span>
        </nav>
      </div>
    </header>
  );
}

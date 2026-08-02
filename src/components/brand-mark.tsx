import { Plane } from "lucide-react";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="brand-mark" aria-label="Stillway">
      <span className="brand-symbol" aria-hidden="true">
        <Plane size={15} strokeWidth={1.8} />
      </span>
      {!compact && <span>Stillway</span>}
    </span>
  );
}

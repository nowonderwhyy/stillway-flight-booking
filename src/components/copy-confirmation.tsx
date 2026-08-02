"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyConfirmation({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button type="button" className="copy-button" onClick={async () => { await navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1600); }}>
      {copied ? <Check size={15} /> : <Copy size={15} />}{copied ? "Copied" : "Copy"}
    </button>
  );
}

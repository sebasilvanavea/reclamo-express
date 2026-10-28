"use client";

import { useState } from "react";

export function CopyButton({ text, label = "Copiar", className = "btn-ghost btn-sm" }: { text: string; label?: string; className?: string }) {
  const [done, setDone] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      setTimeout(() => setDone(false), 1600);
    } catch {
      window.prompt("Copia el texto:", text);
    }
  }
  return (
    <button type="button" onClick={copy} className={className}>
      {done ? "Copiado ✓" : label}
    </button>
  );
}

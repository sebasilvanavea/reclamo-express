import { ESTADOS, type Estado } from "@/lib/types";

const TONES = {
  neutral: "bg-ink-100 text-ink-500",
  ink: "bg-ink text-white",
  ok: "bg-ok-soft text-ok",
  warn: "bg-warn-soft text-warn",
  sello: "bg-sello-soft text-sello",
};

export function EstadoBadge({ estado }: { estado: Estado }) {
  const e = ESTADOS[estado] ?? ESTADOS.borrador;
  return <span className={`inline-block rounded-md px-2 py-0.5 font-mono text-[11px] uppercase tracking-wide ${TONES[e.tone]}`}>{e.label}</span>;
}

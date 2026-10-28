import { clp, fechaCorta } from "@/lib/legal/fechas";
import type { Alerta, Derivado, Hito, Organismo } from "@/lib/legal/motor";
import { CopyButton } from "./CopyButton";

export function Diagnostico({ bases, alertas }: { bases: string[]; alertas: Alerta[] }) {
  return (
    <div className="card flex flex-col gap-3">
      <h3 className="label">Diagnóstico legal</h3>
      <div className="flex flex-wrap gap-1.5">
        {bases.map((b) => (
          <span key={b} className="chip">{b}</span>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        {alertas.map((a, i) => (
          <div key={i} className={`rounded-md border-l-[3px] px-3 py-2 text-[13px] ${a.tipo === "ok" ? "border-ok bg-ok-soft" : "border-warn bg-warn-soft"}`}>
            {a.texto}
          </div>
        ))}
      </div>
    </div>
  );
}

export function Reparacion({ d }: { d: Derivado }) {
  return (
    <div className="card flex flex-col gap-1">
      <h3 className="label">Reparación que puedes exigir</h3>
      <div className="font-mono text-[30px] font-medium leading-tight tabular-nums text-ok">{clp(d.big)}</div>
      <div className="font-semibold">{d.bigLabel}</div>
      <p className="text-xs text-ink-500">{d.bigNote}</p>
    </div>
  );
}

export function Plazos({ hitos, plazo }: { hitos: Hito[]; plazo: number }) {
  return (
    <div className="card flex flex-col gap-2">
      <h3 className="label">Plazos</h3>
      <ul className="divide-y divide-dashed divide-ink-100">
        {hitos.map((h, i) => (
          <li key={i} className="grid grid-cols-[92px,1fr] gap-3 py-2 text-[13px]">
            <span className="font-mono text-xs tabular-nums text-ink-300">{h.fecha ? fechaCorta(h.fecha) : "—"}</span>
            <span>{h.texto}</span>
          </li>
        ))}
      </ul>
      <p className="text-xs text-ink-300">Días hábiles de lunes a viernes, descontando feriados nacionales. Fijas {plazo} días hábiles en la carta, el mismo plazo que SERNAC da a las empresas.</p>
    </div>
  );
}

export function Escalada({ organismo, texto }: { organismo: Organismo; texto: string }) {
  return (
    <div className="card flex flex-col gap-3">
      <h3 className="label">Si no responden en el plazo</h3>
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-md border border-sello bg-sello-soft px-2 py-1 font-mono text-xs text-sello">{organismo.n}</span>
        <a href={organismo.url} target="_blank" rel="noopener" className="text-sm underline">{organismo.link}</a>
      </div>
      <p className="text-xs text-ink-500">Pega este texto en el formulario de reclamo del organismo. SERNAC no tiene API pública, así que el ingreso es manual.</p>
      <pre className="whitespace-pre-wrap break-words rounded-md bg-marfil p-3 font-sans text-[13px] leading-relaxed">{texto}</pre>
      <div>
        <CopyButton text={texto} label="Copiar texto para el reclamo" />
      </div>
    </div>
  );
}

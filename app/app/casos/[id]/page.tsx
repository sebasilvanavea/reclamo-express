import Link from "next/link";
import { notFound } from "next/navigation";
import { EstadoBadge } from "@/components/Badge";
import { Carta } from "@/components/Carta";
import { CasoAcciones } from "@/components/CasoAcciones";
import { Diagnostico, Escalada, Plazos, Reparacion } from "@/components/Dossier";
import { emailConfigurado } from "@/lib/email";
import { CATEGORIAS } from "@/lib/legal/categorias";
import { fechaCorta } from "@/lib/legal/fechas";
import { dossier } from "@/lib/legal/motor";
import { createClient } from "@/lib/supabase/server";
import type { Caso, CasoEvento } from "@/lib/types";

export const metadata = { title: "Caso" };

const TIPO_EVENTO: Record<string, string> = {
  creado: "Creado",
  enviado: "Enviado",
  respuesta: "Respuesta",
  escalado: "Escalado",
  nota: "Nota",
  recordatorio: "Recordatorio",
};

export default async function CasoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("cases").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const caso = data as Caso;
  const { data: eventos } = await supabase.from("case_events").select("*").eq("case_id", id).order("created_at", { ascending: true });

  const c = CATEGORIAS[caso.categoria];
  const fechaCarta = caso.enviada_at ? new Date(caso.enviada_at) : new Date(caso.created_at);
  const dx = dossier(caso.datos, { fechaCarta, desde: caso.enviada_at ? new Date(caso.enviada_at) : undefined });
  const carta = caso.carta ?? dx.carta;
  const sello = caso.estado === "borrador" ? "Borrador" : `Enviada ${fechaCorta(fechaCarta)}`;

  return (
    <main className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="eyebrow">
            <Link href="/app" className="hover:underline">Mis casos</Link> / {c.label}
          </p>
          <h1 className="mt-1 font-display text-3xl font-medium sm:text-4xl">{caso.item}</h1>
          <p className="mt-1 text-ink-500">
            contra <span className="font-semibold text-ink">{caso.proveedor}</span>
            {caso.proveedor_email && <span className="font-mono text-xs text-ink-300"> · {caso.proveedor_email}</span>}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <EstadoBadge estado={caso.estado} />
          <a href={`/api/casos/${caso.id}/pdf`} className="btn-ghost btn-sm" target="_blank" rel="noopener">
            Descargar PDF
          </a>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr),400px]">
        <div className="flex flex-col gap-6">
          <Carta asunto={caso.asunto ?? dx.asunto} carta={carta} sello={sello} />
          <Escalada organismo={dx.organismo} texto={caso.texto_sernac ?? dx.sernac} />

          <div className="card flex flex-col gap-3">
            <h3 className="label">Expediente</h3>
            <ul className="divide-y divide-ink-100">
              {(eventos as CasoEvento[] | null)?.map((ev) => (
                <li key={ev.id} className="grid grid-cols-[110px,1fr] gap-3 py-2 text-[13px]">
                  <span className="font-mono text-xs text-ink-300">
                    {fechaCorta(new Date(ev.created_at))}
                    <span className="mt-0.5 block text-[10px] uppercase tracking-wide text-sello">{TIPO_EVENTO[ev.tipo] ?? ev.tipo}</span>
                  </span>
                  <span>{ev.detalle}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="flex flex-col gap-4">
          <CasoAcciones caso={caso} emailListo={emailConfigurado()} organismo={dx.organismo.n} />
          <Reparacion d={dx.d} />
          <Diagnostico bases={c.bases} alertas={dx.alertas} />
          <Plazos hitos={dx.hitos} plazo={dx.d.plazo} />
        </aside>
      </div>
    </main>
  );
}

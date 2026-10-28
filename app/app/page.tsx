import Link from "next/link";
import { EstadoBadge } from "@/components/Badge";
import { CATEGORIAS } from "@/lib/legal/categorias";
import { clp, fechaCorta, parseISO, hoy } from "@/lib/legal/fechas";
import { createClient } from "@/lib/supabase/server";
import type { Caso } from "@/lib/types";

export const metadata = { title: "Mis casos" };

const AVISO_PLAN: Record<string, string> = {
  pro: "Mientras conectamos pagos, Pro es gratis: tienes cartas ilimitadas, PDF, envío con copia y seguimiento de plazos activos.",
  pyme: "Te anotamos en la lista de espera del plan Pymes. Te avisaremos a tu correo cuando esté disponible.",
};

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ plan?: string }> }) {
  const supabase = await createClient();
  const { plan } = await searchParams;
  let aviso: string | null = null;
  if (plan && AVISO_PLAN[plan]) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) await supabase.from("profiles").upsert({ id: user.id, email: user.email, plan_interes: plan });
    aviso = AVISO_PLAN[plan];
  }
  const { data } = await supabase
    .from("cases")
    .select("id, categoria, estado, proveedor, item, monto_reparacion, plazo_vence, enviada_at, created_at")
    .order("created_at", { ascending: false });
  const casos = (data ?? []) as Pick<Caso, "id" | "categoria" | "estado" | "proveedor" | "item" | "monto_reparacion" | "plazo_vence" | "enviada_at" | "created_at">[];

  const h = hoy();
  const activos = casos.filter((c) => !["cerrada", "acogida"].includes(c.estado));
  const porVencer = casos.filter((c) => c.estado === "enviada" && c.plazo_vence && (parseISO(c.plazo_vence) as Date) <= h);
  const total = casos.reduce((s, c) => s + (Number(c.monto_reparacion) || 0), 0);

  return (
    <main className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Expediente</p>
          <h1 className="mt-1 font-display text-3xl font-medium sm:text-4xl">Mis casos</h1>
        </div>
        <Link href="/app/nuevo" className="btn-sello">Nuevo reclamo</Link>
      </div>

      {aviso && <p className="rounded-lg border border-ok/30 bg-ok-soft px-4 py-3 text-sm text-ink">{aviso}</p>}

      {casos.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="card">
            <p className="label">Casos activos</p>
            <p className="mt-1 font-mono text-3xl tabular-nums">{activos.length}</p>
          </div>
          <div className={`card ${porVencer.length ? "border-warn/40 bg-warn-soft" : ""}`}>
            <p className="label">Plazos vencidos sin respuesta</p>
            <p className="mt-1 font-mono text-3xl tabular-nums">{porVencer.length}</p>
            {porVencer.length > 0 && <p className="mt-1 text-xs text-warn">Es momento de escalar.</p>}
          </div>
          <div className="card">
            <p className="label">Total reclamado</p>
            <p className="mt-1 font-mono text-3xl tabular-nums">{clp(total)}</p>
          </div>
        </div>
      )}

      {casos.length === 0 ? (
        <div className="card flex flex-col items-start gap-3 py-10">
          <p className="eyebrow">Sin casos todavía</p>
          <h2 className="font-display text-2xl">Tu primer reclamo toma 2 minutos</h2>
          <p className="max-w-[52ch] text-ink-500">Elige la situación, completa los datos del caso y te entregamos la carta con los artículos exactos y el monto que puedes exigir.</p>
          <Link href="/app/nuevo" className="btn">Crear mi primer reclamo</Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-ink-100 bg-white">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-marfil text-left">
              <tr className="[&>th]:px-4 [&>th]:py-3 [&>th]:text-[11px] [&>th]:font-semibold [&>th]:uppercase [&>th]:tracking-[.08em] [&>th]:text-ink-300">
                <th>Caso</th>
                <th>Empresa</th>
                <th>Estado</th>
                <th>Plazo</th>
                <th className="text-right">Reparación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {casos.map((c) => {
                const vence = parseISO(c.plazo_vence);
                const vencido = c.estado === "enviada" && vence && vence <= h;
                return (
                  <tr key={c.id} className="hover:bg-marfil/60">
                    <td className="px-4 py-3">
                      <Link href={`/app/casos/${c.id}`} className="font-semibold hover:underline">{c.item || CATEGORIAS[c.categoria]?.label}</Link>
                      <div className="font-mono text-[11px] text-ink-300">{CATEGORIAS[c.categoria]?.label} · {fechaCorta(new Date(c.created_at))}</div>
                    </td>
                    <td className="px-4 py-3 text-ink-500">{c.proveedor}</td>
                    <td className="px-4 py-3"><EstadoBadge estado={c.estado} /></td>
                    <td className={`px-4 py-3 font-mono text-xs tabular-nums ${vencido ? "text-warn" : "text-ink-500"}`}>
                      {vence ? (vencido ? "venció " : "vence ") + fechaCorta(vence) : "—"}
                    </td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums">{clp(c.monto_reparacion ?? 0)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

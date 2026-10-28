// Valor UF del día desde mindicador.cl (API pública, sin clave). Se cachea una hora en el
// servidor y tiene tiempo límite: si el servicio no responde, se usa el valor de respaldo y
// la persona puede corregirlo a mano en el formulario.

export const UF_RESPALDO = 39500;

export type UfInfo = { valor: number; fecha: string | null; fuente: "mindicador" | "respaldo" };

export async function valorUF(): Promise<UfInfo> {
  try {
    const res = await fetch("https://mindicador.cl/api/uf", {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = (await res.json()) as { serie?: { fecha: string; valor: number }[] };
    const hoy = json.serie?.[0];
    if (!hoy || !Number.isFinite(hoy.valor) || hoy.valor < 10000) throw new Error("respuesta inválida");
    return { valor: Math.round(hoy.valor), fecha: hoy.fecha.slice(0, 10), fuente: "mindicador" };
  } catch {
    return { valor: UF_RESPALDO, fecha: null, fuente: "respaldo" };
  }
}

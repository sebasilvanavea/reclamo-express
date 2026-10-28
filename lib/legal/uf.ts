// Valor UF del día desde mindicador.cl (API pública del Banco Central / SII, sin clave).
// Se cachea una hora en el servidor. Si falla, se usa el valor de respaldo y el usuario
// puede corregirlo a mano en el formulario.

export const UF_RESPALDO = 39500;

export async function valorUF(): Promise<{ valor: number; fecha: string | null; fuente: "mindicador" | "respaldo" }> {
  try {
    const res = await fetch("https://mindicador.cl/api/uf", { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = (await res.json()) as { serie?: { fecha: string; valor: number }[] };
    const hoy = json.serie?.[0];
    if (!hoy || !Number.isFinite(hoy.valor) || hoy.valor < 10000) throw new Error("respuesta inválida");
    return { valor: Math.round(hoy.valor), fecha: hoy.fecha.slice(0, 10), fuente: "mindicador" };
  } catch {
    return { valor: UF_RESPALDO, fecha: null, fuente: "respaldo" };
  }
}

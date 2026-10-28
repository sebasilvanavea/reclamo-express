import { NextResponse } from "next/server";
import { valorUF } from "@/lib/legal/uf";

// El wizard la consulta solo cuando hace falta (compensación por sobreventa de vuelo),
// así la carga del formulario nunca depende de un servicio externo.
export async function GET() {
  const uf = await valorUF();
  return NextResponse.json(uf, {
    headers: { "Cache-Control": uf.fuente === "mindicador" ? "public, max-age=1800" : "no-store" },
  });
}

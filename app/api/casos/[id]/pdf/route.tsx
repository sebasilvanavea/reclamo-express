import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { CartaPDF } from "@/components/CartaPDF";
import { createClient } from "@/lib/supabase/server";
import type { Caso } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { data } = await supabase.from("cases").select("*").eq("id", id).maybeSingle();
  if (!data) return NextResponse.json({ error: "Caso no encontrado" }, { status: 404 });
  const caso = data as Caso;

  const buffer = await renderToBuffer(<CartaPDF caso={caso} />);
  const nombre = `reclamo-${(caso.proveedor ?? "carta").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}.pdf`;
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${nombre}"`,
      "Cache-Control": "private, no-store",
    },
  });
}

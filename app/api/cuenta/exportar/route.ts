import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/** Exporta todos los datos de la persona en JSON (Ley 21.719: derecho de acceso y portabilidad). */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const [{ data: perfil }, { data: casos }, { data: eventos }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    supabase.from("cases").select("*").order("created_at", { ascending: true }),
    supabase.from("case_events").select("*").order("created_at", { ascending: true }),
  ]);

  const exportacion = {
    exportado_en: new Date().toISOString(),
    cuenta: { id: user.id, email: user.email, creada_en: user.created_at },
    perfil,
    casos: (casos ?? []).map((c) => ({ ...c, eventos: (eventos ?? []).filter((e) => e.case_id === c.id) })),
  };

  const fecha = new Date().toISOString().slice(0, 10);
  return new NextResponse(JSON.stringify(exportacion, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="reclamo-express-${fecha}.json"`,
      "Cache-Control": "private, no-store",
    },
  });
}

// Función programada de Netlify: cada día hábil revisa los casos enviados cuyo plazo venció
// y avisa por correo al reclamante que es momento de escalar. Requiere SUPABASE_SERVICE_ROLE_KEY,
// RESEND_API_KEY y EMAIL_FROM como variables de entorno del sitio.
import type { Config } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

export default async function handler() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const resendKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  if (!url || !key || !resendKey || !from) {
    console.log("recordatorios: faltan variables de entorno; nada que hacer");
    return;
  }

  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const resend = new Resend(resendKey);
  const hoy = new Date().toISOString().slice(0, 10);

  const { data: casos, error } = await supabase
    .from("cases")
    .select("id, user_id, proveedor, item, plazo_vence, datos")
    .eq("estado", "enviada")
    .lte("plazo_vence", hoy)
    .is("recordatorio_enviado_at", null)
    .limit(200);

  if (error) {
    console.error("recordatorios:", error.message);
    return;
  }

  for (const caso of casos ?? []) {
    const email = (caso.datos as { email?: string } | null)?.email;
    if (!email) continue;
    try {
      await resend.emails.send({
        from,
        to: [email],
        subject: `Venció el plazo de ${caso.proveedor}: es momento de escalar`,
        text: [
          `Hola,`,
          ``,
          `El plazo que fijaste en tu reclamo contra ${caso.proveedor} (${caso.item}) venció el ${caso.plazo_vence}.`,
          `Si no te respondieron o la respuesta no te satisface, registra el resultado y escala el reclamo a SERNAC con el texto que ya tienes listo:`,
          ``,
          `${site}/app/casos/${caso.id}`,
          ``,
          `Reclamo Express`,
        ].join("\n"),
      });
      await supabase.from("cases").update({ recordatorio_enviado_at: new Date().toISOString() }).eq("id", caso.id);
      await supabase.from("case_events").insert({ case_id: caso.id, user_id: caso.user_id, tipo: "recordatorio", detalle: "Plazo vencido: aviso enviado por correo." });
    } catch (e) {
      console.error("recordatorios: caso", caso.id, (e as Error).message);
    }
  }
}

export const config: Config = {
  schedule: "0 12 * * 1-5", // 12:00 UTC, lunes a viernes: 09:00 en Chile en horario de verano, 08:00 en invierno
};

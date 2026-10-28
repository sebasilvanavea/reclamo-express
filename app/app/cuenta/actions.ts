"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { fmtRut, rutValid } from "@/lib/legal/rut";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

type R = { error?: string; ok?: string };

const esquema = z.object({
  nombre: z.string().trim().max(120).default(""),
  rut: z.string().trim().max(20).default(""),
  telefono: z.string().trim().max(30).default(""),
  ciudad: z.string().trim().max(80).default(""),
  domicilio: z.string().trim().max(200).default(""),
});

export async function guardarPerfil(form: FormData): Promise<R> {
  const parsed = esquema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: "Revisa los datos." };
  const p = parsed.data;
  if (p.rut && !rutValid(p.rut)) return { error: "El RUT no es válido (revisa el dígito verificador)." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/app/cuenta");

  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    email: user.email,
    nombre: p.nombre || null,
    rut: p.rut ? fmtRut(p.rut) : null,
    telefono: p.telefono || null,
    ciudad: p.ciudad || null,
    domicilio: p.domicilio || null,
  });
  if (error) return { error: error.message };
  revalidatePath("/app/cuenta");
  return { ok: "Datos guardados. Se precargarán en tu próximo reclamo." };
}

/**
 * Borra todos los datos de la persona (casos, bitácora, perfil) y, si hay clave de servicio,
 * también la cuenta de acceso. Ley 21.719: derecho de supresión.
 */
export async function eliminarCuenta(confirmacion: string): Promise<R> {
  if (confirmacion.trim().toUpperCase() !== "ELIMINAR") return { error: 'Escribe "ELIMINAR" para confirmar.' };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Con RLS solo se borra lo propio. case_events cae en cascada con cases.
  const { error: e1 } = await supabase.from("cases").delete().eq("user_id", user.id);
  if (e1) return { error: e1.message };
  const { error: e2 } = await supabase.from("profiles").delete().eq("id", user.id);
  if (e2) return { error: e2.message };

  const admin = createAdminClient();
  let cuentaBorrada = false;
  if (admin) {
    const { error } = await admin.auth.admin.deleteUser(user.id);
    cuentaBorrada = !error;
  }

  await supabase.auth.signOut();
  redirect(cuentaBorrada ? "/?cuenta=eliminada" : "/?cuenta=datos-eliminados");
}

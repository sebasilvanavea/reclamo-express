"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { dossier } from "@/lib/legal/motor";
import { createClient } from "@/lib/supabase/server";
import type { DatosCaso } from "@/lib/types";

const esquema = z.object({
  cat: z.enum(["garantia", "retracto", "vuelo", "cobro", "servicio", "telecom"]),
  subtipo: z.string().default(""),
  proveedor: z.string().trim().min(2, "Indica la empresa"),
  proveedorEmail: z.string().trim().email("Correo de la empresa inválido").or(z.literal("")),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida"),
  monto: z.string().default(""),
  ref: z.string().default(""),
  item: z.string().trim().min(2, "Indica el producto o servicio"),
  relato: z.string().default(""),
  meses: z.string().default("1"),
  diasSinServicio: z.string().default("0"),
  planMensual: z.string().default(""),
  distancia: z.string().default("1000-2500"),
  uf: z.string().default("39500"),
  reparacion: z.string().default(""),
  evidencia: z.array(z.string()).default([]),
  nombre: z.string().trim().min(3, "Indica tu nombre completo"),
  rut: z.string().default(""),
  email: z.string().trim().email("Correo inválido"),
  telefono: z.string().default(""),
  ciudad: z.string().default(""),
  domicilio: z.string().default(""),
});

export type CrearCasoResultado = { error: string } | undefined;

export async function crearCaso(input: DatosCaso): Promise<CrearCasoResultado> {
  const parsed = esquema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Revisa los datos" };
  const datos = parsed.data as DatosCaso;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/app/nuevo");

  const dx = dossier(datos);

  const { data: caso, error } = await supabase
    .from("cases")
    .insert({
      user_id: user.id,
      categoria: datos.cat,
      subtipo: datos.subtipo || null,
      estado: "borrador",
      proveedor: datos.proveedor,
      proveedor_email: datos.proveedorEmail || null,
      item: datos.item,
      datos,
      asunto: dx.asunto,
      carta: dx.carta,
      texto_sernac: dx.sernac,
      monto_reparacion: dx.d.big,
      plazo_dias: dx.d.plazo,
      fecha_hecho: datos.fecha,
    })
    .select("id")
    .single();

  if (error || !caso) return { error: error?.message ?? "No pudimos guardar el caso" };

  await supabase.from("case_events").insert({ case_id: caso.id, user_id: user.id, tipo: "creado", detalle: "Caso creado y carta generada." });

  // Guarda los datos personales en el perfil para precargarlos la próxima vez
  await supabase.from("profiles").upsert({
    id: user.id,
    email: user.email,
    nombre: datos.nombre,
    rut: datos.rut || null,
    telefono: datos.telefono || null,
    ciudad: datos.ciudad || null,
    domicilio: datos.domicilio || null,
  });

  redirect(`/app/casos/${caso.id}`);
}

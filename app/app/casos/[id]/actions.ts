"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { emailConfigurado, enviarEmail } from "@/lib/email";
import { addBiz, fechaLarga, hoy, iso } from "@/lib/legal/fechas";
import { createClient } from "@/lib/supabase/server";
import type { Caso, Estado } from "@/lib/types";

type R = { error?: string; ok?: string };

async function contexto(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: caso } = await supabase.from("cases").select("*").eq("id", id).single();
  if (!caso) return { supabase, user, caso: null as Caso | null };
  return { supabase, user, caso: caso as Caso };
}

async function evento(supabase: Awaited<ReturnType<typeof createClient>>, caso: Caso, tipo: string, detalle: string) {
  await supabase.from("case_events").insert({ case_id: caso.id, user_id: caso.user_id, tipo, detalle });
}

export async function marcarEnviada(id: string): Promise<R> {
  const { supabase, caso } = await contexto(id);
  if (!caso) return { error: "Caso no encontrado" };
  const h = hoy();
  const venceD = addBiz(h, caso.plazo_dias);
  const vence = iso(venceD);
  const { error } = await supabase.from("cases").update({ estado: "enviada", enviada_at: new Date().toISOString(), plazo_vence: vence }).eq("id", id);
  if (error) return { error: error.message };
  await evento(supabase, caso, "enviado", `Carta marcada como enviada. El plazo vence el ${fechaLarga(venceD)}.`);
  revalidatePath(`/app/casos/${id}`);
  revalidatePath("/app");
  return { ok: "Caso marcado como enviado. Empezamos a contar el plazo." };
}

export async function enviarPorCorreo(id: string): Promise<R> {
  const { supabase, user, caso } = await contexto(id);
  if (!caso) return { error: "Caso no encontrado" };
  if (!emailConfigurado()) return { error: "El envío automático no está configurado todavía. Copia la carta y envíala desde tu correo, luego márcala como enviada." };
  if (!caso.proveedor_email) return { error: "El caso no tiene correo del proveedor." };
  try {
    await enviarEmail({
      to: caso.proveedor_email,
      cc: user.email ?? undefined,
      replyTo: user.email ?? undefined,
      subject: caso.asunto ?? "Reclamo formal",
      text: caso.carta ?? "",
    });
  } catch (e) {
    return { error: `No se pudo enviar: ${(e as Error).message}` };
  }
  const h = hoy();
  const venceD = addBiz(h, caso.plazo_dias);
  const vence = iso(venceD);
  await supabase.from("cases").update({ estado: "enviada", enviada_at: new Date().toISOString(), plazo_vence: vence }).eq("id", id);
  await evento(supabase, caso, "enviado", `Carta enviada por correo a ${caso.proveedor_email} con copia a ${user.email}. El plazo vence el ${fechaLarga(venceD)}.`);
  revalidatePath(`/app/casos/${id}`);
  revalidatePath("/app");
  return { ok: `Carta enviada a ${caso.proveedor_email} con copia a ti.` };
}

export async function registrarRespuesta(id: string, resultado: Estado, detalle: string): Promise<R> {
  const { supabase, caso } = await contexto(id);
  if (!caso) return { error: "Caso no encontrado" };
  if (!["acogida", "parcial", "rechazada", "sin_respuesta"].includes(resultado)) return { error: "Resultado inválido" };
  const { error } = await supabase
    .from("cases")
    .update({ estado: resultado, respuesta: detalle || null, respondida_at: resultado === "sin_respuesta" ? null : new Date().toISOString() })
    .eq("id", id);
  if (error) return { error: error.message };
  await evento(supabase, caso, "respuesta", `${resultado === "sin_respuesta" ? "Sin respuesta al vencer el plazo." : "Respuesta de la empresa: " + resultado + "."} ${detalle}`.trim());
  revalidatePath(`/app/casos/${id}`);
  revalidatePath("/app");
  return { ok: "Respuesta registrada." };
}

export async function marcarEscalada(id: string, organismo: string): Promise<R> {
  const { supabase, caso } = await contexto(id);
  if (!caso) return { error: "Caso no encontrado" };
  const { error } = await supabase.from("cases").update({ estado: "escalada", escalada_at: new Date().toISOString() }).eq("id", id);
  if (error) return { error: error.message };
  await evento(supabase, caso, "escalado", `Reclamo ingresado en ${organismo}.`);
  revalidatePath(`/app/casos/${id}`);
  revalidatePath("/app");
  return { ok: `Caso escalado a ${organismo}.` };
}

export async function cerrarCaso(id: string, detalle: string): Promise<R> {
  const { supabase, caso } = await contexto(id);
  if (!caso) return { error: "Caso no encontrado" };
  const { error } = await supabase.from("cases").update({ estado: "cerrada" }).eq("id", id);
  if (error) return { error: error.message };
  await evento(supabase, caso, "nota", `Caso cerrado. ${detalle}`.trim());
  revalidatePath(`/app/casos/${id}`);
  revalidatePath("/app");
  return { ok: "Caso cerrado." };
}

export async function agregarNota(id: string, texto: string): Promise<R> {
  const { supabase, caso } = await contexto(id);
  if (!caso) return { error: "Caso no encontrado" };
  if (!texto.trim()) return { error: "Escribe la nota." };
  await evento(supabase, caso, "nota", texto.trim());
  revalidatePath(`/app/casos/${id}`);
  return { ok: "Nota agregada." };
}

export async function eliminarCaso(id: string): Promise<R> {
  const { supabase, caso } = await contexto(id);
  if (!caso) return { error: "Caso no encontrado" };
  const { error } = await supabase.from("cases").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/app");
  redirect("/app");
}

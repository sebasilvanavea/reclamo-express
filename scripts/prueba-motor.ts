// Prueba rápida del motor legal: genera el dossier de un caso por categoría y lo imprime.
// Uso: npx tsx scripts/prueba-motor.ts
import { DATOS_VACIOS, dossier } from "../lib/legal/motor";
import type { DatosCaso } from "../lib/types";

const base: DatosCaso = {
  ...DATOS_VACIOS,
  proveedor: "Tienda Andes Ltda.",
  proveedorEmail: "reclamos@tiendaandes.cl",
  fecha: "2026-09-15",
  monto: "389990",
  ref: "Boleta N° 118.204",
  item: "Lavadora 10 kg",
  relato: "A los 20 días dejó de centrifugar. Llamé al servicio técnico el 10 de octubre (ticket 44812) y me dijeron que no cubría garantía.",
  evidencia: ["Boleta o factura", "Fotos o video de la falla"],
  nombre: "Sebastián Silva",
  rut: "12.345.678-5",
  email: "sebastian@correo.cl",
  telefono: "+56 9 1234 5678",
  ciudad: "Santiago",
  domicilio: "Av. Providencia 1234, depto. 56",
};

const casos: Partial<DatosCaso>[] = [
  { cat: "garantia", reparacion: "devolucion" },
  { cat: "retracto", reparacion: "devolucion", fecha: "2026-10-25", ref: "Orden #A-99812", item: "Audífonos inalámbricos" },
  { cat: "vuelo", subtipo: "denegacion", reparacion: "reembolso", distancia: "2500-4000", uf: "39500", item: "SCL → LIM, LA 2345", ref: "ABC123", monto: "210000" },
  { cat: "cobro", subtipo: "suscripcion", reparacion: "baja", meses: "4", monto: "12990", item: "Suscripción streaming", ref: "Cliente 778812" },
  { cat: "servicio", reparacion: "nueva", item: "Pintura de living y comedor", ref: "Presupuesto 221", fecha: "2026-10-01" },
  { cat: "telecom", subtipo: "corte", reparacion: "termino", planMensual: "25990", diasSinServicio: "9", item: "Internet hogar 500 Mbps", ref: "Servicio 55-1234", fecha: "2026-10-10" },
];

for (const extra of casos) {
  const s = { ...base, ...extra } as DatosCaso;
  const dx = dossier(s);
  console.log("\n" + "=".repeat(90));
  console.log(`${s.cat.toUpperCase()} ${s.subtipo ? "· " + s.subtipo : ""} · reparación: ${s.reparacion}`);
  console.log("=".repeat(90));
  console.log("ASUNTO:", dx.asunto);
  console.log("REPARACIÓN:", dx.d.big, "|", dx.d.bigLabel, "|", dx.d.bigNote);
  console.log("ALERTAS:", dx.alertas.map((a) => `[${a.tipo}] ${a.texto}`).join("\n         "));
  console.log("HITOS:");
  for (const h of dx.hitos) console.log("  ", h.fecha?.toISOString().slice(0, 10) ?? "—", h.texto);
  console.log("\n--- CARTA ---\n" + dx.carta);
  console.log("\n--- TEXTO SERNAC ---\n" + dx.sernac);
}

// Genera un PDF de ejemplo en scripts/salida/ejemplo.pdf para revisar el diseño.
// Uso: npx tsx scripts/prueba-pdf.tsx
import { mkdirSync, writeFileSync } from "node:fs";
import { renderToBuffer } from "@react-pdf/renderer";
import { CartaPDF } from "../components/CartaPDF";
import { DATOS_VACIOS, dossier } from "../lib/legal/motor";
import type { DatosCaso } from "../lib/types";

const s: DatosCaso = {
  ...DATOS_VACIOS,
  cat: "garantia",
  reparacion: "devolucion",
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

async function main() {
  const dx = dossier(s);
  const buffer = await renderToBuffer(<CartaPDF caso={{ asunto: dx.asunto, carta: dx.carta, datos: s }} />);
  mkdirSync("scripts/salida", { recursive: true });
  writeFileSync("scripts/salida/ejemplo.pdf", buffer);
  console.log("PDF generado: scripts/salida/ejemplo.pdf", buffer.length, "bytes");
}
main();

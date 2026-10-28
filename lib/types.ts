export type Categoria = "garantia" | "retracto" | "vuelo" | "cobro" | "servicio" | "telecom";

export type Estado =
  | "borrador"
  | "enviada"
  | "acogida"
  | "parcial"
  | "rechazada"
  | "sin_respuesta"
  | "escalada"
  | "cerrada";

/** Todo lo que captura el formulario. Se guarda tal cual en cases.datos (jsonb). */
export interface DatosCaso {
  cat: Categoria;
  subtipo: string;
  proveedor: string;
  proveedorEmail: string;
  fecha: string; // YYYY-MM-DD
  monto: string;
  ref: string;
  item: string;
  relato: string;
  meses: string;
  diasSinServicio: string;
  planMensual: string;
  distancia: string;
  uf: string;
  reparacion: string;
  evidencia: string[];
  nombre: string;
  rut: string;
  email: string;
  telefono: string;
  ciudad: string;
  domicilio: string;
}

export interface Caso {
  id: string;
  user_id: string;
  categoria: Categoria;
  subtipo: string | null;
  estado: Estado;
  proveedor: string | null;
  proveedor_email: string | null;
  item: string | null;
  datos: DatosCaso;
  asunto: string | null;
  carta: string | null;
  texto_sernac: string | null;
  monto_reparacion: number | null;
  plazo_dias: number;
  fecha_hecho: string | null;
  enviada_at: string | null;
  plazo_vence: string | null;
  respuesta: string | null;
  respondida_at: string | null;
  escalada_at: string | null;
  recordatorio_enviado_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CasoEvento {
  id: number;
  case_id: string;
  user_id: string;
  tipo: string;
  detalle: string | null;
  created_at: string;
}

export const ESTADOS: Record<Estado, { label: string; tone: "neutral" | "ink" | "ok" | "warn" | "sello" }> = {
  borrador: { label: "Borrador", tone: "neutral" },
  enviada: { label: "Enviada", tone: "ink" },
  acogida: { label: "Acogida", tone: "ok" },
  parcial: { label: "Acogida parcialmente", tone: "ok" },
  rechazada: { label: "Rechazada", tone: "sello" },
  sin_respuesta: { label: "Sin respuesta", tone: "warn" },
  escalada: { label: "Escalada", tone: "sello" },
  cerrada: { label: "Cerrada", tone: "neutral" },
};

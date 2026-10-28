import type { Categoria } from "@/lib/types";

export interface Reparacion {
  key: string;
  label: string;
  desc?: string;
}

export interface CategoriaDef {
  key: Categoria;
  label: string;
  sub: string;
  descripcion: string;
  refTitulo: string;
  verbo: string;
  fechaLabel: string;
  montoLabel: string;
  refLabel: string;
  itemLabel: string;
  subtipos?: [string, string][];
  bases: string[];
  reparaciones: Reparacion[];
  evidencia: string[];
}

export const UF_TABLA: { key: string; label: string; uf: number }[] = [
  { key: "<500", label: "Menos de 500 km", uf: 2 },
  { key: "500-1000", label: "500 a 1.000 km", uf: 3 },
  { key: "1000-2500", label: "1.000 a 2.500 km", uf: 4 },
  { key: "2500-4000", label: "2.500 a 4.000 km", uf: 10 },
  { key: "4000-8000", label: "4.000 a 8.000 km", uf: 15 },
  { key: ">8000", label: "Más de 8.000 km", uf: 20 },
];

export const CATEGORIAS: Record<Categoria, CategoriaDef> = {
  garantia: {
    key: "garantia",
    label: "Producto defectuoso",
    sub: "Garantía legal · 6 meses",
    descripcion: "Compraste algo que falló, llegó roto o no sirve para lo que es.",
    refTitulo: "incumplimiento de garantía legal",
    verbo: "adquirí y recibí el producto",
    fechaLabel: "Fecha en que recibiste el producto",
    montoLabel: "Monto pagado (CLP)",
    refLabel: "N° de boleta o factura",
    itemLabel: "Producto",
    bases: ["Art. 20 LPC", "Art. 21 LPC", "Ley 21.398", "Art. 3 e) LPC", "Art. 24 LPC", "Art. 26 LPC"],
    reparaciones: [
      { key: "devolucion", label: "Devolución del dinero", desc: "Te devuelven el total pagado" },
      { key: "cambio", label: "Cambio por uno nuevo", desc: "Mismo producto o uno equivalente" },
      { key: "reparacion", label: "Reparación gratuita", desc: "Si vuelve a fallar, puedes exigir cambio o devolución" },
    ],
    evidencia: ["Boleta o factura", "Fotos o video de la falla", "Correos o chats con la tienda", "Informe del servicio técnico", "Garantía voluntaria (si existe)"],
  },
  retracto: {
    key: "retracto",
    label: "Compra online o a distancia",
    sub: "Retracto · 10 días",
    descripcion: "Compraste por internet, catálogo o teléfono y quieres devolverlo.",
    refTitulo: "ejercicio del derecho a retracto",
    verbo: "recibí el producto adquirido a distancia:",
    fechaLabel: "Fecha en que recibiste el producto",
    montoLabel: "Monto pagado (CLP)",
    refLabel: "N° de orden de compra",
    itemLabel: "Producto o servicio",
    bases: ["Art. 3 bis b) LPC", "Ley 21.398", "Art. 12 LPC", "Art. 26 LPC"],
    reparaciones: [{ key: "devolucion", label: "Devolución íntegra del dinero", desc: "Sin retención de gastos, máximo 45 días" }],
    evidencia: ["Correo de confirmación de compra", "Comprobante de entrega", "Capturas de la publicación o condiciones", "Correos o chats con la tienda"],
  },
  vuelo: {
    key: "vuelo",
    label: "Vuelo cancelado, atrasado o sobreventa",
    sub: "Código Aeronáutico · Ley 20.831",
    descripcion: "La aerolínea canceló, atrasó o te dejó abajo del avión.",
    refTitulo: "",
    verbo: "tenía reservado el vuelo",
    fechaLabel: "Fecha del vuelo",
    montoLabel: "Precio del pasaje (CLP)",
    refLabel: "Código de reserva",
    itemLabel: "Vuelo (origen → destino, N° de vuelo)",
    subtipos: [
      ["cancelacion", "Cancelación del vuelo"],
      ["retraso", "Retraso del vuelo"],
      ["denegacion", "Denegación de embarque (sobreventa)"],
    ],
    bases: ["Arts. 127 y ss. Código Aeronáutico", "Ley 20.831", "Art. 3 e) LPC", "Art. 12 LPC", "Art. 26 LPC"],
    reparaciones: [
      { key: "reembolso", label: "Reembolso del pasaje" },
      { key: "reubicacion", label: "Reubicación en otro vuelo", desc: "Más asistencia: comunicaciones, comida y alojamiento si corresponde" },
    ],
    evidencia: ["Pasaje o reserva", "Tarjeta de embarque", "Comunicación de la aerolínea", "Boletas de gastos (comida, hotel, traslados)"],
  },
  cobro: {
    key: "cobro",
    label: "Cobro indebido o suscripción",
    sub: "Arts. 3, 12 y 23 LPC",
    descripcion: "Te cobran algo que no contrataste, de más, o no te dejan cancelar.",
    refTitulo: "cobro indebido",
    verbo: "constaté el primer cobro por",
    fechaLabel: "Fecha del primer cobro",
    montoLabel: "Monto de cada cobro (CLP)",
    refLabel: "N° de cliente, contrato o cartola",
    itemLabel: "Servicio o cargo cobrado",
    subtipos: [
      ["nocontratado", "Cobro por algo que no contraté"],
      ["duplicado", "Cobro duplicado o mayor al acordado"],
      ["suscripcion", "Suscripción que no me dejan cancelar"],
      ["tarjeta", "Cargo no autorizado en mi tarjeta"],
    ],
    bases: ["Art. 3 b) LPC", "Art. 12 LPC", "Art. 23 LPC", "Art. 24 LPC", "Art. 26 LPC"],
    reparaciones: [
      { key: "restitucion", label: "Restitución de lo cobrado", desc: "Y cese de cobros futuros" },
      { key: "baja", label: "Restitución + baja definitiva", desc: "Confirmación por escrito del término" },
    ],
    evidencia: ["Cartola o estado de cuenta", "Contrato o condiciones", "Correos o chats con la empresa", "Constancia de solicitud de baja"],
  },
  servicio: {
    key: "servicio",
    label: "Servicio no prestado o mal prestado",
    sub: "Arts. 12 y 41 LPC",
    descripcion: "Pagaste por un trabajo o servicio que no cumplió lo acordado.",
    refTitulo: "servicio defectuosamente prestado",
    verbo: "concluyó (o debía concluir) el servicio de",
    fechaLabel: "Fecha en que terminó (o debía prestarse) el servicio",
    montoLabel: "Monto pagado (CLP)",
    refLabel: "N° de orden, contrato o presupuesto",
    itemLabel: "Servicio",
    bases: ["Art. 12 LPC", "Art. 41 LPC", "Art. 3 e) LPC", "Art. 23 LPC", "Art. 26 LPC"],
    reparaciones: [
      { key: "nueva", label: "Que lo presten de nuevo sin costo", desc: "Dentro de la garantía de 30 días hábiles" },
      { key: "devolucion", label: "Devolución de lo pagado", desc: "Si ya no quieres el servicio" },
    ],
    evidencia: ["Boleta, factura o presupuesto", "Fotos del resultado", "Correos o chats con el proveedor", "Cotización de otro proveedor para reparar"],
  },
  telecom: {
    key: "telecom",
    label: "Internet, celular o TV",
    sub: "Ley 18.168 · SUBTEL",
    descripcion: "Cortes, velocidad bajo lo contratado, cobros distintos al plan o trabas para darte de baja.",
    refTitulo: "deficiencias en el servicio de telecomunicaciones",
    verbo: "comenzaron los problemas con el servicio de",
    fechaLabel: "Fecha de inicio del problema",
    montoLabel: "Valor mensual del plan (CLP)",
    refLabel: "N° de cliente o servicio",
    itemLabel: "Servicio (internet hogar, plan móvil, TV)",
    subtipos: [
      ["corte", "Sin servicio o cortes reiterados"],
      ["velocidad", "Velocidad o calidad bajo lo contratado"],
      ["cobroplan", "Cobro distinto al plan contratado"],
      ["baja", "Problemas para dar de baja o portar"],
    ],
    bases: ["Ley 18.168", "D.S. 194/2012 SUBTEL", "Art. 12 LPC", "Art. 23 LPC", "Art. 26 LPC"],
    reparaciones: [
      { key: "descuento", label: "Descuento proporcional", desc: "Por los días sin servicio" },
      { key: "reparar", label: "Normalizar el servicio + descuento" },
      { key: "termino", label: "Término del contrato sin costo", desc: "Más el descuento por los días afectados" },
    ],
    evidencia: ["Boleta o detalle del plan", "N° de ticket o reclamo con la empresa", "Capturas de test de velocidad", "Correos o chats con la empresa"],
  },
};

export const CATEGORIA_KEYS = Object.keys(CATEGORIAS) as Categoria[];

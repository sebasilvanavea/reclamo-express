import type { DatosCaso } from "@/lib/types";
import { CATEGORIAS, UF_TABLA, type CategoriaDef, type Reparacion } from "./categorias";
import { addBiz, addDays, addMonths, addYears, clp, fechaLarga, hoy, parseISO } from "./fechas";

export interface Organismo {
  n: string;
  url: string;
  link: string;
  txt: string;
}

export interface Derivado {
  c: CategoriaDef;
  hoy: Date;
  f: Date | null;
  monto: number;
  meses: number;
  dias: number;
  plan: number;
  uf: number;
  ufN: number;
  comp: number;
  desc: number;
  totalCobro: number;
  plazo: number;
  big: number;
  bigLabel: string;
  bigNote: string;
}

export type Alerta = { tipo: "ok" | "warn"; texto: string };
export type Hito = { fecha: Date | null; texto: string };

export const DATOS_VACIOS: DatosCaso = {
  cat: "garantia",
  subtipo: "",
  proveedor: "",
  proveedorEmail: "",
  fecha: "",
  monto: "",
  ref: "",
  item: "",
  relato: "",
  meses: "1",
  diasSinServicio: "0",
  planMensual: "",
  distancia: "1000-2500",
  uf: "39500",
  reparacion: "",
  evidencia: [],
  nombre: "",
  rut: "",
  email: "",
  telefono: "",
  ciudad: "",
  domicilio: "",
};

const v = (x: unknown, fb: string) => {
  const s = (x == null ? "" : String(x)).trim();
  return s || fb;
};

export function organismo(s: DatosCaso): Organismo {
  if (s.cat === "telecom")
    return {
      n: "SUBTEL",
      url: "https://www.subtel.gob.cl",
      link: "Ir a subtel.gob.cl",
      txt: "la Subsecretaría de Telecomunicaciones (SUBTEL) y el Servicio Nacional del Consumidor (SERNAC)",
    };
  if (s.cat === "cobro" && s.subtipo === "tarjeta")
    return {
      n: "SERNAC · CMF",
      url: "https://www.sernac.cl",
      link: "Ir a sernac.cl",
      txt: "el Servicio Nacional del Consumidor (SERNAC) y, en lo pertinente, la Comisión para el Mercado Financiero (CMF)",
    };
  return { n: "SERNAC", url: "https://www.sernac.cl", link: "Ir a sernac.cl", txt: "el Servicio Nacional del Consumidor (SERNAC)" };
}

export function reparaciones(s: DatosCaso): Reparacion[] {
  const c = CATEGORIAS[s.cat];
  if (s.cat === "vuelo") {
    const base = [...c.reparaciones];
    if (s.subtipo === "denegacion")
      base.push({ key: "compensacion", label: "Solo la compensación en UF", desc: "Ya volé o me reubicaron; pido la compensación por sobreventa" });
    return base;
  }
  return c.reparaciones;
}

export function derivar(s: DatosCaso): Derivado {
  const c = CATEGORIAS[s.cat];
  const f = parseISO(s.fecha);
  const monto = Number(s.monto) || 0;
  const meses = Math.max(1, parseInt(s.meses, 10) || 1);
  const dias = Math.max(0, parseInt(s.diasSinServicio, 10) || 0);
  const plan = Number(s.planMensual) || 0;
  const uf = Number(s.uf) || 0;
  const fila = UF_TABLA.find((r) => r.key === s.distancia) ?? UF_TABLA[0];
  const ufN = fila.uf;
  const comp = ufN * uf;
  const desc = Math.round((plan / 30) * dias);
  const totalCobro = monto * meses;
  const plazo = s.cat === "telecom" ? 5 : 10;

  let big = 0;
  let bigLabel = "";
  let bigNote = "";
  switch (s.cat) {
    case "garantia":
      big = monto;
      bigLabel = s.reparacion === "devolucion" ? "Devolución del total pagado" : s.reparacion === "cambio" ? "Producto nuevo equivalente" : "Reparación sin costo";
      bigNote =
        s.reparacion === "devolucion"
          ? "Art. 20 LPC: tú eliges entre devolución, cambio o reparación; la tienda no puede imponer la opción."
          : "Valor de referencia del producto. Si la falla se repite después de reparar, puedes exigir cambio o devolución (art. 21).";
      break;
    case "retracto":
      big = monto;
      bigLabel = "Reembolso íntegro";
      bigNote = "Sin retención de gastos. El proveedor tiene hasta 45 días desde que comunicas el retracto (art. 3 bis).";
      break;
    case "vuelo":
      if (s.subtipo === "denegacion") {
        big = (s.reparacion === "reembolso" ? monto : 0) + comp;
        bigLabel = `${ufN} UF de compensación` + (s.reparacion === "reembolso" ? " + reembolso del pasaje" : s.reparacion === "reubicacion" ? " + reubicación" : "");
        bigNote = `Tabla de la Ley 20.831 para denegación de embarque: ${ufN} UF × ${clp(uf)}. Verifica la tabla vigente y el valor UF del día.`;
      } else {
        big = monto;
        bigLabel = s.reparacion === "reembolso" ? "Reembolso del pasaje" : "Reubicación sin costo (valor del pasaje)";
        bigNote = "Más asistencia: comunicaciones, alimentación y alojamiento cuando corresponda. Otros perjuicios (hotel perdido, conexiones) se reclaman aparte con boletas.";
      }
      break;
    case "cobro":
      big = totalCobro;
      bigLabel = `Restitución de ${meses} ${meses === 1 ? "cobro" : "cobros"} de ${clp(monto)}`;
      bigNote = "Más el cese de cobros futuros. Si el cargo fue con tarjeta y no lo autorizaste, el emisor debe restituir en 5 días hábiles los montos de hasta 35 UF (Ley 20.009).";
      break;
    case "servicio":
      big = monto;
      bigLabel = s.reparacion === "nueva" ? "Nueva prestación sin costo (valor pagado)" : "Devolución de lo pagado";
      bigNote = "Art. 41 LPC: garantía de 30 días hábiles desde el término del servicio. Los daños que causó se indemnizan aparte (art. 3 e).";
      break;
    case "telecom":
      big = desc;
      bigLabel = `Descuento por ${dias} ${dias === 1 ? "día" : "días"} sin servicio`;
      bigNote = `${clp(plan)} ÷ 30 × ${dias}. La empresa debe descontar los días sin servicio; SUBTEL puede ordenar indemnizaciones adicionales.`;
      break;
  }
  return { c, hoy: hoy(), f, monto, meses, dias, plan, uf, ufN, comp, desc, totalCobro, plazo, big, bigLabel, bigNote };
}

export function alertas(s: DatosCaso, d: Derivado): Alerta[] {
  const a: Alerta[] = [];
  const fc = (x: Date) => new Intl.DateTimeFormat("es-CL", { day: "2-digit", month: "short", year: "numeric" }).format(x);
  if (!d.f) {
    a.push({ tipo: "warn", texto: "Ingresa la fecha del hecho para calcular los plazos." });
    return a;
  }
  if (s.cat === "garantia") {
    const vto = addMonths(d.f, 6);
    a.push(
      vto < d.hoy
        ? { tipo: "warn", texto: `La garantía legal de 6 meses venció el ${fc(vto)}. Revisa la garantía voluntaria del fabricante o la vía de incumplimiento (art. 23).` }
        : { tipo: "ok", texto: `Dentro de la garantía legal: vence el ${fc(vto)}.` }
    );
  }
  if (s.cat === "retracto") {
    const r = addDays(d.f, 10);
    a.push(
      r < d.hoy
        ? { tipo: "warn", texto: `El retracto de 10 días venció el ${fc(r)}. Si el producto llegó distinto o defectuoso, usa la vía de garantía legal.` }
        : { tipo: "ok", texto: `Puedes retractarte hasta el ${fc(r)}. Si los términos del proveedor excluían el retracto expresamente, revísalo antes de enviar.` }
    );
  }
  if (s.cat === "vuelo" && s.subtipo === "denegacion") a.push({ tipo: "ok", texto: "La compensación en UF se suma al reembolso o la reubicación; no es una alternativa." });
  if (s.cat === "cobro" && s.subtipo === "tarjeta") a.push({ tipo: "ok", texto: "Desconoce la operación también ante el emisor de la tarjeta, hoy mismo, por su canal oficial." });
  if (s.cat === "telecom") a.push({ tipo: "ok", texto: "La empresa debe responder en 5 días hábiles. Si no responde o no te satisface, reclamas en SUBTEL." });
  const p = addYears(d.f, 2);
  if (p < d.hoy) a.push({ tipo: "warn", texto: "Pasaron más de 2 años desde el hecho: la acción judicial está prescrita (art. 26 LPC), salvo suspensión." });
  return a;
}

export function hitos(s: DatosCaso, d: Derivado, desde: Date = d.hoy): Hito[] {
  const o = organismo(s);
  const t1 = desde;
  const t2 = addBiz(t1, d.plazo);
  const t3 = addBiz(t2, 1);
  const t4 = addBiz(t3, 18);
  const t5 = d.f ? addYears(d.f, 2) : null;
  return [
    { fecha: t1, texto: "Envías la carta por correo, con copia a ti. Guarda el acuse de recibo." },
    { fecha: t2, texto: `Vence el plazo de ${d.plazo} días hábiles que fijaste. Sin respuesta o con respuesta negativa, escalas.` },
    { fecha: t3, texto: `Ingresas el reclamo en ${o.n}. La empresa tiene 10 días hábiles para responder; la gestión dura hasta 18 días hábiles.` },
    { fecha: t4, texto: "Resultado de la mediación. Sin acuerdo: denuncia en el Juzgado de Policía Local (arts. 50 y ss. LPC)." },
    { fecha: t5, texto: "Último día para demandar (prescripción de 2 años, art. 26). El reclamo en SERNAC suspende este plazo." },
  ];
}

export function fundamentos(s: DatosCaso): string {
  const sub = s.subtipo;
  switch (s.cat) {
    case "garantia":
      return "Conforme a los artículos 20 y 21 de la LPC, el producto adquirido presenta deficiencias que lo hacen inapto para el uso al que está destinado, por lo que me asiste el derecho a optar, a mi sola elección, entre la reposición del producto, su reparación gratuita o la devolución de la cantidad pagada. La garantía legal rige por seis meses contados desde la recepción del producto (art. 21 LPC, modificado por la Ley N° 21.398), plazo que se encuentra vigente, y no puede condicionarse a la existencia de una garantía voluntaria, a un ticket de cambio ni a la conservación del embalaje original. El artículo 3 letra e) de la LPC reconoce además mi derecho a la reparación e indemnización adecuada y oportuna de todos los daños ocasionados.";
    case "retracto":
      return "De acuerdo con el artículo 3 bis letra b) de la LPC, en los contratos celebrados por medios electrónicos o a distancia el consumidor puede poner término unilateral al contrato, sin expresión de causa, dentro de los diez días siguientes a la recepción del producto o a la contratación del servicio. Ejercido el retracto, el proveedor está obligado a restituir las sumas pagadas, sin retención de gastos, a la mayor brevedad y en todo caso dentro de los cuarenta y cinco días siguientes a la comunicación. La presente carta constituye dicha comunicación.";
    case "vuelo": {
      const base =
        "Conforme a los artículos 127 y siguientes del Código Aeronáutico, modificados por la Ley N° 20.831 sobre derechos de los pasajeros aéreos, y a los artículos 3 letra e) y 12 de la LPC, ";
      if (sub === "denegacion")
        return base + "ante la denegación de embarque por sobreventa el pasajero tiene derecho, a su elección, al reembolso del pasaje o al embarque en el siguiente vuelo disponible, a las prestaciones asistenciales correspondientes y, adicionalmente, a la compensación en Unidades de Fomento que fija la ley según la distancia del vuelo, sin perjuicio de la indemnización de los demás perjuicios causados.";
      if (sub === "retraso")
        return base + "ante el retraso del vuelo imputable al transportador el pasajero tiene derecho a las prestaciones asistenciales (comunicaciones, alimentación y alojamiento cuando corresponda) y, en caso de retraso significativo, al reembolso del pasaje o al embarque en el siguiente vuelo disponible, sin perjuicio de la indemnización de los perjuicios causados.";
      return base + "ante la cancelación del vuelo imputable al transportador el pasajero tiene derecho, a su elección, al reembolso del pasaje o al embarque en el siguiente vuelo disponible, además de las prestaciones asistenciales que correspondan, sin perjuicio de la indemnización de los perjuicios causados.";
    }
    case "cobro": {
      let t =
        "El cobro reclamado carece de respaldo contractual, infringiendo los artículos 3 letra b) y 12 de la LPC, que obligan al proveedor a informar verazmente y a respetar los términos, condiciones y modalidades conforme a las cuales se ofreció o convino el servicio. Dicha conducta configura además la infracción del artículo 23 de la LPC, que sanciona al proveedor que causa menoscabo al consumidor por fallas o deficiencias en el cobro.";
      if (sub === "tarjeta")
        t += " Tratándose de una operación no autorizada con tarjeta, conforme a la Ley N° 20.009 (modificada por las leyes N° 21.234 y N° 21.673) procede su desconocimiento ante el emisor y la restitución de los montos involucrados, trámite que inicio en paralelo.";
      if (sub === "suscripcion")
        t += " Asimismo, conforme a la Ley N° 21.398, el consumidor tiene derecho a poner término al contrato por los mismos medios por los que fue celebrado, sin trabas ni costos adicionales, por lo que esta comunicación debe entenderse también como solicitud formal de término.";
      return t;
    }
    case "servicio":
      return "Conforme al artículo 12 de la LPC, el proveedor está obligado a respetar los términos, condiciones y modalidades conforme a las cuales se ofreció y convino el servicio. Según el artículo 41 de la misma ley, tratándose de un servicio defectuosamente prestado o no prestado, el consumidor tiene derecho a que sea prestado nuevamente sin costo o, de no ser posible, a la devolución de lo pagado, dentro de la garantía de treinta días hábiles contados desde el término de la prestación. Lo anterior sin perjuicio de la indemnización de los daños ocasionados (arts. 3 letra e) y 23 LPC).";
    case "telecom":
      return "De acuerdo con la Ley N° 18.168, General de Telecomunicaciones, el Reglamento sobre Tramitación y Resolución de Reclamos de Servicios de Telecomunicaciones (D.S. N° 194 de 2012) y los artículos 3 letra e), 12 y 23 de la LPC, la empresa debe prestar el servicio en forma continua y en las condiciones contratadas, responder fundadamente los reclamos dentro de cinco días hábiles y aplicar los descuentos e indemnizaciones que correspondan por los períodos en que el servicio no fue prestado o lo fue deficientemente.";
  }
}

export function solicitud(s: DatosCaso, d: Derivado): string {
  const r = s.reparacion;
  const m = clp(d.monto);
  const compTxt = `la compensación de ${d.ufN} UF (${clp(d.comp)} al valor UF indicado) que establece la Ley N° 20.831 por denegación de embarque`;
  switch (s.cat) {
    case "garantia":
      if (r === "cambio") return "proceda a la reposición del producto por otro nuevo de idénticas características, conforme al artículo 20 de la LPC.";
      if (r === "reparacion")
        return "proceda a la reparación gratuita del producto conforme al artículo 20 de la LPC, sin perjuicio de mi derecho a optar por la reposición o la devolución del dinero si la falla se repite (art. 21 LPC).";
      return `proceda a la devolución de la cantidad pagada, esto es, ${m}, conforme al artículo 20 de la LPC.`;
    case "retracto":
      return `tenga por ejercido mi derecho a retracto y proceda a la devolución íntegra de ${m}, sin retención de gastos, indicándome el procedimiento para la restitución del producto.`;
    case "vuelo": {
      if (r === "compensacion") return `pague ${compTxt}, sin perjuicio del reembolso o la reubicación ya efectuados.`;
      let t =
        r === "reubicacion"
          ? "me ofrezca embarque en el siguiente vuelo disponible sin costo adicional, además de las prestaciones asistenciales que correspondan"
          : `proceda al reembolso íntegro del pasaje, esto es, ${m}`;
      if (s.subtipo === "denegacion") t += `, más ${compTxt}`;
      return t + ".";
    }
    case "cobro": {
      const tc = `restituya los montos indebidamente cobrados, que ascienden a ${clp(d.totalCobro)} (${d.meses} ${d.meses === 1 ? "cobro" : "cobros"} de ${m}), y cese todo cobro futuro por este concepto`;
      return r === "baja" ? tc + ", procediendo además a la baja definitiva del servicio y confirmándomelo por escrito." : tc + ".";
    }
    case "servicio":
      if (r === "nueva") return "preste nuevamente el servicio sin costo y en los términos contratados, conforme al artículo 41 de la LPC.";
      return `devuelva lo pagado, esto es, ${m}, conforme al artículo 41 de la LPC.`;
    case "telecom": {
      const dsc = `aplique el descuento proporcional de ${clp(d.desc)} por los ${d.dias} ${d.dias === 1 ? "día" : "días"} afectados`;
      if (r === "reparar") return `normalice el servicio en las condiciones contratadas y ${dsc}.`;
      if (r === "termino") return `ponga término al contrato sin costo ni cobros adicionales, y ${dsc}.`;
      return `${dsc} en la próxima boleta.`;
    }
  }
}

function tituloRef(s: DatosCaso, c: CategoriaDef) {
  if (s.cat === "vuelo") return ({ cancelacion: "cancelación de vuelo", retraso: "retraso de vuelo", denegacion: "denegación de embarque" } as Record<string, string>)[s.subtipo] ?? "vuelo";
  return c.refTitulo;
}

export function asunto(s: DatosCaso): string {
  return `Reclamo formal · ${v(s.item, "[producto o servicio]")}${v(s.ref, "") ? " · " + v(s.ref, "") : ""} · ${v(s.nombre, "[nombre]")}`;
}

export function carta(s: DatosCaso, d: Derivado, fechaCarta: Date = d.hoy): string {
  const c = d.c;
  const o = organismo(s);
  const nombre = v(s.nombre, "[Nombre completo]");
  const rut = v(s.rut, "[RUT]");
  const email = v(s.email, "[correo]");
  const tel = v(s.telefono, "[teléfono]");
  const ciudad = v(s.ciudad, "[Ciudad]");
  const dom = v(s.domicilio, "[domicilio]");
  const prov = v(s.proveedor, "[Empresa]");
  const provMail = v(s.proveedorEmail, "[correo de la empresa]");
  const item = v(s.item, "[producto o servicio]");
  const ref = v(s.ref, "");
  const relato = v(s.relato, "");
  const fechaHecho = d.f ? fechaLarga(d.f) : "[fecha]";
  const montoFrase = s.cat === "telecom" ? (d.plan ? `, con un valor mensual de ${clp(d.plan)}` : "") : d.monto ? `, por un valor de ${clp(d.monto)}` : "";
  const evid = s.evidencia.length ? s.evidencia.join(", ") : "los antecedentes que se indiquen";

  return [
    `${ciudad}, ${fechaLarga(fechaCarta)}`,
    "",
    "Señores",
    prov,
    provMail,
    "Presente",
    "",
    `Ref.: Reclamo formal por ${tituloRef(s, c)} — ${item}${ref ? ` — ${ref}` : ""}`,
    "",
    "De mi consideración:",
    "",
    `Yo, ${nombre}, RUT ${rut}, domiciliado/a en ${dom}, ${ciudad}, correo electrónico ${email}, en mi calidad de consumidor/a conforme a la Ley N° 19.496 sobre Protección de los Derechos de los Consumidores (en adelante, LPC), vengo en presentar reclamo formal en contra de ${prov}, en virtud de los siguientes antecedentes:`,
    "",
    "I. HECHOS",
    `Con fecha ${fechaHecho} ${c.verbo} ${item}${montoFrase}${ref ? ` (${ref})` : ""}.` + (relato ? " " + relato : ""),
    "",
    "II. FUNDAMENTOS DE DERECHO",
    fundamentos(s),
    "",
    "III. SOLICITUD",
    `En virtud de lo expuesto, solicito que, dentro del plazo de ${d.plazo} días hábiles contados desde la recepción de esta comunicación, ${solicitud(s, d)}`,
    "",
    `De no obtener una respuesta satisfactoria en dicho plazo, ingresaré el reclamo ante ${o.txt} y, de ser necesario, ejerceré las acciones que me confieren los artículos 50 y siguientes de la LPC ante el Juzgado de Policía Local competente, solicitando además la aplicación de las multas del artículo 24 de la misma ley. Hago presente que el plazo de prescripción del artículo 26 de la LPC se suspende mientras se tramita el reclamo ante el SERNAC.`,
    "",
    `Documentos que acompaño: ${evid}.`,
    "",
    "Sin otro particular, saluda atentamente,",
    "",
    "",
    nombre,
    `RUT ${rut}`,
    `${email} · ${tel}`,
  ].join("\n");
}

export function textoSernac(s: DatosCaso, d: Derivado, fechaEnvio: Date = d.hoy): string {
  const c = d.c;
  const montoFrase = s.cat === "telecom" ? (d.plan ? `, valor mensual ${clp(d.plan)}` : "") : d.monto ? `, por ${clp(d.monto)}` : "";
  const ref = v(s.ref, "");
  return [
    `Empresa: ${v(s.proveedor, "[Empresa]")}`,
    `Hechos: con fecha ${d.f ? fechaLarga(d.f) : "[fecha]"} ${c.verbo} ${v(s.item, "[producto o servicio]")}${montoFrase}${ref ? ` (${ref})` : ""}. ${v(s.relato, "")}`,
    `Gestión previa: reclamé por escrito a la empresa el ${fechaLarga(fechaEnvio)} (correo ${v(s.proveedorEmail, "[correo]")}) y fijé ${d.plazo} días hábiles de plazo. Resultado: [sin respuesta / respuesta negativa, detallar].`,
    `Lo que solicito: ${solicitud(s, d)}`,
    `Fundamento legal: ${c.bases.join(", ")}.`,
  ].join("\n\n");
}

/** Todo lo que el dossier necesita, en una sola llamada. */
export function dossier(s: DatosCaso, opts: { fechaCarta?: Date; desde?: Date } = {}) {
  const d = derivar(s);
  return {
    d,
    organismo: organismo(s),
    alertas: alertas(s, d),
    hitos: hitos(s, d, opts.desde),
    carta: carta(s, d, opts.fechaCarta),
    asunto: asunto(s),
    sernac: textoSernac(s, d, opts.fechaCarta),
  };
}

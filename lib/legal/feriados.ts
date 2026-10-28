/**
 * Feriados nacionales de Chile (irrenunciables y comunes), sin feriados regionales.
 * Se usan para contar días hábiles administrativos (Ley 19.880: inhábiles sábados,
 * domingos y festivos). Agregar el año siguiente cada diciembre; para años no
 * listados el cálculo solo descuenta sábados y domingos.
 */
export const FERIADOS: Record<number, string[]> = {
  2026: [
    "2026-01-01", // Año Nuevo
    "2026-04-03", // Viernes Santo
    "2026-04-04", // Sábado Santo
    "2026-05-01", // Día Nacional del Trabajo
    "2026-05-21", // Glorias Navales
    "2026-06-21", // Pueblos Indígenas
    "2026-06-29", // San Pedro y San Pablo
    "2026-07-16", // Virgen del Carmen
    "2026-08-15", // Asunción de la Virgen
    "2026-09-18", // Independencia Nacional
    "2026-09-19", // Glorias del Ejército
    "2026-10-12", // Encuentro de Dos Mundos
    "2026-10-31", // Iglesias Evangélicas y Protestantes
    "2026-11-01", // Todos los Santos
    "2026-12-08", // Inmaculada Concepción
    "2026-12-25", // Navidad
  ],
  2027: [
    "2027-01-01", // Año Nuevo
    "2027-03-26", // Viernes Santo
    "2027-03-27", // Sábado Santo
    "2027-05-01", // Día Nacional del Trabajo
    "2027-05-21", // Glorias Navales
    "2027-06-21", // Pueblos Indígenas
    "2027-06-28", // San Pedro y San Pablo (trasladado)
    "2027-07-16", // Virgen del Carmen
    "2027-08-15", // Asunción de la Virgen
    "2027-09-17", // Feriado adicional Fiestas Patrias
    "2027-09-18", // Independencia Nacional
    "2027-09-19", // Glorias del Ejército
    "2027-10-11", // Encuentro de Dos Mundos (trasladado)
    "2027-10-31", // Iglesias Evangélicas y Protestantes
    "2027-11-01", // Todos los Santos
    "2027-12-08", // Inmaculada Concepción
    "2027-12-25", // Navidad
  ],
};

const SET = new Set(Object.values(FERIADOS).flat());

const isoLocal = (d: Date) => {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};

export const esFeriado = (d: Date) => SET.has(isoLocal(d));

/** Hábil = lunes a viernes y no feriado nacional. */
export const esHabil = (d: Date) => {
  const w = d.getDay();
  return w !== 0 && w !== 6 && !esFeriado(d);
};

export const aniosConFeriados = () => Object.keys(FERIADOS).map(Number);

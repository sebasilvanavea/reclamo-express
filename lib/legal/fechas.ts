import { esHabil } from "./feriados";

export const clp = (n: number | string | null | undefined) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(
    Math.round(Number(n) || 0)
  );

export const fechaLarga = (d: Date) =>
  new Intl.DateTimeFormat("es-CL", { day: "numeric", month: "long", year: "numeric" }).format(d);

export const fechaCorta = (d: Date) =>
  new Intl.DateTimeFormat("es-CL", { day: "2-digit", month: "short", year: "numeric" }).format(d);

export const iso = (d: Date) => {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};

export const parseISO = (s: string | null | undefined): Date | null => {
  if (!s) return null;
  const [y, m, d] = s.slice(0, 10).split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
};

export const addDays = (d: Date, n: number) => {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
};
export const addMonths = (d: Date, n: number) => {
  const r = new Date(d);
  r.setMonth(r.getMonth() + n);
  return r;
};
export const addYears = (d: Date, n: number) => {
  const r = new Date(d);
  r.setFullYear(r.getFullYear() + n);
  return r;
};

/** Suma n días hábiles: lunes a viernes, descontando feriados nacionales (ver feriados.ts). */
export const addBiz = (d: Date, n: number) => {
  const r = new Date(d);
  let c = 0;
  while (c < n) {
    r.setDate(r.getDate() + 1);
    if (esHabil(r)) c++;
  }
  return r;
};

export const hoy = () => {
  const t = new Date();
  return new Date(t.getFullYear(), t.getMonth(), t.getDate());
};

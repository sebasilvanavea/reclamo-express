/** RUT chileno: limpieza, validación módulo 11 y formato con puntos y guion. */
export function cleanRut(r: string) {
  return String(r || "").replace(/[^0-9kK]/g, "").toUpperCase();
}

export function rutValid(r: string) {
  const c = cleanRut(r);
  if (c.length < 2) return false;
  const body = c.slice(0, -1);
  const dv = c.slice(-1);
  if (!/^\d+$/.test(body)) return false;
  let s = 0;
  let m = 2;
  for (let i = body.length - 1; i >= 0; i--) {
    s += parseInt(body[i], 10) * m;
    m = m === 7 ? 2 : m + 1;
  }
  const res = 11 - (s % 11);
  const d = res === 11 ? "0" : res === 10 ? "K" : String(res);
  return d === dv;
}

export function fmtRut(r: string) {
  const c = cleanRut(r);
  if (c.length < 2) return c;
  const body = c.slice(0, -1);
  const dv = c.slice(-1);
  return body.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "-" + dv;
}

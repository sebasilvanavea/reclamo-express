/**
 * Base pública del sitio para redirecciones desde route handlers.
 * En Netlify, request.url trae el host interno del deploy (<id>--sitio.netlify.app), donde la
 * cookie de sesión no existe; por eso se prefiere NEXT_PUBLIC_SITE_URL y, si no está, el host
 * que reenvía el proxy (x-forwarded-host). En desarrollo se usa el origen de la petición.
 */
export function basePublica(request: Request): string {
  const { origin } = new URL(request.url);
  if (process.env.NODE_ENV === "development") return origin;
  const env = process.env.NEXT_PUBLIC_SITE_URL;
  if (env && /^https?:\/\//.test(env)) return env.replace(/\/$/, "");
  const forwardedHost = request.headers.get("x-forwarded-host");
  if (forwardedHost) return `https://${forwardedHost.split(",")[0].trim()}`;
  return origin;
}

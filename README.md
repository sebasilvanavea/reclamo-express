# Reclamo Express

Carta de reclamo con base legal chilena en 2 minutos. Describe el problema, la app arma la carta formal (artículos exactos de la Ley 19.496 y normas sectoriales), calcula la reparación que puedes exigir, cuenta los plazos en días hábiles (descontando feriados) y, si la empresa no responde, deja el reclamo listo para SERNAC, SUBTEL o CMF.

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind · Supabase (Auth + Postgres con RLS) · @react-pdf/renderer · Resend · Netlify (con función programada de recordatorios).

**Estado:** MVP completo y compilando (`npm run typecheck` y `npm run build` en verde). Falta solo conectar los servicios externos (Supabase, Netlify y, opcionalmente, Resend) siguiendo la guía de abajo.

## Estructura

```
app/
  page.tsx                 Landing (con aviso tras eliminar cuenta)
  login/                   Ingreso por enlace mágico (sin contraseña); ?plan=pro|pyme → lista de espera
  auth/callback            Intercambio del código de Supabase por sesión
  auth/signout             Cierre de sesión
  app/                     Zona privada (middleware protege /app/*)
    page.tsx               Mis casos (tablero + tabla)
    nuevo/                 Wizard de 5 pasos con vista previa en vivo y UF del día
    casos/[id]/            Detalle: carta, acciones, plazos, expediente
    cuenta/                Mi cuenta: datos para las cartas, exportar JSON, eliminar cuenta
  api/casos/[id]/pdf       PDF de la carta
  api/cuenta/exportar      Exportación completa en JSON (Ley 21.719)
  api/uf                   Valor UF del día (mindicador.cl, con caché y tiempo límite)
  legal/                   Privacidad y términos
  icon.svg · opengraph-image.tsx · robots.ts · sitemap.ts · not-found.tsx
components/                UI: Wizard, Carta, CartaPDF, Dossier, CasoAcciones, CuentaForms…
lib/legal/                 Motor legal: categorias, motor, fechas, feriados, uf, rut
lib/supabase/              Clientes browser / server / middleware / admin (service_role)
supabase/schema.sql        Tablas, triggers y políticas RLS
netlify/functions/         recordatorios.mts (programada, lunes a viernes)
scripts/                   Pruebas manuales del motor y del PDF
```

## 1. Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com) (región `sa-east-1`, São Paulo, es la más cercana).
2. **SQL Editor** → pega y ejecuta `supabase/schema.sql` (es idempotente: se puede volver a correr).
3. **Authentication → Providers → Email**: deja activado *Enable email provider*. Puedes desactivar *Confirm email* (el enlace mágico ya verifica el correo).
4. **Authentication → URL Configuration**:
   - Site URL: `https://TU-SITIO.netlify.app` (en local, `http://localhost:3000`)
   - Redirect URLs: `https://TU-SITIO.netlify.app/auth/callback` y `http://localhost:3000/auth/callback`
5. **Project Settings → API**: copia `Project URL`, `anon public` y `service_role` (este último solo va al servidor).

> Con el proveedor de correo por defecto de Supabase hay un límite de ~3 correos por hora. Para producción configura SMTP propio en *Authentication → SMTP Settings* (puedes usar Resend).

## 2. Resend (correo saliente, opcional al inicio)

1. Crea una cuenta en [resend.com](https://resend.com) y verifica tu dominio.
2. Crea una API key y define `EMAIL_FROM="Reclamo Express <reclamos@tudominio.cl>"`.

Si `RESEND_API_KEY` no está definido, la app funciona igual: muestra la carta para copiar y el botón "marcar como enviada". El envío automático y los recordatorios aparecen cuando configuras la clave.

## 3. Local

```bash
cp .env.example .env.local   # y completa los valores
npm install
npm run dev                  # http://localhost:3000
```

Otros comandos:

```bash
npm run typecheck     # TypeScript
npm run build         # build de producción
npm run prueba:motor  # imprime carta, plazos y texto SERNAC de un caso por categoría
npm run prueba:pdf    # genera scripts/salida/ejemplo.pdf para revisar el diseño del PDF
```

## 4. Netlify

1. Sube el repositorio a GitHub (o GitLab/Bitbucket).
2. En Netlify: **Add new site → Import an existing project** → elige el repositorio. Netlify detecta Next.js; el `netlify.toml` ya trae la configuración.
3. **Site configuration → Environment variables**: agrega

   | Variable | Dónde se usa |
   | --- | --- |
   | `NEXT_PUBLIC_SUPABASE_URL` | app |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | app |
   | `SUPABASE_SERVICE_ROLE_KEY` | función de recordatorios y eliminación de cuenta |
   | `NEXT_PUBLIC_SITE_URL` | enlaces en correos, imagen OG, sitemap |
   | `RESEND_API_KEY` | envío de cartas y recordatorios (opcional) |
   | `EMAIL_FROM` | remitente (opcional) |

4. Deploy. Luego vuelve a Supabase y pon la URL final del sitio en *URL Configuration*.

La función `netlify/functions/recordatorios.mts` corre de lunes a viernes a las 12:00 UTC (09:00 en Chile en horario de verano, 08:00 en invierno) y avisa por correo cuando vence el plazo de una carta enviada sin respuesta.

## Motor legal

Toda la lógica está en `lib/legal/`:

- `motor.ts` — `derivar()` calcula la reparación (monto, UF por sobreventa, descuento proporcional, cobros × meses) y el plazo que fija la carta (10 días hábiles; 5 en telecom). `alertas()` avisa si venció la garantía legal (6 meses), el retracto (10 días) o la prescripción (2 años). `fundamentos()` y `solicitud()` arman los párrafos legales por categoría y subtipo. `carta()`, `textoSernac()` y `hitos()` producen la carta, el texto para el organismo y la línea de tiempo.
- `feriados.ts` — feriados nacionales 2026 y 2027 para contar días hábiles. **Agregar el año siguiente cada diciembre.**
- `uf.ts` — valor UF del día desde mindicador.cl (caché de 1 hora, tiempo límite de 4 s y valor de respaldo editable en el formulario). El wizard lo pide por `/api/uf` solo cuando hay sobreventa de vuelo.
- `categorias.ts` — textos, bases legales, reparaciones y evidencia por categoría; tabla UF de la Ley 20.831.

**Antes de lanzar públicamente**, haz revisar por un abogado los textos de `fundamentos()` y la tabla UF de `categorias.ts` (Ley 20.831).

## Privacidad (Ley 21.719)

- Cada cuenta solo lee sus propios registros (RLS en `cases`, `case_events`, `profiles`).
- Exportación completa en JSON desde *Mi cuenta* (`/api/cuenta/exportar`).
- Eliminación de cuenta desde *Mi cuenta*: borra casos, bitácora y perfil; con `SUPABASE_SERVICE_ROLE_KEY` configurada borra también el usuario de Auth.

## Pendientes (roadmap)

- Pagos (Flow o Webpay Plus) para activar los planes Pro y Pymes; hoy todo Pro es gratis y el plan elegido queda en `profiles.plan_interes`.
- Plan Pymes: bandeja de reclamos recibidos y respuestas en plazo.
- Adjuntar evidencia (fotos, boletas) al caso con Supabase Storage.
- SMTP propio en Supabase para el enlace de acceso (el proveedor por defecto limita a ~3 correos/hora).

import { Suspense } from "react";
import Link from "next/link";
import { AvisoCuenta } from "@/components/AvisoCuenta";
import { Logo } from "@/components/Logo";
import { CATEGORIAS, CATEGORIA_KEYS } from "@/lib/legal/categorias";

const PASOS = [
  { n: "I", t: "Cuéntanos qué pasó", d: "Eliges la situación (producto defectuoso, compra online, vuelo, cobro indebido, servicio, telecom) y completas 6 campos. Sin jerga." },
  { n: "II", t: "Te armamos la carta", d: "Hechos, fundamentos de derecho con los artículos exactos de la Ley 19.496 y la solicitud con el monto que corresponde. Lista para enviar en PDF." },
  { n: "III", t: "Seguimos el plazo", d: "Enviamos la carta con copia a ti, contamos los días hábiles y, si no responden, te dejamos el reclamo listo para SERNAC o SUBTEL." },
];

const CIFRAS = [
  { v: "6 meses", k: "de garantía legal por producto defectuoso (art. 21 LPC)" },
  { v: "10 días", k: "para retractarte de una compra online (art. 3 bis LPC)" },
  { v: "10 días hábiles", k: "tiene la empresa para responder un reclamo ante SERNAC" },
  { v: "2 años", k: "de plazo para demandar; el reclamo ante SERNAC lo suspende (art. 26)" },
];

const PLANES = [
  { n: "Gratis", p: "$0", per: "", items: ["1 carta al mes", "Diagnóstico legal y cálculo de reparación", "Texto listo para SERNAC", "Copiar y enviar por tu cuenta"], cta: "Crear mi carta", href: "/login", destacado: false },
  { n: "Pro", p: "$4.990", per: "/ mes", items: ["Cartas ilimitadas", "PDF con fecha y envío con copia", "Seguimiento de plazos y recordatorios", "Escalada guiada a SERNAC, SUBTEL o CMF", "Historial de todos tus casos"], cta: "Empezar con Pro", href: "/login?plan=pro", destacado: true },
  { n: "Pymes", p: "$29.990", per: "/ mes", items: ["Bandeja de reclamos recibidos", "Respuestas en plazo con base legal", "Hasta 3 usuarios", "Reportes para evitar multas por no responder"], cta: "Lista de espera", href: "/login?plan=pyme", destacado: false },
];

const FAQ = [
  { q: "¿Esto es asesoría legal?", a: "No. Reclamo Express arma tu carta con los artículos y plazos que la ley ya te reconoce como consumidor, para que reclames bien y a tiempo. Si tu caso es complejo o el monto es alto, te conviene además un abogado; la carta igual te sirve como primer paso." },
  { q: "¿La empresa está obligada a responder?", a: "Ante SERNAC sí: tiene 10 días hábiles. La carta directa es la gestión previa que SERNAC valora y que suspende la prescripción si después escalas." },
  { q: "¿Qué pasa con mis datos?", a: "Tus casos son tuyos: cada cuenta solo ve lo propio, puedes exportar y borrar todo cuando quieras. Cumplimos la Ley 21.719 de protección de datos personales." },
  { q: "¿Sirve para empresas pequeñas que reciben reclamos?", a: "Ese es el plan Pymes: la misma base legal pero del otro lado, para responder en plazo y no arriesgar multas por silencio." },
];

export default function Landing() {
  return (
    <main>
      <Suspense>
        <AvisoCuenta />
      </Suspense>
      {/* Barra */}
      <header className="border-b border-ink-100 bg-marfil/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Logo />
          <nav className="flex items-center gap-2 sm:gap-5 text-sm">
            <a href="#como" className="hidden text-ink-500 hover:text-ink sm:inline">Cómo funciona</a>
            <a href="#precios" className="hidden text-ink-500 hover:text-ink sm:inline">Precios</a>
            <Link href="/login" className="btn-ghost btn-sm">Ingresar</Link>
            <Link href="/login" className="btn btn-sm">Crear mi carta</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-ink text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-[1.1fr,.9fr] md:py-24">
          <div className="flex flex-col gap-6">
            <p className="eyebrow text-[#FF7A8A]">Ley 19.496 · SERNAC · SUBTEL</p>
            <h1 className="font-display text-4xl font-medium leading-[1.05] sm:text-5xl md:text-[56px]">
              Te deben plata.
              <br />
              <span className="italic font-normal text-ink-100">Reclámala con la ley en la mano.</span>
            </h1>
            <p className="max-w-[52ch] text-[17px] leading-relaxed text-ink-100">
              Describe el problema y en 2 minutos tienes la carta de reclamo formal: artículos exactos, el monto que puedes exigir y el plazo que la empresa debe cumplir. Si no responden, la escalamos a SERNAC.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/login" className="btn-sello">Crear mi carta gratis</Link>
              <a href="#como" className="btn border-white/30 bg-transparent text-white hover:bg-white/10">Ver cómo funciona</a>
            </div>
            <p className="font-mono text-[12px] text-ink-300">Sin tarjeta · Sin abogado para empezar · Tus datos son tuyos</p>
          </div>
          <div className="relative">
            <div className="absolute left-2 -top-3 z-10 rotate-[-6deg] rounded border-[1.5px] border-[#FF7A8A] bg-ink px-2 py-1 font-mono text-[10px] tracking-[.14em] text-[#FF7A8A] sm:-left-3">BORRADOR</div>
            <div className="paper !bg-paper !text-ink text-[13.5px] leading-[1.55] shadow-none">
              {`Santiago, 27 de octubre de 2026

Señores
Tienda Andes Ltda.
Presente

Ref.: Reclamo formal por incumplimiento de garantía legal — Lavadora 10 kg — Boleta N° 118.204

Conforme a los artículos 20 y 21 de la Ley N° 19.496, el producto presenta deficiencias que lo hacen inapto para su uso, por lo que me asiste el derecho a optar, a mi sola elección, entre la reposición, la reparación gratuita o la devolución de la cantidad pagada…

III. SOLICITUD
Solicito que, dentro del plazo de 10 días hábiles, proceda a la devolución de $389.990.`}
            </div>
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section id="como" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
        <p className="eyebrow">Cómo funciona</p>
        <h2 className="mt-2 font-display text-3xl font-medium sm:text-4xl">Tres pasos, ningún formulario eterno</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {PASOS.map((p) => (
            <div key={p.n} className="card flex flex-col gap-3">
              <span className="font-display text-3xl text-sello">{p.n}</span>
              <h3 className="text-lg font-semibold">{p.t}</h3>
              <p className="text-[15px] leading-relaxed text-ink-500">{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categorías */}
      <section className="border-y border-ink-100 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
          <p className="eyebrow">Seis situaciones cubiertas</p>
          <h2 className="mt-2 font-display text-3xl font-medium sm:text-4xl">Cada una con su base legal exacta</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIA_KEYS.map((k) => {
              const c = CATEGORIAS[k];
              return (
                <div key={k} className="flex flex-col gap-2 rounded-xl border border-ink-100 p-5">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold">{c.label}</h3>
                  </div>
                  <p className="text-sm text-ink-500">{c.descripcion}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {c.bases.slice(0, 3).map((b) => (
                      <span key={b} className="chip">{b}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Cifras */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
        <div className="grid gap-6 md:grid-cols-4">
          {CIFRAS.map((c) => (
            <div key={c.v} className="border-l-2 border-sello pl-4">
              <div className="font-display text-3xl font-medium">{c.v}</div>
              <p className="mt-1 text-sm text-ink-500">{c.k}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Precios */}
      <section id="precios" className="bg-ink-700 text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
          <p className="eyebrow text-[#FF7A8A]">Precios</p>
          <h2 className="mt-2 font-display text-3xl font-medium sm:text-4xl">Gratis para reclamar una vez. Pro para no soltar ninguno.</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {PLANES.map((p) => (
              <div key={p.n} className={`flex flex-col gap-4 rounded-xl p-6 ${p.destacado ? "bg-white text-ink" : "border border-white/15"}`}>
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display text-2xl">{p.n}</h3>
                  <div className="font-mono text-sm">
                    <span className="text-xl font-medium">{p.p}</span>
                    <span className={p.destacado ? "text-ink-300" : "text-ink-100"}>{p.per}</span>
                  </div>
                </div>
                <ul className={`flex flex-col gap-2 text-[15px] ${p.destacado ? "text-ink-500" : "text-ink-100"}`}>
                  {p.items.map((i) => (
                    <li key={i} className="flex gap-2">
                      <span className={p.destacado ? "text-sello" : "text-[#FF7A8A]"}>—</span>
                      {i}
                    </li>
                  ))}
                </ul>
                <Link href={p.href} className={`mt-auto ${p.destacado ? "btn-sello" : "btn border-white/30 bg-transparent text-white hover:bg-white/10"}`}>
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
          <p className="mt-6 font-mono text-[12px] text-ink-300">Precios en pesos chilenos, IVA incluido. El cobro se activa cuando conectemos pagos; mientras tanto todo Pro es gratis para quienes se registren.</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 md:py-20">
        <p className="eyebrow">Preguntas frecuentes</p>
        <div className="mt-6 divide-y divide-ink-100">
          {FAQ.map((f) => (
            <details key={f.q} className="group py-4">
              <summary className="cursor-pointer list-none font-semibold marker:content-none">
                <span className="mr-2 font-mono text-sello">§</span>
                {f.q}
              </summary>
              <p className="mt-2 pl-6 text-[15px] leading-relaxed text-ink-500">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <footer className="border-t border-ink-100">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-ink-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <Logo />
          <p className="max-w-[60ch] text-xs">
            Reclamo Express genera cartas de reclamo según la Ley 19.496 y normas sectoriales. No constituye asesoría jurídica ni reemplaza a un abogado.
            <Link href="/legal" className="ml-1 underline">Privacidad y términos</Link>
          </p>
        </div>
      </footer>
    </main>
  );
}

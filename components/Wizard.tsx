"use client";

import { useMemo, useState, useTransition } from "react";
import { crearCaso } from "@/app/app/nuevo/actions";
import { CATEGORIAS, CATEGORIA_KEYS, UF_TABLA } from "@/lib/legal/categorias";
import { dossier, reparaciones } from "@/lib/legal/motor";
import { fmtRut, rutValid } from "@/lib/legal/rut";
import type { Categoria, DatosCaso } from "@/lib/types";
import { Carta } from "./Carta";
import { Diagnostico, Escalada, Plazos, Reparacion } from "./Dossier";

const PASOS = ["¿Qué pasó?", "El caso", "Lo que pides", "Tus datos", "Revisar"];

function Field({ id, label, hint, children }: { id: string; label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <label htmlFor={id} className="label">{label}</label>
      {children}
      {hint && <p className="text-xs text-ink-300">{hint}</p>}
    </div>
  );
}

type UfInfo = { valor: number; fecha: string | null; fuente: "mindicador" | "respaldo" };

export function Wizard({ inicial, ufInfo }: { inicial: DatosCaso; ufInfo?: UfInfo }) {
  const [s, setS] = useState<DatosCaso>(inicial);
  const [paso, setPaso] = useState(0);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  const c = CATEGORIAS[s.cat];
  const dx = useMemo(() => dossier(s), [s]);
  const reps = reparaciones(s);

  function set<K extends keyof DatosCaso>(k: K, v: DatosCaso[K]) {
    setS((p) => ({ ...p, [k]: v }));
  }
  function setCat(cat: Categoria) {
    const def = CATEGORIAS[cat];
    setS((p) => ({ ...p, cat, subtipo: def.subtipos ? def.subtipos[0][0] : "", reparacion: def.reparaciones[0].key, evidencia: [] }));
  }
  function setSubtipo(subtipo: string) {
    setS((p) => {
      const n = { ...p, subtipo };
      const ok = reparaciones(n).some((r) => r.key === n.reparacion);
      return ok ? n : { ...n, reparacion: reparaciones(n)[0].key };
    });
  }
  function toggleEvid(e: string) {
    setS((p) => ({ ...p, evidencia: p.evidencia.includes(e) ? p.evidencia.filter((x) => x !== e) : [...p.evidencia, e] }));
  }

  function validar(p: number): string {
    if (p === 1) {
      if (s.proveedor.trim().length < 2) return "Indica la empresa.";
      if (!s.fecha) return "Indica la fecha.";
      if (s.item.trim().length < 2) return "Indica el producto o servicio.";
    }
    if (p === 3) {
      if (s.nombre.trim().length < 3) return "Indica tu nombre completo.";
      if (!/^\S+@\S+\.\S+$/.test(s.email)) return "Revisa tu correo.";
      if (s.rut && !rutValid(s.rut)) return "El RUT no es válido (revisa el dígito verificador).";
    }
    return "";
  }
  function siguiente() {
    const e = validar(paso);
    if (e) return setError(e);
    setError("");
    setPaso((p) => Math.min(p + 1, PASOS.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function guardar() {
    setError("");
    startTransition(async () => {
      const r = await crearCaso(s);
      if (r?.error) setError(r.error);
    });
  }

  const rutOk = s.rut ? rutValid(s.rut) : null;

  return (
    <main className="flex flex-col gap-6">
      <div>
        <p className="eyebrow">Nuevo reclamo</p>
        <h1 className="mt-1 font-display text-3xl font-medium sm:text-4xl">{PASOS[paso]}</h1>
      </div>

      {/* Stepper */}
      <ol className="flex flex-wrap gap-2">
        {PASOS.map((p, i) => (
          <li key={p} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => i < paso && setPaso(i)}
              className={`flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[11px] ${i === paso ? "border-ink bg-ink text-white" : i < paso ? "border-ink-100 bg-white text-ink" : "border-ink-100 text-ink-300"}`}
            >
              <span>{i + 1}</span>
              <span className="hidden sm:inline">{p}</span>
            </button>
          </li>
        ))}
      </ol>

      <div className={`grid gap-6 ${paso === 4 ? "" : "lg:grid-cols-[minmax(0,1fr),380px]"}`}>
        {/* Formulario */}
        <section className="flex flex-col gap-5">
          {paso === 0 && (
            <>
              <div className="grid gap-3 sm:grid-cols-2">
                {CATEGORIA_KEYS.map((k) => {
                  const d = CATEGORIAS[k];
                  const on = s.cat === k;
                  return (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setCat(k)}
                      className={`flex flex-col gap-1 rounded-xl border p-4 text-left transition-colors ${on ? "border-ink bg-white shadow-card ring-1 ring-ink" : "border-ink-100 bg-white hover:border-ink-300"}`}
                    >
                      <span className="font-semibold">{d.label}</span>
                      <span className="font-mono text-[11px] text-sello">{d.sub}</span>
                      <span className="text-sm text-ink-500">{d.descripcion}</span>
                    </button>
                  );
                })}
              </div>
              {c.subtipos && (
                <Field id="subtipo" label="Situación">
                  <select id="subtipo" className="input" value={s.subtipo} onChange={(e) => setSubtipo(e.target.value)}>
                    {c.subtipos.map(([k, l]) => (
                      <option key={k} value={k}>{l}</option>
                    ))}
                  </select>
                </Field>
              )}
            </>
          )}

          {paso === 1 && (
            <div className="flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field id="proveedor" label="Empresa (razón social o nombre comercial)">
                  <input id="proveedor" className="input" value={s.proveedor} onChange={(e) => set("proveedor", e.target.value)} />
                </Field>
                <Field id="proveedorEmail" label="Correo de contacto o de reclamos" hint="A este correo se envía la carta.">
                  <input id="proveedorEmail" type="email" className="input" value={s.proveedorEmail} onChange={(e) => set("proveedorEmail", e.target.value)} />
                </Field>
                <Field id="fecha" label={c.fechaLabel}>
                  <input id="fecha" type="date" className="input" value={s.fecha} onChange={(e) => set("fecha", e.target.value)} />
                </Field>
                {s.cat === "telecom" ? (
                  <Field id="planMensual" label={c.montoLabel}>
                    <input id="planMensual" type="number" inputMode="numeric" min={0} className="input" value={s.planMensual} onChange={(e) => set("planMensual", e.target.value)} />
                  </Field>
                ) : (
                  <Field id="monto" label={c.montoLabel}>
                    <input id="monto" type="number" inputMode="numeric" min={0} className="input" value={s.monto} onChange={(e) => set("monto", e.target.value)} />
                  </Field>
                )}
                <Field id="ref" label={c.refLabel}>
                  <input id="ref" className="input" value={s.ref} onChange={(e) => set("ref", e.target.value)} />
                </Field>
                <Field id="item" label={c.itemLabel}>
                  <input id="item" className="input" value={s.item} onChange={(e) => set("item", e.target.value)} />
                </Field>
                {s.cat === "cobro" && (
                  <Field id="meses" label="Cantidad de cobros realizados">
                    <input id="meses" type="number" inputMode="numeric" min={1} className="input" value={s.meses} onChange={(e) => set("meses", e.target.value)} />
                  </Field>
                )}
                {s.cat === "telecom" && (
                  <Field id="dias" label="Días sin servicio o con el problema">
                    <input id="dias" type="number" inputMode="numeric" min={0} className="input" value={s.diasSinServicio} onChange={(e) => set("diasSinServicio", e.target.value)} />
                  </Field>
                )}
                {s.cat === "vuelo" && s.subtipo === "denegacion" && (
                  <>
                    <Field id="distancia" label="Distancia del vuelo">
                      <select id="distancia" className="input" value={s.distancia} onChange={(e) => set("distancia", e.target.value)}>
                        {UF_TABLA.map((r) => (
                          <option key={r.key} value={r.key}>{r.label} · {r.uf} UF</option>
                        ))}
                      </select>
                    </Field>
                    <Field
                      id="uf"
                      label="Valor UF del día (CLP)"
                      hint={ufInfo?.fuente === "mindicador" ? `Valor oficial al ${ufInfo.fecha} (mindicador.cl). Puedes ajustarlo.` : "No pudimos obtener el valor de hoy: revísalo en sii.cl o mindicador.cl"}
                    >
                      <input id="uf" type="number" inputMode="numeric" min={0} className="input" value={s.uf} onChange={(e) => set("uf", e.target.value)} />
                    </Field>
                  </>
                )}
              </div>
              <Field id="relato" label="Qué pasó, en tus palabras" hint="Fechas, con quién hablaste, qué te respondieron. Entra tal cual a la carta.">
                <textarea id="relato" rows={5} className="input" value={s.relato} onChange={(e) => set("relato", e.target.value)} />
              </Field>
            </div>
          )}

          {paso === 2 && (
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                {reps.map((r) => (
                  <label key={r.key} className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 ${s.reparacion === r.key ? "border-ink bg-white ring-1 ring-ink" : "border-ink-100 bg-white"}`}>
                    <input type="radio" name="reparacion" className="mt-1 accent-ink" checked={s.reparacion === r.key} onChange={() => set("reparacion", r.key)} />
                    <span>
                      <span className="block font-semibold">{r.label}</span>
                      {r.desc && <span className="block text-sm text-ink-500">{r.desc}</span>}
                    </span>
                  </label>
                ))}
              </div>
              <div>
                <p className="label">Respaldo que tienes</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {c.evidencia.map((e) => {
                    const on = s.evidencia.includes(e);
                    return (
                      <button key={e} type="button" onClick={() => toggleEvid(e)} className={`rounded-full border px-3 py-1.5 text-sm ${on ? "border-ink bg-ink text-white" : "border-ink-100 bg-white"}`}>
                        {e}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {paso === 3 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="nombre" label="Nombre completo">
                <input id="nombre" className="input" autoComplete="name" value={s.nombre} onChange={(e) => set("nombre", e.target.value)} />
              </Field>
              <Field id="rut" label="RUT" hint={rutOk === null ? undefined : rutOk ? "RUT válido" : "Revisa el dígito verificador"}>
                <input id="rut" className="input" placeholder="12.345.678-9" value={s.rut} onChange={(e) => set("rut", e.target.value)} onBlur={(e) => set("rut", fmtRut(e.target.value))} />
              </Field>
              <Field id="email" label="Correo">
                <input id="email" type="email" className="input" autoComplete="email" value={s.email} onChange={(e) => set("email", e.target.value)} />
              </Field>
              <Field id="telefono" label="Teléfono">
                <input id="telefono" type="tel" className="input" autoComplete="tel" value={s.telefono} onChange={(e) => set("telefono", e.target.value)} />
              </Field>
              <Field id="ciudad" label="Ciudad">
                <input id="ciudad" className="input" value={s.ciudad} onChange={(e) => set("ciudad", e.target.value)} />
              </Field>
              <Field id="domicilio" label="Domicilio">
                <input id="domicilio" className="input" autoComplete="street-address" value={s.domicilio} onChange={(e) => set("domicilio", e.target.value)} />
              </Field>
            </div>
          )}

          {paso === 4 && (
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr),380px]">
              <Carta asunto={dx.asunto} carta={dx.carta} />
              <div className="flex flex-col gap-4">
                <Diagnostico bases={c.bases} alertas={dx.alertas} />
                <Reparacion d={dx.d} />
                <Plazos hitos={dx.hitos} plazo={dx.d.plazo} />
                <Escalada organismo={dx.organismo} texto={dx.sernac} />
              </div>
            </div>
          )}

          {error && <p className="rounded-md border border-sello/30 bg-sello-soft px-3 py-2 text-sm text-sello">{error}</p>}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink-100 pt-4">
            <button type="button" className="btn-ghost" onClick={() => setPaso((p) => Math.max(0, p - 1))} disabled={paso === 0}>
              Atrás
            </button>
            {paso < PASOS.length - 1 ? (
              <button type="button" className="btn" onClick={siguiente}>
                Continuar
              </button>
            ) : (
              <button type="button" className="btn-sello" onClick={guardar} disabled={pending}>
                {pending ? "Guardando…" : "Guardar caso y continuar"}
              </button>
            )}
          </div>
        </section>

        {/* Vista previa viva */}
        {paso < 4 && (
          <aside className="flex flex-col gap-4 lg:sticky lg:top-6 lg:self-start">
            <Reparacion d={dx.d} />
            <Diagnostico bases={c.bases} alertas={dx.alertas} />
            <p className="text-xs text-ink-300">La carta completa aparece en el paso de revisión.</p>
          </aside>
        )}
      </div>
    </main>
  );
}

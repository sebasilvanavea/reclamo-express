"use client";

import { useState, useTransition } from "react";
import { agregarNota, cerrarCaso, eliminarCaso, enviarPorCorreo, marcarEnviada, marcarEscalada, registrarRespuesta } from "@/app/app/casos/[id]/actions";
import type { Caso, Estado } from "@/lib/types";

type R = { error?: string; ok?: string } | undefined | void;

export function CasoAcciones({ caso, emailListo, organismo }: { caso: Caso; emailListo: boolean; organismo: string }) {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ t: "ok" | "error"; m: string } | null>(null);
  const [respuesta, setRespuesta] = useState<Estado>("acogida");
  const [detalle, setDetalle] = useState("");
  const [nota, setNota] = useState("");
  const [confirmarBorrar, setConfirmarBorrar] = useState(false);

  function run(fn: () => Promise<R>) {
    setMsg(null);
    start(async () => {
      const r = await fn();
      if (r && "error" in r && r.error) setMsg({ t: "error", m: r.error });
      else if (r && "ok" in r && r.ok) setMsg({ t: "ok", m: r.ok });
    });
  }

  const e = caso.estado;
  const puedeEnviar = e === "borrador";
  const puedeResponder = e === "enviada";
  const puedeEscalar = ["rechazada", "sin_respuesta", "parcial", "enviada"].includes(e);
  const puedeCerrar = !["cerrada", "borrador"].includes(e);

  return (
    <div className="card flex flex-col gap-4">
      <h3 className="label">Acciones</h3>

      {puedeEnviar && (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-ink-500">
            {emailListo && caso.proveedor_email
              ? `Enviamos la carta a ${caso.proveedor_email} con copia a tu correo y empezamos a contar el plazo.`
              : "Copia la carta (o descarga el PDF) y envíala desde tu correo; luego márcala como enviada para contar el plazo."}
          </p>
          <div className="flex flex-wrap gap-2">
            {emailListo && caso.proveedor_email && (
              <button type="button" className="btn-sello" disabled={pending} onClick={() => run(() => enviarPorCorreo(caso.id))}>
                Enviar por correo
              </button>
            )}
            <button type="button" className="btn-ghost" disabled={pending} onClick={() => run(() => marcarEnviada(caso.id))}>
              Ya la envié: marcar como enviada
            </button>
          </div>
        </div>
      )}

      {puedeResponder && (
        <div className="flex flex-col gap-2 border-t border-ink-100 pt-4">
          <p className="label">¿Qué respondió la empresa?</p>
          <div className="flex flex-col gap-2">
            <select className="input" value={respuesta} onChange={(ev) => setRespuesta(ev.target.value as Estado)}>
              <option value="acogida">Acogió el reclamo</option>
              <option value="parcial">Acogió parcialmente</option>
              <option value="rechazada">Lo rechazó</option>
              <option value="sin_respuesta">No respondió</option>
            </select>
            <input className="input" placeholder="Detalle (opcional): qué ofrecieron, fecha, quién respondió" value={detalle} onChange={(ev) => setDetalle(ev.target.value)} />
          </div>
          <div>
            <button type="button" className="btn" disabled={pending} onClick={() => run(() => registrarRespuesta(caso.id, respuesta, detalle))}>
              Registrar respuesta
            </button>
          </div>
        </div>
      )}

      {puedeEscalar && e !== "enviada" && (
        <div className="flex flex-col gap-2 border-t border-ink-100 pt-4">
          <p className="text-sm text-ink-500">Ingresa el reclamo en {organismo} con el texto de abajo y después márcalo aquí para seguir el expediente.</p>
          <div>
            <button type="button" className="btn-sello" disabled={pending} onClick={() => run(() => marcarEscalada(caso.id, organismo))}>
              Ya lo ingresé en {organismo}
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2 border-t border-ink-100 pt-4">
        <p className="label">Nota al expediente</p>
        <div className="grid gap-2 sm:grid-cols-[1fr,auto]">
          <input className="input" placeholder="Llamé al servicio al cliente, ticket 44812…" value={nota} onChange={(ev) => setNota(ev.target.value)} />
          <button type="button" className="btn-ghost" disabled={pending || !nota.trim()} onClick={() => run(async () => { const r = await agregarNota(caso.id, nota); if (r?.ok) setNota(""); return r; })}>
            Agregar
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-ink-100 pt-4">
        {puedeCerrar && (
          <button type="button" className="btn-ghost btn-sm" disabled={pending} onClick={() => run(() => cerrarCaso(caso.id, ""))}>
            Cerrar caso
          </button>
        )}
        {!confirmarBorrar ? (
          <button type="button" className="text-xs text-ink-300 underline-offset-2 hover:underline" onClick={() => setConfirmarBorrar(true)}>
            Eliminar caso
          </button>
        ) : (
          <span className="flex items-center gap-2 text-xs">
            ¿Eliminar definitivamente?
            <button type="button" className="font-semibold text-sello underline" disabled={pending} onClick={() => run(() => eliminarCaso(caso.id))}>Sí, eliminar</button>
            <button type="button" className="underline" onClick={() => setConfirmarBorrar(false)}>No</button>
          </span>
        )}
      </div>

      {msg && <p className={`rounded-md px-3 py-2 text-sm ${msg.t === "ok" ? "bg-ok-soft text-ok" : "bg-sello-soft text-sello"}`}>{msg.m}</p>}
    </div>
  );
}

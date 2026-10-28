"use client";

import { useState, useTransition } from "react";
import { eliminarCuenta, guardarPerfil } from "@/app/app/cuenta/actions";

type Perfil = { nombre: string; rut: string; telefono: string; ciudad: string; domicilio: string };

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <label htmlFor={id} className="label">{label}</label>
      {children}
    </div>
  );
}

export function PerfilForm({ perfil }: { perfil: Perfil }) {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ t: "ok" | "error"; m: string } | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setMsg(null);
    start(async () => {
      const r = await guardarPerfil(form);
      if (r?.error) setMsg({ t: "error", m: r.error });
      else if (r?.ok) setMsg({ t: "ok", m: r.ok });
    });
  }

  return (
    <form onSubmit={onSubmit} className="card flex flex-col gap-4">
      <h3 className="label">Mis datos para las cartas</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="nombre" label="Nombre completo"><input id="nombre" name="nombre" className="input" defaultValue={perfil.nombre} autoComplete="name" /></Field>
        <Field id="rut" label="RUT"><input id="rut" name="rut" className="input" defaultValue={perfil.rut} placeholder="12.345.678-9" /></Field>
        <Field id="telefono" label="Teléfono"><input id="telefono" name="telefono" className="input" defaultValue={perfil.telefono} autoComplete="tel" /></Field>
        <Field id="ciudad" label="Ciudad"><input id="ciudad" name="ciudad" className="input" defaultValue={perfil.ciudad} /></Field>
        <div className="sm:col-span-2">
          <Field id="domicilio" label="Domicilio"><input id="domicilio" name="domicilio" className="input" defaultValue={perfil.domicilio} autoComplete="street-address" /></Field>
        </div>
      </div>
      {msg && <p className={`rounded-md px-3 py-2 text-sm ${msg.t === "ok" ? "bg-ok-soft text-ok" : "bg-sello-soft text-sello"}`}>{msg.m}</p>}
      <div>
        <button type="submit" className="btn" disabled={pending}>{pending ? "Guardando…" : "Guardar"}</button>
      </div>
    </form>
  );
}

export function EliminarCuenta({ borraAcceso }: { borraAcceso: boolean }) {
  const [pending, start] = useTransition();
  const [abierto, setAbierto] = useState(false);
  const [texto, setTexto] = useState("");
  const [error, setError] = useState("");

  function confirmar() {
    setError("");
    start(async () => {
      const r = await eliminarCuenta(texto);
      if (r?.error) setError(r.error);
    });
  }

  return (
    <div className="card flex flex-col gap-3 border-sello/30">
      <h3 className="label text-sello">Eliminar mi cuenta</h3>
      <p className="text-sm text-ink-500">
        Borra de forma definitiva todos tus casos, cartas y bitácoras{borraAcceso ? " y tu cuenta de acceso" : ""}. No se puede deshacer. Si quieres conservar una copia, exporta tus datos primero.
      </p>
      {!abierto ? (
        <div>
          <button type="button" className="btn-ghost btn-sm text-sello" onClick={() => setAbierto(true)}>Quiero eliminar mi cuenta</button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <label htmlFor="confirmar" className="text-sm">Escribe <span className="font-mono font-semibold">ELIMINAR</span> para confirmar:</label>
          <div className="flex flex-wrap gap-2">
            <input id="confirmar" className="input max-w-[220px]" value={texto} onChange={(e) => setTexto(e.target.value)} autoComplete="off" />
            <button type="button" className="btn-sello" disabled={pending || texto.trim().toUpperCase() !== "ELIMINAR"} onClick={confirmar}>
              {pending ? "Eliminando…" : "Eliminar definitivamente"}
            </button>
            <button type="button" className="btn-ghost" onClick={() => { setAbierto(false); setTexto(""); }}>Cancelar</button>
          </div>
          {error && <p className="text-sm text-sello">{error}</p>}
        </div>
      )}
    </div>
  );
}

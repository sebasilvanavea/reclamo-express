"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const params = useSearchParams();
  const plan = params.get("plan");
  const next = params.get("next") || (plan === "pro" || plan === "pyme" ? `/app?plan=${plan}` : "/app");
  const [email, setEmail] = useState("");
  const [estado, setEstado] = useState<"idle" | "enviando" | "enviado" | "error">("idle");
  const [error, setError] = useState("");

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setEstado("enviando");
    setError("");
    const supabase = createClient();
    const origin = window.location.origin;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}` },
    });
    if (error) {
      setEstado("error");
      setError(error.message);
      return;
    }
    setEstado("enviado");
  }

  if (estado === "enviado") {
    return (
      <div className="mt-6 rounded-lg border border-ok/30 bg-ok-soft p-4 text-sm">
        <p className="font-semibold text-ok">Revisa tu correo</p>
        <p className="mt-1 text-ink-500">
          Enviamos un enlace a <span className="font-mono">{email}</span>. Ábrelo desde este mismo dispositivo para entrar. Si no llega en un minuto, revisa spam.
        </p>
        <button type="button" onClick={() => setEstado("idle")} className="mt-3 text-xs underline">
          Usar otro correo
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} className="mt-6 flex flex-col gap-3">
      <label className="label" htmlFor="email">Correo</label>
      <input id="email" type="email" required autoComplete="email" className="input" placeholder="tu@correo.cl" value={email} onChange={(e) => setEmail(e.target.value)} />
      {estado === "error" && <p className="text-sm text-sello">No pudimos enviar el enlace: {error}</p>}
      <button type="submit" className="btn" disabled={estado === "enviando"}>
        {estado === "enviando" ? "Enviando…" : "Enviarme el enlace"}
      </button>
    </form>
  );
}

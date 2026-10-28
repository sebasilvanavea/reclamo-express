"use client";

import { useSearchParams } from "next/navigation";

const MENSAJES: Record<string, string> = {
  eliminada: "Tu cuenta y todos tus datos fueron eliminados. Gracias por usar Reclamo Express.",
  "datos-eliminados": "Tus casos y datos fueron eliminados. El correo de acceso se borrará en las próximas horas.",
};

/** Aviso en la landing tras eliminar la cuenta (?cuenta=...). Va dentro de <Suspense>. */
export function AvisoCuenta() {
  const params = useSearchParams();
  const m = MENSAJES[params.get("cuenta") ?? ""];
  if (!m) return null;
  return (
    <div className="border-b border-ok/30 bg-ok-soft">
      <p className="mx-auto max-w-6xl px-4 py-3 text-sm text-ok sm:px-6">{m}</p>
    </div>
  );
}

import Link from "next/link";
import { Logo } from "@/components/Logo";

export const metadata = { title: "Privacidad y términos" };

export default function LegalPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Logo />
      <h1 className="mt-10 font-display text-4xl font-medium">Privacidad y términos</h1>
      <p className="mt-2 font-mono text-xs text-ink-300">Vigente desde el 1 de diciembre de 2026 · Ley 21.719</p>

      <section className="prose-sm mt-8 flex flex-col gap-4 text-[15px] leading-relaxed text-ink-500">
        <h2 className="font-display text-2xl text-ink">1. Qué hace Reclamo Express</h2>
        <p>Reclamo Express genera cartas de reclamo y textos para organismos públicos a partir de la información que ingresas, aplicando plantillas basadas en la Ley 19.496 y normas sectoriales. El servicio no constituye asesoría jurídica, no garantiza resultados y no reemplaza la revisión de un abogado para casos complejos o de alto monto.</p>

        <h2 className="font-display text-2xl text-ink">2. Datos que tratamos y para qué</h2>
        <p>Tratamos tu correo (para identificarte), los datos que ingresas en cada caso (nombre, RUT, domicilio, datos del proveedor, hechos y montos) y la bitácora del caso. La finalidad es exclusivamente generar y gestionar tus reclamos. Base de licitud: ejecución del servicio que solicitas (art. 13 Ley 21.719). No vendemos ni cedemos datos a terceros.</p>

        <h2 className="font-display text-2xl text-ink">3. Encargados</h2>
        <p>Alojamiento y base de datos: Supabase. Envío de correos: Resend. Infraestructura web: Netlify. Cada uno actúa como encargado del tratamiento bajo nuestras instrucciones.</p>

        <h2 className="font-display text-2xl text-ink">4. Tus derechos</h2>
        <p>Puedes acceder, rectificar, exportar y eliminar tus datos en cualquier momento desde la aplicación o escribiendo al correo de contacto. La eliminación de la cuenta borra todos tus casos de forma definitiva.</p>

        <h2 className="font-display text-2xl text-ink">5. Conservación y seguridad</h2>
        <p>Conservamos los casos mientras tu cuenta esté activa. Cada cuenta solo puede leer sus propios registros (políticas de seguridad a nivel de fila en la base de datos) y las comunicaciones viajan cifradas.</p>

        <h2 className="font-display text-2xl text-ink">6. Uso aceptable</h2>
        <p>Te comprometes a ingresar información veraz y a usar las cartas solo para reclamos propios o de personas que representas con su autorización. Nos reservamos el derecho de suspender cuentas que generen reclamos falsos o abusivos.</p>
      </section>

      <p className="mt-10">
        <Link href="/" className="btn-ghost btn-sm">Volver al inicio</Link>
      </p>
    </main>
  );
}

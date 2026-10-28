import { Suspense } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { LoginForm } from "@/components/LoginForm";

export const metadata = { title: "Ingresar" };

export default function LoginPage() {
  return (
    <main className="grid min-h-screen md:grid-cols-[1fr,1fr]">
      <section className="hidden bg-ink p-10 text-white md:flex md:flex-col md:justify-between">
        <Logo light />
        <div className="max-w-[40ch]">
          <p className="eyebrow text-[#FF7A8A]">Sin contraseña</p>
          <h1 className="mt-3 font-display text-4xl font-medium leading-tight">Un enlace a tu correo y entras. Tus casos quedan guardados y solo tú los ves.</h1>
          <p className="mt-4 text-ink-100">Cada caso guarda la carta, el plazo que fijaste y lo que respondió la empresa, para escalar con todo a la mano.</p>
        </div>
        <p className="font-mono text-[12px] text-ink-300">Ley 21.719 · datos mínimos, cifrados, borrables</p>
      </section>
      <section className="flex flex-col justify-center px-4 py-12 sm:px-10">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8 md:hidden">
            <Logo />
          </div>
          <h2 className="font-display text-3xl font-medium">Ingresar</h2>
          <p className="mt-2 text-sm text-ink-500">Te enviamos un enlace de acceso. No necesitas crear una contraseña.</p>
          <Suspense>
            <LoginForm />
          </Suspense>
          <p className="mt-8 text-xs text-ink-300">
            Al continuar aceptas los <Link href="/legal" className="underline">términos y la política de privacidad</Link>.
          </p>
        </div>
      </section>
    </main>
  );
}

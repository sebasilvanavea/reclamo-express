import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-start justify-center gap-6 px-4 py-16 sm:px-6">
      <Logo />
      <p className="eyebrow">Error 404</p>
      <h1 className="font-display text-4xl font-medium">Esta página no existe o ya no está disponible.</h1>
      <p className="max-w-[52ch] text-ink-500">Si llegaste desde un enlace de un caso, puede que lo hayas eliminado o que la sesión haya expirado.</p>
      <div className="flex gap-3">
        <Link href="/app" className="btn">Ir a mis casos</Link>
        <Link href="/" className="btn-ghost">Volver al inicio</Link>
      </div>
    </main>
  );
}

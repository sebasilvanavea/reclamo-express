import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/Logo";
import { createClient } from "@/lib/supabase/server";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/app");

  return (
    <div className="min-h-screen">
      <header className="border-b border-ink-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Logo href="/app" />
          <nav className="flex items-center gap-2 text-sm sm:gap-4">
            <Link href="/app" className="hidden text-ink-500 hover:text-ink sm:inline">Mis casos</Link>
            <Link href="/app/nuevo" className="btn btn-sm">Nuevo reclamo</Link>
            <form action="/auth/signout" method="post" className="flex items-center gap-3">
              <Link href="/app/cuenta" className="hidden max-w-[22ch] truncate font-mono text-[11px] text-ink-300 hover:text-ink hover:underline md:inline" title="Mi cuenta">{user.email}</Link>
              <Link href="/app/cuenta" className="text-xs text-ink-500 underline-offset-2 hover:underline md:hidden">Cuenta</Link>
              <button type="submit" className="text-xs text-ink-500 underline-offset-2 hover:underline">Salir</button>
            </form>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</div>
    </div>
  );
}

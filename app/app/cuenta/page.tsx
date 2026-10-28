import { EliminarCuenta, PerfilForm } from "@/components/CuentaForms";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Mi cuenta" };

const PLAN: Record<string, string> = { gratis: "Gratis", pro: "Pro", pyme: "Pymes" };

export default async function CuentaPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: perfil } = await supabase.from("profiles").select("nombre, rut, telefono, ciudad, domicilio, plan, plan_interes").eq("id", user!.id).maybeSingle();
  const { count } = await supabase.from("cases").select("id", { count: "exact", head: true });

  return (
    <main className="flex flex-col gap-6">
      <div>
        <p className="eyebrow">Cuenta</p>
        <h1 className="mt-1 font-display text-3xl font-medium sm:text-4xl">Mi cuenta</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr),360px]">
        <div className="flex flex-col gap-6">
          <PerfilForm
            perfil={{
              nombre: perfil?.nombre ?? "",
              rut: perfil?.rut ?? "",
              telefono: perfil?.telefono ?? "",
              ciudad: perfil?.ciudad ?? "",
              domicilio: perfil?.domicilio ?? "",
            }}
          />
          <EliminarCuenta borraAcceso={Boolean(createAdminClient())} />
        </div>

        <aside className="flex flex-col gap-4">
          <div className="card flex flex-col gap-2">
            <h3 className="label">Acceso</h3>
            <p className="font-mono text-sm">{user?.email}</p>
            <p className="text-xs text-ink-300">Entras con un enlace a este correo. Para cambiarlo, escríbenos.</p>
          </div>
          <div className="card flex flex-col gap-2">
            <h3 className="label">Plan</h3>
            <p className="font-display text-2xl">{PLAN[perfil?.plan ?? "gratis"] ?? "Gratis"}</p>
            <p className="text-xs text-ink-500">
              Mientras conectamos pagos, todas las funciones Pro están activas sin costo.
              {perfil?.plan_interes === "pyme" && " Estás en la lista de espera del plan Pymes."}
            </p>
          </div>
          <div className="card flex flex-col gap-2">
            <h3 className="label">Mis datos</h3>
            <p className="text-sm text-ink-500">{count ?? 0} {count === 1 ? "caso guardado" : "casos guardados"}. Descarga una copia completa en JSON (perfil, casos, cartas y bitácora).</p>
            <div>
              <a href="/api/cuenta/exportar" className="btn-ghost btn-sm" download>Exportar mis datos</a>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

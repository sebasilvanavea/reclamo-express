import { Wizard } from "@/components/Wizard";
import { DATOS_VACIOS } from "@/lib/legal/motor";
import { valorUF } from "@/lib/legal/uf";
import { createClient } from "@/lib/supabase/server";
import type { DatosCaso } from "@/lib/types";

export const metadata = { title: "Nuevo reclamo" };

export default async function NuevoCaso() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const [{ data: perfil }, uf] = await Promise.all([
    supabase.from("profiles").select("nombre, rut, telefono, ciudad, domicilio").eq("id", user!.id).maybeSingle(),
    valorUF(),
  ]);

  const inicial: DatosCaso = {
    ...DATOS_VACIOS,
    uf: String(uf.valor),
    email: user?.email ?? "",
    nombre: perfil?.nombre ?? "",
    rut: perfil?.rut ?? "",
    telefono: perfil?.telefono ?? "",
    ciudad: perfil?.ciudad ?? "",
    domicilio: perfil?.domicilio ?? "",
    reparacion: "devolucion",
  };

  return <Wizard inicial={inicial} ufInfo={uf} />;
}

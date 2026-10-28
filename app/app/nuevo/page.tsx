import { Wizard } from "@/components/Wizard";
import { DATOS_VACIOS } from "@/lib/legal/motor";
import { createClient } from "@/lib/supabase/server";
import type { DatosCaso } from "@/lib/types";

export const metadata = { title: "Nuevo reclamo" };

export default async function NuevoCaso() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: perfil } = await supabase.from("profiles").select("nombre, rut, telefono, ciudad, domicilio").eq("id", user!.id).maybeSingle();

  const inicial: DatosCaso = {
    ...DATOS_VACIOS,
    email: user?.email ?? "",
    nombre: perfil?.nombre ?? "",
    rut: perfil?.rut ?? "",
    telefono: perfil?.telefono ?? "",
    ciudad: perfil?.ciudad ?? "",
    domicilio: perfil?.domicilio ?? "",
    reparacion: "devolucion",
  };

  return <Wizard inicial={inicial} />;
}

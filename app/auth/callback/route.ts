import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const nextParam = searchParams.get("next") ?? "/app";
  const next = nextParam.startsWith("/") ? nextParam : "/app";

  const supabase = await createClient();
  // Destino absoluto y sin la query de esta petición (el middleware limpia lo que el hosting agregue).
  const destino = new URL(next, origin);

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(destino);
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) return NextResponse.redirect(destino);
  }

  return NextResponse.redirect(new URL("/login?error=enlace", origin));
}

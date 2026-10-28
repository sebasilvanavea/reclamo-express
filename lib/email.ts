import { Resend } from "resend";

export const emailConfigurado = () => Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);

export async function enviarEmail(opts: { to: string; cc?: string; subject: string; text: string; replyTo?: string }) {
  if (!emailConfigurado()) throw new Error("Correo no configurado (RESEND_API_KEY / EMAIL_FROM).");
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: [opts.to],
    cc: opts.cc ? [opts.cc] : undefined,
    replyTo: opts.replyTo,
    subject: opts.subject,
    text: opts.text,
  });
  if (error) throw new Error(error.message);
}

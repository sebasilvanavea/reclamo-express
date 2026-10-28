import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

const display = Fraunces({ subsets: ["latin"], variable: "--font-display", weight: ["400", "500", "600"], style: ["normal", "italic"] });
const sans = IBM_Plex_Sans({ subsets: ["latin"], variable: "--font-sans", weight: ["400", "500", "600"] });
const mono = IBM_Plex_Mono({ subsets: ["latin"], variable: "--font-mono", weight: ["400", "500"] });

export const metadata: Metadata = {
  title: { default: "Reclamo Express", template: "%s · Reclamo Express" },
  description: "Tu carta de reclamo con base legal chilena en 2 minutos. Garantía legal, retracto, vuelos, cobros indebidos, servicios y telecomunicaciones.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CL" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}

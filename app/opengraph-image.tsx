import { ImageResponse } from "next/og";

export const alt = "Reclamo Express · Tu carta de reclamo con base legal chilena en 2 minutos";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  const sitio = (() => {
    try {
      return new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "").host;
    } catch {
      return "";
    }
  })();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "#0B1F3A",
          color: "#FFFFFF",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ display: "flex", width: 56, height: 56, borderRadius: 999, border: "3px solid #FF7A8A", alignItems: "center", justifyContent: "center", fontSize: 30, fontWeight: 700 }}>§</div>
          <div style={{ fontSize: 34, fontWeight: 600, letterSpacing: -0.5 }}>Reclamo Express</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ fontSize: 22, letterSpacing: 4, color: "#FF7A8A", fontFamily: "monospace" }}>LEY 19.496 · SERNAC · SUBTEL</div>
          <div style={{ fontSize: 76, lineHeight: 1.02, fontWeight: 500, display: "flex", flexDirection: "column" }}>
            <span>Te deben plata.</span>
            <span style={{ fontStyle: "italic", fontWeight: 400, color: "#DCE3EE" }}>Reclámala con la ley en la mano.</span>
          </div>
          <div style={{ fontSize: 28, color: "#DCE3EE", fontFamily: "sans-serif", maxWidth: 980 }}>
            Carta de reclamo formal con los artículos exactos, el monto que puedes exigir y el plazo de respuesta. Gratis.
          </div>
        </div>
        <div style={{ fontSize: 20, color: "#6B82A3", fontFamily: "monospace" }}>{`${sitio ? sitio + " · " : ""}Garantía legal · Retracto · Vuelos · Cobros · Servicios · Telecom`}</div>
      </div>
    ),
    { ...size }
  );
}

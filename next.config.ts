import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["@react-pdf/renderer"],
  eslint: { ignoreDuringBuilds: true },
  // pdfkit carga las fuentes estándar (Times, Courier…) con require dinámico; el trazado
  // automático no las detecta y la función serverless falla con 500. Se incluyen a mano.
  outputFileTracingIncludes: {
    "/api/casos/[id]/pdf": ["./node_modules/pdfkit/js/standard-fonts/**", "./node_modules/pdfkit/js/data/**"],
  },
};

export default nextConfig;

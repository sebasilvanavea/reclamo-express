import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["@react-pdf/renderer"],
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  serverExternalPackages: [
    "playwright",
    "lighthouse",
    "chrome-launcher",
    "@axe-core/playwright",
    "axe-core",
    "@react-pdf/renderer",
  ],
};

export default nextConfig;

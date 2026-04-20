import type { NextConfig } from "next";

const allowedDevOrigins = [
  "localhost",
  "127.0.0.1",
  ...(process.env.NEXT_ALLOWED_DEV_ORIGINS?.split(",") ?? []),
]
  .map((origin) => origin.trim())
  .filter(Boolean);

const nextConfig: NextConfig = {
  ...(process.env.NODE_ENV === "development" && allowedDevOrigins.length
    ? { allowedDevOrigins }
    : {}),
  transpilePackages: [
    "@base-ui/react",
    "@base-ui/utils",
    "@floating-ui/utils",
    // Mobile Safari / older WebView compatibility: ensure dependencies are transpiled.
    "@tanstack/react-query",
    "lucide-react",
    "next-themes",
    "qrcode.react",
    "sonner",
  ],
};

export default nextConfig;

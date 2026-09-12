import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", "cloudinary"],
  experimental: {
    serverActions: {
      bodySizeLimit: "32mb",
    },
  },
  // Allow phone access via Cloudflare / localtunnel in development
  allowedDevOrigins: [
    "*.trycloudflare.com",
    "*.loca.lt",
    "172.16.8.215",
    "localhost",
    "127.0.0.1",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
      protocol: "https",
      hostname: "noillin-media.s3.eu-north-1.amazonaws.com"
    }
    ],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bcasrepo.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "bcasrepo.s3.us-east-1.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;

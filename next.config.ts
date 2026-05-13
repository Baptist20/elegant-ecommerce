import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // This allows Next.js to optimize local images and specific remote ones
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
    ],
  },
};

export default nextConfig;

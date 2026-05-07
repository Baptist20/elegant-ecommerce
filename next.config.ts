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
  env: {
    // If VERCEL_URL exists (on Vercel), use it. Otherwise, use your local/prod env var.
    KINDE_SITE_URL: process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.KINDE_SITE_URL,
    KINDE_POST_LOGIN_REDIRECT_URL: process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/dashboard`
      : process.env.KINDE_POST_LOGIN_REDIRECT_URL,
    KINDE_POST_LOGOUT_REDIRECT_URL: process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.KINDE_POST_LOGOUT_REDIRECT_URL,
  },
  // env: {
  //   KINDE_SITE_URL:
  //     process.env.KINDE_SITE_URL ?? `https://${process.env.VERCEL_URL}`,
  //   KINDE_POST_LOGOUT_REDIRECT_URL:
  //     process.env.KINDE_POST_LOGOUT_REDIRECT_URL ??
  //     `https://${process.env.VERCEL_URL}`,
  //   KINDE_POST_LOGIN_REDIRECT_URL:
  //     process.env.KINDE_POST_LOGIN_REDIRECT_URL ??
  //     `https://${process.env.VERCEL_URL}/dashboard`,
  // },
};

export default nextConfig;

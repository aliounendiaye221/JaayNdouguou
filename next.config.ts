import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: 'export', // Disabled because API routes require dynamic server
  images: {
    unoptimized: true, // Required for static export
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  trailingSlash: true, // Better routing in Capacitor
  // Optimize for mobile
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  },
};

export default nextConfig;

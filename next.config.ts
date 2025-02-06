import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["developers.google.com", 
      "lh3.googleusercontent.com",
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.google.com',
        port: '',
        search: '',
      },
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com',
        port: '',
        search: '',
      },
      {
        protocol: 'https',
        hostname: '**.ceburrito.ph',
        port: '',
        search: '',
      },
    ],
  },
};

export default nextConfig;

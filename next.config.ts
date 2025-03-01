import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    /* domains: ["developers.google.com", 
      "lh3.googleusercontent.com",
      "posapi-dev.ceburrito.ph",
      "posapi-test.ceburrito.ph",
      "posapi.ceburrito.ph",


    ]*/
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'developers.google.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'posapi-dev.ceburrito.ph',
      },
      {
        protocol: 'https',
        hostname: 'posapi-test.ceburrito.ph',
      },
      {
        protocol: 'https',
        hostname: 'posapi-prod.ceburrito.ph',
      },
      {
        protocol: 'https',
        hostname: 'posapi.ceburrito.ph',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // Set the desired limit (e.g., 10MB)
    },
  },
};

export default nextConfig;

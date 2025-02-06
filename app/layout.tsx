import '@/app/style/globals.css';

import { Analytics } from '@vercel/analytics/react';

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ceburrito POS",
  description: "Ceburrito POS progressive web application made with NextJS",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: ["nextjs", "next15", "pwa", "next-pwa"],
  //themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#fff" }],
  authors: [
    {
      name: "hnapoles",
      url: "https://github.com/hnapoles",
    },
  ],
  //viewport:
  //  "minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover",
  icons: [
    { rel: "apple-touch-icon", url: "icons/icon-128x128.png" },
    { rel: "icon", url: "icons/icon-128x128.png" },
  ],
};

import AuthProvider from '@/app/provider/auth-provider'

import { Toaster } from "@/components/ui/toaster"

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen w-full flex-col">
        <AuthProvider>{children}</AuthProvider>
        <Toaster />
      </body>
      <Analytics />
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PlaylistLoader } from "@/components/playlist-loader";
import { ServiceWorkerProvider } from "@/lib/pwa/service-worker-provider";
import Script from "next/script";
import { AnalyticsProvider } from "@/components/analytics/analytics-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: {
    media: "(prefers-color-scheme: dark)",
    color: "#000000"
  }
}

export const metadata: Metadata = {
  title: "Wonamp - Make Your Playlist Dreams Come True",
  description: "Transform your music experience with Wonamp - where your playlist dreams come true. A modern web-based audio player inspired by the classic Winamp.",
  keywords: ["audio player", "music player", "web audio", "winamp", "wonamp", "playlist", "music streaming"],
  authors: [{ name: "Wonamp" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Wonamp"
  },
  openGraph: {
    title: "Wonamp - Make Your Playlist Dreams Come True",
    description: "Transform your music experience with Wonamp - where your playlist dreams come true. A modern web-based audio player inspired by the classic Winamp.",
    type: "website",
    siteName: "Wonamp",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wonamp - Make Your Playlist Dreams Come True",
    description: "Transform your music experience with Wonamp - where your playlist dreams come true. A modern web-based audio player inspired by the classic Winamp.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="apple-touch-startup-image" href="/splash.png" />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-013B1YZQXZ"
          strategy="afterInteractive"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}
      >
        <ServiceWorkerProvider>
          <PlaylistLoader />
          <AnalyticsProvider />
          {children}
        </ServiceWorkerProvider>
      </body>
    </html>
  );
}

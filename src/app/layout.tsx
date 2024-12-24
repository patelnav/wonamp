import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PlaylistLoader } from "@/components/playlist-loader";
import { ServiceWorkerProvider } from "@/lib/pwa/service-worker-provider";
import Script from "next/script";
import LogRocket from 'logrocket';

// Initialize LogRocket in production
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  LogRocket.init('98k6pd/wonamp');
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wonamp - Make Your Playlist Dreams Come True",
  description: "Transform your music experience with Wonamp - where your playlist dreams come true. A modern web-based audio player inspired by the classic Winamp.",
  keywords: ["audio player", "music player", "web audio", "winamp", "wonamp", "playlist", "music streaming"],
  authors: [{ name: "Wonamp" }],
  manifest: "/manifest.json",
  themeColor: {
    media: "(prefers-color-scheme: dark)",
    color: "#000000"
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false
  },
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
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-013B1YZQXZ');
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}
      >
        <ServiceWorkerProvider>
          <PlaylistLoader />
          {children}
        </ServiceWorkerProvider>
      </body>
    </html>
  );
}

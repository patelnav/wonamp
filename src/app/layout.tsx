import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

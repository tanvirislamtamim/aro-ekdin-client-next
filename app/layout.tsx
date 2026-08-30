import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "./providers";
import Script from "next/script";

export const viewport: Viewport = {
  themeColor: "#02040a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Aro Ekdin | Elite Volleyball Team",
  description:
    "Bound by Passion, Driven by Teamwork - Official Aro Ekdin Volleyball Club, 3D Tactical Court & Community.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/logo.png", sizes: "192x192", type: "image/png" },
      { url: "/logo.png", sizes: "512x512", type: "image/png" },
      { url: "https://res.cloudinary.com/do8awe7fc/image/upload/q_auto/f_auto/v1777145975/Logo_qzb1xk.jpg" },
    ],
    apple: [
      { url: "/logo.png", sizes: "180x180", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Aro Ekdin",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Aro Ekdin" />
        <link
          href="https://unpkg.com/cloudinary-video-player@1.10.6/dist/cld-video-player.min.css"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen bg-[#02040a] text-white">
        <Providers>{children}</Providers>
        <Script
          src="https://unpkg.com/cloudinary-video-player@1.10.6/dist/cld-video-player.min.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}

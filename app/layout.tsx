import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "./providers";
import Script from "next/script";

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Aro Ekdin",
  description: "Bound by Passion, Driven by Teamwork - Aro Ekdin Volleyball Community",
  icons: {
    icon: "https://res.cloudinary.com/do8awe7fc/image/upload/q_auto/f_auto/v1777145975/Logo_qzb1xk.jpg",
    apple: "/logo.png",
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
        <link
          href="https://unpkg.com/cloudinary-video-player@1.10.6/dist/cld-video-player.min.css"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen bg-[#0a0a0a] text-white">
        <Providers>{children}</Providers>
        <Script
          src="https://unpkg.com/cloudinary-video-player@1.10.6/dist/cld-video-player.min.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}

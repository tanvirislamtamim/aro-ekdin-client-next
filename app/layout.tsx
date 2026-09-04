import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "./providers";

export const viewport: Viewport = {
  themeColor: "#02040a",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://aro-ekdin.vercel.app"),

  title: {
    default: "Aro Ekdin | Volleyball Team",
    template: "%s | Aro Ekdin",
  },

  description:
    "Aro Ekdin is a premier volleyball team website featuring our players, team members, photo gallery, live matches, achievements and volleyball activities in Bangladesh.",

  keywords: [
    "Aro Ekdin",
    "Aro Ekdin Volleyball",
    "Aro Ekdin Volleyball Team",
    "Volleyball Team Bangladesh",
    "Bangladesh Volleyball",
    "Volleyball Players",
    "Aro Ekdin Team",
    "Aro Ekdin Matches",
    "Alfadanga Volleyball",
    "Faridpur Volleyball",
  ],

  authors: [
    {
      name: "Aro Ekdin Team",
      url: "https://aro-ekdin.vercel.app",
    },
  ],

  creator: "Aro Ekdin",
  publisher: "Aro Ekdin",

  alternates: {
    canonical: "/",
  },

  manifest: "/manifest.json",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://aro-ekdin.vercel.app",
    siteName: "Aro Ekdin",
    title: "Aro Ekdin | Volleyball Team",
    description:
      "Official website of Aro Ekdin Volleyball Team — players, team members, gallery, matches and more.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Aro Ekdin Volleyball Team",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Aro Ekdin | Volleyball Team",
    description:
      "Official website of Aro Ekdin Volleyball Team — players, squad, matches and gallery.",
    images: ["/og-image.jpg"],
  },

  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
    shortcut: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/logo.png" />
      </head>
      <body className="bg-[#02040a] text-white antialiased selection:bg-cyan-500 selection:text-black">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
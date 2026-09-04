import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://aro-ekdin.vercel.app"),

  title: {
    default: "Aro Ekdin | Volleyball Team",
    template: "%s | Aro Ekdin",
  },

  description:
    "Aro Ekdin is a volleyball team website featuring our players, team members, gallery, matches, achievements and volleyball activities.",

  keywords: [
    "Aro Ekdin",
    "Aro Ekdin Volleyball",
    "Aro Ekdin Volleyball Team",
    "Volleyball Team Bangladesh",
    "Bangladesh Volleyball",
    "Volleyball Players",
    "Aro Ekdin Team",
  ],

  authors: [
    {
      name: "Aro Ekdin",
    },
  ],

  creator: "Aro Ekdin",

  publisher: "Aro Ekdin",

  alternates: {
    canonical: "/",
  },

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
        url: "/logo.png",
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
      "Official website of Aro Ekdin Volleyball Team.",

    images: ["/logo.png"],
  },

  icons: {
    icon: "/logo.png",
  },
};
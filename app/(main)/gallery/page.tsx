import type { Metadata } from "next";
import GalleryClient from "./GalleryClient";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Explore Aro Ekdin Volleyball Team photos, match moments, training sessions, tournaments and memorable team activities.",
  alternates: {
    canonical: "/gallery",
  },
  openGraph: {
    title: "Aro Ekdin Gallery | Volleyball Team Photos & Highlights",
    description:
      "Photos and memorable tournament moments from Aro Ekdin Volleyball Team.",
    url: "https://aro-ekdin.vercel.app/gallery",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Aro Ekdin Volleyball Gallery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aro Ekdin Gallery | Volleyball Team",
    description: "Browse photo gallery and event highlights of Aro Ekdin Volleyball.",
    images: ["/og-image.jpg"],
  },
};

export default function GalleryPage() {
  return <GalleryClient />;
}

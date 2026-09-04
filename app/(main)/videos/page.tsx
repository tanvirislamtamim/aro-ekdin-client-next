import type { Metadata } from "next";
import VideosClient from "./VideosClient";

export const metadata: Metadata = {
  title: "Videos & Highlights",
  description:
    "Watch live match streams, tournament highlights, training drills, and volleyball videos of Aro Ekdin Volleyball Team.",
  alternates: {
    canonical: "/videos",
  },
  openGraph: {
    title: "Aro Ekdin Videos | Volleyball Match Highlights & Clips",
    description:
      "Watch exciting volleyball matches and tournament highlights of Aro Ekdin.",
    url: "https://aro-ekdin.vercel.app/videos",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Aro Ekdin Volleyball Videos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aro Ekdin Videos | Volleyball Team",
    description: "Match highlights and volleyball training videos.",
    images: ["/og-image.jpg"],
  },
};

export default function VideosPage() {
  return <VideosClient />;
}

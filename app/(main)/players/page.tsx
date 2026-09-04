import type { Metadata } from "next";
import PlayersClient from "./PlayersClient";

export const metadata: Metadata = {
  title: "Players",
  description:
    "Meet the players of Aro Ekdin Volleyball Team. Explore our volleyball squad, player profiles, positions, stats, achievements and team members.",
  alternates: {
    canonical: "/players",
  },
  openGraph: {
    title: "Aro Ekdin Players | Volleyball Team Squad",
    description:
      "Meet the volleyball players and squad members of Aro Ekdin Volleyball Team.",
    url: "https://aro-ekdin.vercel.app/players",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Aro Ekdin Volleyball Players",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aro Ekdin Players | Volleyball Team",
    description: "Explore the player roster and profiles of Aro Ekdin Volleyball Team.",
    images: ["/og-image.jpg"],
  },
};

export default function PlayersPage() {
  return <PlayersClient />;
}

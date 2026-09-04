import type { Metadata } from "next";
import MatchesClient from "./MatchesClient";

export const metadata: Metadata = {
  title: "Matches & Tournament Fixtures",
  description:
    "Follow live volleyball matches, real-time sets, scores, tournament fixtures, and squad lineups of Aro Ekdin Volleyball Team.",
  alternates: {
    canonical: "/matches",
  },
  openGraph: {
    title: "Aro Ekdin Matches | Live Scores & Fixtures",
    description:
      "Real-time sets, scores, live tournament fixtures, and player squad rosters.",
    url: "https://aro-ekdin.vercel.app/matches",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Aro Ekdin Volleyball Matches",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aro Ekdin Matches | Volleyball Team",
    description: "Live scores, match schedules, and set results.",
    images: ["/og-image.jpg"],
  },
};

export default function MatchesPage() {
  return <MatchesClient />;
}

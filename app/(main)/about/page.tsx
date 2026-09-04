import type { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn more about Aro Ekdin Volleyball Team — our mission, team history, values, playing ground at Alfadanga, Faridpur, and passionate volleyball athletes.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Aro Ekdin | Volleyball Team & Family",
    description:
      "Aro Ekdin is a sports family committed to passion, teamwork, discipline, and healthy living through volleyball.",
    url: "https://aro-ekdin.vercel.app/about",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "About Aro Ekdin Volleyball Team",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Aro Ekdin | Volleyball Team",
    description:
      "Our story, team values, and athletic community in Alfadanga, Faridpur.",
    images: ["/og-image.jpg"],
  },
};

export default function AboutPage() {
  return <AboutClient />;
}

import type { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "Aro Ekdin | Volleyball Team Bangladesh",
  description:
    "Aro Ekdin is a premier volleyball team based in Bangladesh. Meet our squad players, explore our 3D volleyball court lineup, view tournament match scores, and discover our photo gallery.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Aro Ekdin | Volleyball Team Bangladesh",
    description:
      "Official website of Aro Ekdin Volleyball Team — players, 3D court lineup, gallery, matches and more.",
    url: "https://aro-ekdin.vercel.app",
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
    description: "Official website of Aro Ekdin Volleyball Team.",
    images: ["/og-image.jpg"],
  },
};

export default function HomePage() {
  return <HomeClient />;
}

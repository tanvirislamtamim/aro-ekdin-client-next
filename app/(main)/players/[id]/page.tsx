import type { Metadata } from "next";
import PlayerDetailsClient from "./PlayerDetailsClient";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://aro-ekdin-server-side-my0t.onrender.com";

  try {
    const res = await fetch(`${apiUrl}/players/${id}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return {
        title: "Player Profile | Aro Ekdin",
        description: "View player details and profile on Aro Ekdin Volleyball Team.",
      };
    }

    const player = await res.json();

    if (!player || !player.name) {
      return {
        title: "Player Not Found | Aro Ekdin",
      };
    }

    const playerTitle = `${player.name} (${player.position || "Player"}) - Jersey #${player.jersey || "0"}`;
    const playerDesc = `${player.name} is a volleyball player representing Aro Ekdin Volleyball Team. Position: ${player.position || "Player"}, Jersey: #${player.jersey || ""}, Nationality: ${player.nationality || "Bangladesh"}. Explore stats, profile, and moments.`;

    return {
      title: `${player.name} - Volleyball Player`,
      description: playerDesc,
      alternates: {
        canonical: `/players/${id}`,
      },
      openGraph: {
        title: `${player.name} | Aro Ekdin Volleyball Team`,
        description: playerDesc,
        url: `https://aro-ekdin.vercel.app/players/${id}`,
        siteName: "Aro Ekdin",
        images: player.img
          ? [
              {
                url: player.img,
                width: 800,
                height: 800,
                alt: `${player.name} - Aro Ekdin Volleyball Player`,
              },
            ]
          : [
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
        title: playerTitle,
        description: playerDesc,
        images: player.img ? [player.img] : ["/og-image.jpg"],
      },
    };
  } catch (error) {
    return {
      title: "Player Profile | Aro Ekdin",
      description: "Aro Ekdin Volleyball Player profile and statistics.",
    };
  }
}

export default function PlayerPage({ params }: Props) {
  return <PlayerDetailsClient params={params} />;
}

import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://aro-ekdin.vercel.app";
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://aro-ekdin-server-side-my0t.onrender.com";

  // Base static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/players`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/matches`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/videos`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  // Dynamic player pages
  let playerRoutes: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${apiUrl}/players`, {
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      const players = await res.json();
      if (Array.isArray(players)) {
        playerRoutes = players
          .filter((player: any) => player?._id || player?.id)
          .map((player: any) => ({
            url: `${baseUrl}/players/${player._id || player.id}`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.85,
          }));
      }
    }
  } catch (err) {
    console.warn("Failed to fetch dynamic players for sitemap:", err);
  }

  return [...staticRoutes, ...playerRoutes];
}
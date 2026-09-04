export default function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "SportsTeam",
    name: "Aro Ekdin",
    alternateName: "Aro Ekdin Volleyball Team",
    sport: "Volleyball",
    description:
      "Aro Ekdin is a premier volleyball team based in Bangladesh, featuring passionate players, competitive matches, training programs, and sports events.",
    url: "https://aro-ekdin.vercel.app",
    logo: "https://aro-ekdin.vercel.app/logo.png",
    image: "https://aro-ekdin.vercel.app/og-image.jpg",
    location: {
      "@type": "Place",
      name: "Mohisher Ghop Playing Ground",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Alfadanga",
        addressRegion: "Faridpur",
        addressCountry: "Bangladesh",
      },
    },
    memberOf: {
      "@type": "SportsOrganization",
      name: "Bangladesh Volleyball Community",
    },
    sameAs: [
      "https://facebook.com",
      "https://instagram.com",
      "https://youtube.com",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  );
}
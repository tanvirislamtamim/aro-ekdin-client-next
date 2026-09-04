export default function JsonLd() {
  const data = {
    "@context": "https://schema.org",

    "@type": "SportsTeam",

    name: "Aro Ekdin",

    description:
      "Aro Ekdin is a volleyball team featuring passionate players and athletes.",

    url: "https://aro-ekdin.vercel.app",

    sport: "Volleyball",
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
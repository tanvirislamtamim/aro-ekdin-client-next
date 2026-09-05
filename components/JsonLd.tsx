export default function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://aro-ekdin.vercel.app/#website",
        "url": "https://aro-ekdin.vercel.app/",
        "name": "Aro Ekdin",
        "alternateName": [
          "Aro Ekdin Volleyball",
          "Aro Ekdin Volleyball Team",
          "AroEkdin",
          "aro-ekdin"
        ],
        "publisher": {
          "@id": "https://aro-ekdin.vercel.app/#organization",
        },
        "inLanguage": "en-US",
      },
      {
        "@type": "SportsTeam",
        "@id": "https://aro-ekdin.vercel.app/#organization",
        "name": "Aro Ekdin",
        "alternateName": "Aro Ekdin Volleyball Team",
        "sport": "Volleyball",
        "url": "https://aro-ekdin.vercel.app/",
        "logo": "https://aro-ekdin.vercel.app/logo.png",
        "image": "https://aro-ekdin.vercel.app/og-image.jpg",
        "description":
          "Aro Ekdin is a premier volleyball team based in Bangladesh, featuring passionate players, competitive matches, training programs, and sports events.",
        "location": {
          "@type": "Place",
          "name": "Mohisher Ghop Playing Ground",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Alfadanga",
            "addressRegion": "Faridpur",
            "addressCountry": "Bangladesh",
          },
        },
        "memberOf": {
          "@type": "SportsOrganization",
          "name": "Bangladesh Volleyball Community",
        },
        "sameAs": [
          "https://facebook.com",
          "https://instagram.com",
          "https://youtube.com",
        ],
      },
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
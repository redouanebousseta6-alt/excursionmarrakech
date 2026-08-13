/**
 * Server-side SEO helpers (schema + page meta for crawlers)
 */
const SITE = process.env.SITE_URL || "https://excursionmarrakech.net";
const TERMS_URL = `${SITE.replace(/\/$/, "")}/terms-conditions`;
const PHONE = "+212 639 996 960";
const OG_IMAGE = `${SITE.replace(/\/$/, "")}/images/brand/og-default.jpg`;

function isoDate(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

function priceValidUntil() {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  return isoDate(d);
}

function merchantReturnPolicy() {
  return {
    "@type": "MerchantReturnPolicy",
    "@id": `${TERMS_URL}#return-policy`,
    applicableCountry: ["MA", "FR", "DE", "ES", "GB", "US"],
    returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
    merchantReturnDays: 2,
    returnMethod: "https://schema.org/ReturnInStore",
    returnFees: "https://schema.org/FreeReturn",
    url: TERMS_URL,
    description:
      "Free cancellation up to 48 hours before the activity start time. Within 48 hours, fees may apply as confirmed at booking. Weather or safety changes are rescheduled when possible.",
  };
}

function shippingDetails() {
  return {
    "@type": "OfferShippingDetails",
    shippingRate: { "@type": "MonetaryAmount", value: 0, currency: "MAD" },
    shippingDestination: { "@type": "DefinedRegion", addressCountry: "MA" },
    deliveryTime: {
      "@type": "ShippingDeliveryTime",
      handlingTime: {
        "@type": "QuantitativeValue",
        minValue: 0,
        maxValue: 1,
        unitCode: "DAY",
      },
      transitTime: {
        "@type": "QuantitativeValue",
        minValue: 0,
        maxValue: 0,
        unitCode: "DAY",
      },
    },
  };
}

function enrichOffer(offer, opts = {}) {
  const name = offer.name || opts.name || "Excursion";
  return {
    ...offer,
    "@type": "Offer",
    name,
    description:
      offer.description ||
      opts.description ||
      `${name} with excursionmarrakech — local hosts, transparent pricing, WhatsApp ${PHONE}`,
    priceCurrency: offer.priceCurrency || "MAD",
    availability: offer.availability || "https://schema.org/InStock",
    url: offer.url || opts.url || SITE,
    validFrom: offer.validFrom || isoDate(),
    priceValidUntil: offer.priceValidUntil || priceValidUntil(),
    hasMerchantReturnPolicy: merchantReturnPolicy(),
    shippingDetails: shippingDetails(),
    seller: {
      "@type": "TravelAgency",
      name: "excursionmarrakech",
      url: SITE,
      telephone: PHONE,
    },
  };
}

/** Strong EN/FR titles for crawlers (?lang=fr) */
const PAGE_SEO = {
  home: {
    en: {
      title: "Marrakech Excursions & Desert Tours | excursionmarrakech",
      description:
        "Book Marrakech excursions: Agafay desert, Ourika, Ouzoud, Merzouga & airport transfers. Clear Private/Group prices. WhatsApp +212 639 996 960.",
    },
    fr: {
      title: "Excursions Marrakech : désert, Atlas & Sahara | excursionmarrakech",
      description:
        "Réservez vos excursions à Marrakech : désert Agafay, Ourika, Ouzoud, Merzouga et transfert aéroport. Tarifs Privé/Groupe clairs. WhatsApp +212 639 996 960.",
    },
  },
  trips: {
    en: {
      title: "All Marrakech Trips & Excursions | excursionmarrakech",
      description:
        "Browse Marrakech desert adventures, Atlas day trips, city tours, wellness and Sahara overnights. Transparent MAD pricing. Call +212 639 996 960.",
    },
    fr: {
      title: "Toutes les excursions à Marrakech | catalogue | excursionmarrakech",
      description:
        "Catalogue d’excursions Marrakech : Agafay, Ourika, Ouzoud, médina, hammam, Merzouga. Tarifs MAD transparents. Tél. +212 639 996 960.",
    },
  },
  about: {
    en: {
      title: "About Us | Local Marrakech Excursion Hosts | excursionmarrakech",
      description:
        "Local Marrakech hosts for premium desert tours, Atlas day trips and airport transfers. Clear pricing and WhatsApp support +212 639 996 960.",
    },
    fr: {
      title: "À propos | Hôtes locaux d’excursions à Marrakech | excursionmarrakech",
      description:
        "Équipe locale à Marrakech pour excursions désert, Atlas et transferts aéroport. Tarifs clairs et support WhatsApp +212 639 996 960.",
    },
  },
  transfer: {
    en: {
      title: "Marrakech Airport Private Transfer Price List | excursionmarrakech",
      description:
        "Fixed-price private transfers from Marrakech Menara Airport to the city, coast and long-distance destinations. VIP Mercedes. WhatsApp +212 639 996 960.",
    },
    fr: {
      title: "Transfert aéroport Marrakech — tarifs privés | excursionmarrakech",
      description:
        "Transferts privés à prix fixe depuis l’aéroport Menara vers médina, côte et longues distances. Mercedes VIP. WhatsApp +212 639 996 960.",
    },
  },
};

const LANGS = ["en", "fr", "de", "es", "ar"];

function buildTripSchema(trip, { site = SITE, lowPrice } = {}) {
  const url = `${site.replace(/\/$/, "")}/${encodeURIComponent(trip.id)}`;
  const description = trip.shortDescription || trip.description || trip.title;
  const offer = enrichOffer(
    {
      price: lowPrice,
      priceCurrency: "MAD",
      name: trip.title,
    },
    { url, description, name: trip.title }
  );
  return {
    "@context": "https://schema.org",
    "@type": ["Product", "TouristTrip"],
    name: trip.title,
    description,
    image: trip.image ? [trip.image.startsWith("http") ? trip.image : `${site.replace(/\/$/, "")}${trip.image}`] : [OG_IMAGE],
    brand: { "@type": "Brand", name: "excursionmarrakech" },
    sku: trip.id,
    aggregateRating:
      trip.rating != null
        ? {
            "@type": "AggregateRating",
            ratingValue: trip.rating,
            reviewCount: trip.reviewCount || 1,
            bestRating: 5,
            worstRating: 1,
          }
        : undefined,
    offers: offer,
  };
}

function withCrawlerSeo(html, { path = "/", lang = "en" } = {}) {
  const site = SITE.replace(/\/$/, "");
  const pageKey =
    path === "/" || path === ""
      ? "home"
      : path.includes("airport-transfer")
        ? "transfer"
        : path.includes("trips")
          ? "trips"
          : path.includes("about")
            ? "about"
            : null;

  let out = html;

  // Ensure bright default OG image where a generic hero is used
  out = out.replace(
    /content="https:\/\/excursionmarrakech\.net\/images\/home\/hero-1280\.jpg"/g,
    `content="${OG_IMAGE}"`
  );
  out = out.replace(
    /content="https:\/\/excursionmarrakech\.net\/images\/brand\/logo-512\.png"/g,
    `content="${OG_IMAGE}"`
  );

  if (pageKey && PAGE_SEO[pageKey]) {
    const pack = PAGE_SEO[pageKey][lang] || PAGE_SEO[pageKey].en;
    const fr = PAGE_SEO[pageKey].fr;
    if (pack) {
      out = out.replace(/<title>[^<]*<\/title>/i, `<title>${pack.title}</title>`);
      out = out.replace(
        /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
        `<meta name="description" content="${pack.description.replace(/"/g, "&quot;")}" />`
      );
      // og:title / og:description if present
      out = out.replace(
        /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
        `<meta property="og:title" content="${pack.title.replace(/"/g, "&quot;")}" />`
      );
      out = out.replace(
        /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
        `<meta property="og:description" content="${pack.description.replace(/"/g, "&quot;")}" />`
      );
    }
    // Static FR alternate hint for crawlers
    if (fr && !/hreflang="fr"/i.test(out)) {
      const links = LANGS.map((l) => {
        const href =
          l === "en" ? `${site}${path === "/" ? "/" : path}` : `${site}${path === "/" ? "/" : path}?lang=${l}`;
        return `<link rel="alternate" hreflang="${l}" href="${href}" />`;
      }).join("\n    ");
      out = out.replace(
        /<\/head>/i,
        `    ${links}\n    <link rel="alternate" hreflang="x-default" href="${site}${path === "/" ? "/" : path}" />\n    <meta property="og:locale:alternate" content="fr_FR" />\n  </head>`
      );
    }
  }

  if (!/property="og:image"/i.test(out)) {
    out = out.replace(
      /<\/head>/i,
      `    <meta property="og:image" content="${OG_IMAGE}" />\n    <meta name="twitter:card" content="summary_large_image" />\n  </head>`
    );
  }

  return out;
}

module.exports = {
  enrichOffer,
  buildTripSchema,
  withCrawlerSeo,
  merchantReturnPolicy,
  shippingDetails,
  PAGE_SEO,
  OG_IMAGE,
  SITE,
};

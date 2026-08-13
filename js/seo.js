/**
 * Shared SEO helpers — offers, merchant policy, FAQ JSON-LD, document meta
 */
(function () {
  "use strict";
  window.EM = window.EM || {};

  var SITE = "https://excursionmarrakech.net";
  var TERMS_URL = SITE + "/terms-conditions";
  var PHONE = "+212 639 996 960";

  EM.SEO = EM.SEO || {};

  EM.SEO.siteUrl = function () {
    return (EM.config && EM.config.siteUrl) || (EM.SITE && EM.SITE.url) || SITE;
  };

  EM.SEO.defaultImage = function () {
    return EM.SEO.siteUrl().replace(/\/$/, "") + "/images/brand/og-default.jpg";
  };

  EM.SEO.isoDate = function (d) {
    d = d || new Date();
    return d.toISOString().slice(0, 10);
  };

  EM.SEO.priceValidUntil = function () {
    var d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    return EM.SEO.isoDate(d);
  };

  /** Cancellation / return policy for Google Merchant Offer requirements */
  EM.SEO.merchantReturnPolicy = function () {
    return {
      "@type": "MerchantReturnPolicy",
      "@id": TERMS_URL + "#return-policy",
      applicableCountry: ["MA", "FR", "DE", "ES", "GB", "US"],
      returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
      merchantReturnDays: 2,
      returnMethod: "https://schema.org/ReturnInStore",
      returnFees: "https://schema.org/FreeReturn",
      url: TERMS_URL,
      description:
        "Free cancellation up to 48 hours before the activity start time. Within 48 hours, fees may apply as confirmed at booking. Weather or safety changes are rescheduled when possible.",
    };
  };

  /** Local in-person service — no physical shipping */
  EM.SEO.shippingDetails = function () {
    return {
      "@type": "OfferShippingDetails",
      shippingRate: {
        "@type": "MonetaryAmount",
        value: 0,
        currency: "MAD",
      },
      shippingDestination: {
        "@type": "DefinedRegion",
        addressCountry: "MA",
      },
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
  };

  EM.SEO.enrichOffer = function (offer, opts) {
    opts = opts || {};
    var name = offer.name || opts.name || "Excursion";
    var description =
      offer.description ||
      opts.description ||
      name + " with excursionmarrakech — local hosts, transparent pricing, WhatsApp " + PHONE;
    var out = Object.assign({}, offer, {
      "@type": "Offer",
      name: name,
      description: description,
      priceCurrency: offer.priceCurrency || "MAD",
      availability: offer.availability || "https://schema.org/InStock",
      url: offer.url || opts.url || EM.SEO.siteUrl(),
      validFrom: offer.validFrom || EM.SEO.isoDate(),
      priceValidUntil: offer.priceValidUntil || EM.SEO.priceValidUntil(),
      hasMerchantReturnPolicy: EM.SEO.merchantReturnPolicy(),
      shippingDetails: EM.SEO.shippingDetails(),
      seller: {
        "@type": "TravelAgency",
        name: "excursionmarrakech",
        url: EM.SEO.siteUrl(),
        telephone: PHONE,
      },
    });
    return out;
  };

  EM.SEO.enrichOffers = function (offers, opts) {
    return (offers || []).map(function (o) {
      return EM.SEO.enrichOffer(o, opts);
    });
  };

  EM.SEO.injectJsonLd = function (id, data) {
    var existing = id ? document.getElementById(id) : null;
    if (existing) {
      existing.textContent = JSON.stringify(data);
      return existing;
    }
    var script = document.createElement("script");
    script.type = "application/ld+json";
    if (id) script.id = id;
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
    return script;
  };

  EM.SEO.injectFaqPage = function (faqs, id) {
    if (!faqs || !faqs.length) return;
    EM.SEO.injectJsonLd(id || "faq-schema", {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map(function (f) {
        return {
          "@type": "Question",
          name: f.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: String(f.a || "").replace(/<[^>]+>/g, ""),
          },
        };
      }),
    });
  };

  EM.SEO.setMeta = function (attr, key, value) {
    if (!value) return;
    var sel =
      attr === "property"
        ? 'meta[property="' + key + '"]'
        : 'meta[name="' + key + '"]';
    var el = document.querySelector(sel);
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.setAttribute("content", value);
  };

  /** Update title / description / OG for current language (SEO + social) */
  EM.SEO.applyPageMeta = function (pageKey, extras) {
    extras = extras || {};
    var titleKey = "seo." + pageKey + ".title";
    var descKey = "seo." + pageKey + ".description";
    var title = extras.title || (EM.t ? EM.t(titleKey) : null);
    var desc = extras.description || (EM.t ? EM.t(descKey) : null);
    if (title && title !== titleKey) {
      document.title = title;
      EM.SEO.setMeta("property", "og:title", title);
      EM.SEO.setMeta("name", "twitter:title", title);
    }
    if (desc && desc !== descKey) {
      EM.SEO.setMeta("name", "description", desc);
      EM.SEO.setMeta("property", "og:description", desc);
      EM.SEO.setMeta("name", "twitter:description", desc);
    }
    var image = extras.image || EM.SEO.defaultImage();
    EM.SEO.setMeta("property", "og:image", image);
    EM.SEO.setMeta("name", "twitter:image", image);
    EM.SEO.setMeta("property", "og:image:alt", extras.imageAlt || "Marrakech excursions and desert tours");
    var lang = EM.getLang ? EM.getLang() : "en";
    EM.SEO.setMeta("property", "og:locale", lang === "fr" ? "fr_FR" : lang === "de" ? "de_DE" : lang === "es" ? "es_ES" : lang === "ar" ? "ar_MA" : "en_US");
  };

  EM.SEO.PAGE_KEYS = {
    "/": "home",
    "/trips": "trips",
    "/about": "about",
    "/airport-transfer": "transfer",
  };
})();

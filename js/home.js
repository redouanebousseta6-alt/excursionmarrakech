/**
 * Home page — API-backed featured trips + guest reviews
 */
document.addEventListener("DOMContentLoaded", async function () {
  EM.setActiveNav("home");
  EM.ensureHelpers();
  await EM.loadConfig();
  try {
    if (EM.initI18n) EM.initI18n();
  } catch (e) {
    console.warn("i18n init failed", e);
  }
  EM.initTracking(EM.config);
  await EM.loadTrips();

  var featured = document.getElementById("featured-grid");
  if (featured) {
    EM.renderTripGrid(featured, EM.getFeatured(6), { includeTransfer: true });
  }

  var catGrid = document.getElementById("category-grid");
  EM.refreshCategoryGrid = function () {
    if (!catGrid) return;
    var cats = (EM.CATEGORIES || []).filter(function (c) {
      return c.id !== "multi-day";
    });
    var defaults = {
      desert: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=800&q=80",
      "day-trips": "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800&q=80",
      city: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=800&q=80",
      wellness: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80",
    };
    catGrid.innerHTML = cats
      .map(function (c) {
        var img = c.image || defaults[c.id] || defaults.desert;
        var name = EM.categoryLabel ? EM.categoryLabel(c.id) : c.name;
        var desc = EM.t ? EM.t("cat." + c.id + ".desc") : c.description || "";
        if (desc.indexOf("cat.") === 0) desc = c.description || "";
        return (
          '<a class="cat-card" href="' +
          EM.tripsUrl(c.id) +
          '">' +
          '<img src="' +
          EM.escapeHtml(img) +
          '" alt="" loading="lazy" width="600" height="400">' +
          '<div class="cat-card__overlay" aria-hidden="true"></div>' +
          '<div class="cat-card__body"><h3>' +
          EM.escapeHtml(name) +
          "</h3><p>" +
          EM.escapeHtml(desc) +
          "</p></div></a>"
        );
      })
      .join("");
  };
  EM.refreshCategoryGrid();

  var agg = EM.siteAggregateRating();
  var summary = document.getElementById("reviews-summary");
  if (summary) {
    summary.textContent =
      "Average " +
      agg.ratingValue +
      " / 5 from " +
      agg.reviewCount +
      " guest ratings across our Marrakech excursions.";
  }

  document.querySelectorAll(".trust-stat").forEach(function (el) {
    var label = el.querySelector("span");
    var strong = el.querySelector("strong");
    if (!label || !strong) return;
    var key = label.getAttribute("data-i18n") || "";
    if (key === "home.statRating" || /guest rating|note des|bewertung|valoraci|تقييم/i.test(label.textContent || "")) {
      strong.textContent = String(agg.ratingValue);
    }
  });

  var reviewsGrid = document.getElementById("reviews-grid");
  if (reviewsGrid && EM.REVIEWS) {
    reviewsGrid.innerHTML = EM.REVIEWS.map(function (review) {
      var trip = EM.getTrip(review.tripId);
      var tripTitle = trip ? trip.title : "Marrakech excursion";
      var tripHref = trip ? EM.tripUrl(trip.id) : "/trips";
      return (
        '<blockquote class="review-card">' +
        '<div class="review-card__top">' +
        EM.starsHtml(review.rating, { showValue: false }) +
        '<cite class="review-card__author">' +
        "<strong>" +
        EM.escapeHtml(review.name) +
        "</strong>" +
        "<span>" +
        EM.escapeHtml(review.location) +
        "</span>" +
        "</cite>" +
        "</div>" +
        "<p>" +
        EM.escapeHtml(review.text) +
        "</p>" +
        '<a class="review-card__trip" href="' +
        tripHref +
        '">' +
        EM.escapeHtml(tripTitle) +
        "</a>" +
        "</blockquote>"
      );
    }).join("");
  }

  // TravelAgency entity only — Google does not allow review snippets on
  // TravelAgency/Service (critical "Invalid object type"). Stars stay on Product pages.
  var schema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: (EM.SITE && EM.SITE.name) || "excursionmarrakech",
    description:
      (EM.SITE && EM.SITE.tagline) ||
      "Premium Marrakech excursions and desert tours",
    url: (EM.SITE && EM.SITE.url) || "https://excursionmarrakech.net",
    logo: (EM.SITE && EM.SITE.logo) || undefined,
    image:
      (EM.SITE && EM.SITE.image) ||
      (EM.SEO && EM.SEO.defaultImage && EM.SEO.defaultImage()) ||
      undefined,
    telephone: (EM.SITE && EM.SITE.phone) || undefined,
    email: (EM.SITE && EM.SITE.email) || undefined,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Marrakech",
      addressCountry: "MA",
    },
    hasMerchantReturnPolicy:
      EM.SEO && EM.SEO.merchantReturnPolicy ? EM.SEO.merchantReturnPolicy() : undefined,
  };
  if (EM.SEO && EM.SEO.injectJsonLd) EM.SEO.injectJsonLd("home-org-schema", schema);
  else {
    var script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  // Sitelinks search box for Google
  var siteUrl = ((EM.config && EM.config.siteUrl) || "https://excursionmarrakech.net").replace(
    /\/$/,
    ""
  );
  if (EM.SEO && EM.SEO.injectJsonLd) {
    EM.SEO.injectJsonLd("website-search-schema", {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "excursionmarrakech",
      url: siteUrl + "/",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: siteUrl + "/search?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    });
  }

  if (EM.SEO && EM.SEO.applyPageMeta) EM.SEO.applyPageMeta("home");
});

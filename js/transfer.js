/**
 * Airport transfer page — guest reviews
 */
(function () {
  "use strict";
  window.EM = window.EM || {};

  EM.renderTransferReviews = function () {
    var grid = document.getElementById("transfer-reviews-grid");
    if (!grid || !EM.TRANSFER_REVIEWS) return;

    var summary = document.getElementById("transfer-reviews-summary");
    var rating = EM.getTransferRating ? EM.getTransferRating() : null;
    if (summary && rating && rating.reviewCount) {
      summary.hidden = false;
      summary.innerHTML =
        EM.starsHtml(rating.rating, { className: "stars--sm" }) +
        " <strong>" +
        rating.rating.toFixed(1).replace(/\.0$/, "") +
        "</strong> · " +
        rating.reviewCount +
        " " +
        (EM.t ? EM.t("trip.reviews") : "reviews");
    }

    grid.innerHTML = EM.TRANSFER_REVIEWS.map(function (review, index) {
      var n = index + 1;
      var textKey = "transfer.review" + n + ".text";
      var routeKey = "transfer.review" + n + ".route";
      var text = EM.t ? EM.t(textKey) : review.text;
      var route = EM.t ? EM.t(routeKey) : review.route;
      if (!text || text === textKey) text = review.text;
      if (!route || route === routeKey) {
        route = review.route || (EM.t ? EM.t("transfer.reviewsRoute") : "Airport transfer");
      }

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
        EM.escapeHtml(text) +
        "</p>" +
        '<span class="review-card__trip">' +
        EM.escapeHtml(route) +
        "</span>" +
        "</blockquote>"
      );
    }).join("");
  };

  EM.injectTransferSchema = function () {
    var el = document.getElementById("transfer-schema");
    if (!el) return;
    var rating = EM.getTransferRating ? EM.getTransferRating() : null;
    var data;
    try {
      data = JSON.parse(el.textContent);
    } catch (e) {
      return;
    }
    // Product (not Service) — Google only allows review snippets on Product etc.
    data["@type"] = "Product";
    data.name = data.name || "Marrakech Airport Private Transfer";
    data.sku = data.sku || "airport-transfer";
    data.brand = data.brand || { "@type": "Brand", name: "excursionmarrakech" };
    data.description =
      data.description ||
      "Fixed-price private transfers from Marrakech Menara Airport with meet & greet, flight monitoring and VIP Mercedes options. WhatsApp +212 639 996 960.";
    data.image =
      data.image ||
      ((EM.SEO && EM.SEO.defaultImage && EM.SEO.defaultImage()) ||
        "https://excursionmarrakech.net/images/transfers/airport-transfer-hero.jpg");
    delete data.serviceType;
    delete data.provider;
    delete data.areaServed;
    if (rating && rating.reviewCount > 0) {
      data.aggregateRating = {
        "@type": "AggregateRating",
        ratingValue: Number(rating.rating),
        reviewCount: Number(rating.reviewCount),
        bestRating: 5,
        worstRating: 1,
      };
      // Nested under Product — omit itemReviewed (parent is the reviewed item)
      data.review = (EM.TRANSFER_REVIEWS || []).map(function (r) {
        return {
          "@type": "Review",
          author: { "@type": "Person", name: r.name },
          reviewRating: {
            "@type": "Rating",
            ratingValue: Number(r.rating),
            bestRating: 5,
            worstRating: 1,
          },
          reviewBody: r.text,
        };
      });
    } else {
      delete data.aggregateRating;
      delete data.review;
    }

    if (data.offers && EM.SEO && EM.SEO.enrichOffer) {
      var offerUrl = "https://excursionmarrakech.net/airport-transfer";
      if (data.offers["@type"] === "AggregateOffer" && Array.isArray(data.offers.offers)) {
        data.offers.offers = data.offers.offers.map(function (o) {
          return EM.SEO.enrichOffer(o, {
            url: offerUrl,
            description: data.description,
            name: o.name || data.name,
          });
        });
        data.offers.description = data.description;
      } else {
        data.offers = EM.SEO.enrichOffer(data.offers, {
          url: offerUrl,
          description: data.description,
          name: data.name,
        });
      }
    }

    el.textContent = JSON.stringify(data);

    var faqs = [1, 2, 3, 4].map(function (n) {
      return {
        q: EM.t ? EM.t("transfer.faq" + n + "q") : "",
        a: EM.t ? EM.t("transfer.faq" + n + "a") : "",
      };
    }).filter(function (f) {
      return f.q && f.a;
    });
    faqs.push({
      q: EM.t ? EM.t("trip.faq3q") : "What is the cancellation policy?",
      a: EM.t ? EM.t("trip.faq3a") : "Free cancellation up to 48 hours before pickup.",
    });
    if (EM.SEO && EM.SEO.injectFaqPage) EM.SEO.injectFaqPage(faqs, "transfer-faq-schema");
    if (EM.SEO && EM.SEO.applyPageMeta) EM.SEO.applyPageMeta("transfer");
  };
})();

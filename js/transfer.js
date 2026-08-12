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
    if (rating && rating.reviewCount > 0) {
      data.aggregateRating = {
        "@type": "AggregateRating",
        ratingValue: rating.rating,
        reviewCount: rating.reviewCount,
        bestRating: 5,
        worstRating: 1,
      };
    }
    data.review = (EM.TRANSFER_REVIEWS || []).map(function (r) {
      return {
        "@type": "Review",
        author: { "@type": "Person", name: r.name },
        reviewRating: {
          "@type": "Rating",
          ratingValue: r.rating,
          bestRating: 5,
          worstRating: 1,
        },
        reviewBody: r.text,
        itemReviewed: {
          "@type": "Service",
          name: "Marrakech Airport Private Transfer",
        },
      };
    });
    el.textContent = JSON.stringify(data);
  };
})();

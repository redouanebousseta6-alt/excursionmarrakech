/**
 * excursionmarrakech — shared UI helpers
 */
(function () {
  "use strict";

  window.EM = window.EM || {};

  EM.escapeHtml = function (str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  };

  EM.tripUrl = function (id) {
    return "/" + encodeURIComponent(id);
  };

  EM.tripsUrl = function (category) {
    return category ? "/trips?category=" + encodeURIComponent(category) : "/trips";
  };

  EM.tripIdFromLocation = function () {
    var params = new URLSearchParams(window.location.search);
    var fromQuery = params.get("id");
    if (fromQuery) return fromQuery;
    var parts = window.location.pathname.replace(/\/+$/, "").split("/").filter(Boolean);
    if (!parts.length) return null;
    if (parts[0] === "trip" && parts[1]) return decodeURIComponent(parts[1]);
    if (parts.length === 1) return decodeURIComponent(parts[0]);
    return null;
  };

  EM.tripCardHtml = function (trip) {
    trip = EM.localizedTrip ? EM.localizedTrip(trip) : trip;
    var cat = EM.categoryLabel
      ? EM.categoryLabel(trip.category)
      : EM.categoryName(trip.category);
    var href = EM.tripUrl(trip.id);
    var fallback =
      "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1200&q=80";
    var rating = EM.ensureRating(trip);
    var viewDetails = EM.t ? EM.t("card.viewDetails") : "View details →";
    return (
      '<article class="trip-card">' +
      '<a class="trip-card__media" href="' +
      href +
      '" aria-label="' +
      EM.escapeHtml(trip.title) +
      '">' +
      '<img src="' +
      EM.escapeHtml(trip.image || fallback) +
      '" alt="' +
      EM.escapeHtml(trip.title) +
      '" loading="lazy" width="600" height="450" onerror="this.onerror=null;this.src=\'' +
      fallback +
      '\'">' +
      '<span class="trip-card__badge">' +
      EM.escapeHtml(cat) +
      "</span>" +
      "</a>" +
      '<div class="trip-card__body">' +
      '<div class="trip-card__meta">' +
      "<span>" +
      EM.escapeHtml(trip.durationLabel || trip.duration || "") +
      "</span>" +
      '<span class="trip-card__rating">' +
      EM.starsHtml(rating.rating, { className: "stars--sm" }) +
      '<span class="trip-card__reviews">(' +
      rating.reviewCount +
      ")</span>" +
      "</span>" +
      "</div>" +
      "<h3>" +
      '<a href="' +
      href +
      '">' +
      EM.escapeHtml(trip.title) +
      "</a>" +
      "</h3>" +
      "<p>" +
      EM.escapeHtml(trip.shortDescription) +
      "</p>" +
      '<div class="trip-card__footer">' +
      '<span class="trip-card__price">' +
      EM.escapeHtml(EM.priceLabel(trip)) +
      "</span>" +
      '<a class="trip-card__link" href="' +
      href +
      '">' +
      EM.escapeHtml(viewDetails) +
      "</a>" +
      "</div>" +
      "</div>" +
      "</article>"
    );
  };

  EM.airportTransferCardHtml = function () {
    var href = "/airport-transfer";
    var img = "/images/transfers/airport-transfer-welcome.jpg";
    var t = EM.t || function (k) {
      return k;
    };
    return (
      '<article class="trip-card trip-card--transfer">' +
      '<a class="trip-card__media" href="' +
      href +
      '" aria-label="' +
      EM.escapeHtml(t("transfer.cardTitle")) +
      '">' +
      '<img src="' +
      img +
      '" alt="' +
      EM.escapeHtml(t("transfer.cardTitle")) +
      '" loading="lazy" width="600" height="450">' +
      '<span class="trip-card__badge">' +
      EM.escapeHtml(t("nav.transfers")) +
      "</span>" +
      "</a>" +
      '<div class="trip-card__body">' +
      '<div class="trip-card__meta"><span>' +
      EM.escapeHtml(t("transfer.cardMeta")) +
      "</span></div>" +
      "<h3><a href=\"" +
      href +
      '">' +
      EM.escapeHtml(t("transfer.cardTitle")) +
      "</a></h3>" +
      "<p>" +
      EM.escapeHtml(t("transfer.cardText")) +
      "</p>" +
      '<div class="trip-card__footer">' +
      '<span class="trip-card__price">' +
      EM.escapeHtml(t("transfer.cardPrice")) +
      "</span>" +
      '<a class="trip-card__link" href="' +
      href +
      '">' +
      EM.escapeHtml(t("transfer.cardLink")) +
      "</a>" +
      "</div>" +
      "</div>" +
      "</article>"
    );
  };

  EM.renderTripGrid = function (container, trips, options) {
    if (!container) return;
    options = options || {};
    var html = "";
    if (options.includeTransfer) html += EM.airportTransferCardHtml();
    if (!trips.length && !options.includeTransfer) {
      container.innerHTML =
        '<div class="empty-state"><p>No trips match this filter. Try another category.</p></div>';
      return;
    }
    if (options.transferOnly) {
      container.innerHTML = EM.airportTransferCardHtml();
      return;
    }
    html += trips.map(EM.tripCardHtml).join("");
    container.innerHTML = html;
  };

  EM.syncRelatedTripsNav = function () {
    var rail = document.getElementById("related-trips-rail");
    var prev = document.getElementById("related-trips-prev");
    var next = document.getElementById("related-trips-next");
    if (!rail || !prev || !next) return;

    function update() {
      var max = Math.max(0, rail.scrollWidth - rail.clientWidth - 4);
      var atStart = rail.scrollLeft <= 4;
      var atEnd = rail.scrollLeft >= max;
      var canScroll = max > 8;
      prev.hidden = !canScroll || atStart;
      next.hidden = !canScroll || atEnd;
    }

    if (!rail.dataset.navBound) {
      rail.dataset.navBound = "1";
      prev.addEventListener("click", function () {
        rail.scrollBy({ left: -Math.max(260, rail.clientWidth * 0.85), behavior: "smooth" });
      });
      next.addEventListener("click", function () {
        rail.scrollBy({ left: Math.max(260, rail.clientWidth * 0.85), behavior: "smooth" });
      });
      rail.addEventListener("scroll", update, { passive: true });
      window.addEventListener("resize", update);
    }
    requestAnimationFrame(update);
  };

  EM.initNav = function () {
    var toggle = document.querySelector("[data-nav-toggle]");
    var nav = document.querySelector("[data-nav]");
    if (!toggle || !nav) {
      EM.mountCurrencySwitcher();
      return;
    }

    function setNavOpen(open) {
      nav.classList.toggle("nav--open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.classList.toggle("nav-is-open", open);
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }

    function closeNav() {
      if (!nav.classList.contains("nav--open")) return;
      setNavOpen(false);
    }

    toggle.addEventListener("click", function (e) {
      e.stopPropagation();
      setNavOpen(!nav.classList.contains("nav--open"));
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeNav);
    });

    document.addEventListener("click", function (e) {
      if (!nav.classList.contains("nav--open")) return;
      if (nav.contains(e.target) || toggle.contains(e.target)) return;
      closeNav();
    });

    window.addEventListener(
      "scroll",
      function () {
        closeNav();
      },
      { passive: true }
    );

    window.addEventListener("resize", function () {
      if (window.matchMedia("(min-width: 768px)").matches) closeNav();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });

    EM.closeMobileNav = closeNav;
    EM.mountCurrencySwitcher();
  };

  EM.mountCurrencySwitcher = function () {
    var nav = document.querySelector("[data-nav]");
    if (!nav || nav.querySelector("[data-currency]")) return;
    if (!EM.money) {
      EM.money = EM.createCurrency ? EM.createCurrency() : null;
    }
    if (!EM.money) return;

    var wrap = document.createElement("label");
    wrap.className = "currency-switch";
    wrap.innerHTML =
      '<span class="sr-only">Currency</span>' +
      '<select data-currency aria-label="Currency">' +
      EM.money
        .codes()
        .map(function (c) {
          return (
            '<option value="' +
            c +
            '"' +
            (c === EM.money.code ? " selected" : "") +
            ">" +
            c +
            "</option>"
          );
        })
        .join("") +
      "</select>";
    nav.appendChild(wrap);

    wrap.querySelector("[data-currency]").addEventListener("change", function (e) {
      EM.money.setCode(e.target.value);
      // Re-render trip grids if present
      var featured = document.getElementById("featured-grid");
      if (featured && EM.TRIPS) EM.renderTripGrid(featured, EM.getFeatured(6), { includeTransfer: true });
      var tripsGrid = document.getElementById("trips-grid");
      if (tripsGrid && EM.TRIPS) {
        var params = new URLSearchParams(window.location.search);
        var active = params.get("category") || "all";
        if (active === "transfers") {
          EM.renderTripGrid(tripsGrid, [], { transferOnly: true });
        } else {
          EM.renderTripGrid(tripsGrid, EM.getByCategory(active === "all" ? null : active), {
            includeTransfer: active === "all",
          });
        }
      }
      var relatedRail = document.getElementById("related-trips-rail");
      var relatedSection = document.getElementById("related-trips");
      if (relatedRail && relatedSection && relatedSection.dataset.tripId && EM.getRelatedTrips) {
        var current = EM.getTrip
          ? EM.getTrip(relatedSection.dataset.tripId)
          : (EM.TRIPS || []).find(function (t) {
              return t.id === relatedSection.dataset.tripId;
            });
        if (current) {
          EM.renderTripGrid(relatedRail, EM.getRelatedTrips(current, 4));
          if (typeof EM.syncRelatedTripsNav === "function") EM.syncRelatedTripsNav();
        }
      }
    });
  };

  EM.setActiveNav = function (page) {
    document.querySelectorAll("[data-nav] a[data-page]").forEach(function (a) {
      if (a.getAttribute("data-page") === page) {
        a.setAttribute("aria-current", "page");
      }
    });
  };

  /** Resolve unit price based on trip pricing model + selection */
  EM.resolveUnitPrice = function (trip, selection) {
    var p = trip.pricing;
    selection = selection || {};

    if (p.type === "flat") {
      return { amount: p.price, unit: p.unit || "per person", note: p.note || "" };
    }

    if (p.type === "private-group") {
      var mode = selection.mode || (p.groupPrice != null ? "group" : "private");
      if (mode === "private" && p.privatePrice != null) {
        return {
          amount: p.privatePrice,
          unit: p.unit || "per person",
          note: p.minPrivate ? "Minimum " + p.minPrivate + " persons" : p.note || "",
        };
      }
      if (mode === "group" && p.groupPrice != null) {
        return {
          amount: p.groupPrice,
          unit: p.unit || "per person",
          note: p.note || "",
        };
      }
      var fallback = p.groupPrice != null ? p.groupPrice : p.privatePrice;
      return { amount: fallback, unit: p.unit || "per person", note: p.note || "" };
    }

    if (p.type === "options") {
      var optId = selection.optionId || (p.options[0] && p.options[0].id);
      var opt = p.options.find(function (o) {
        return o.id === optId;
      }) || p.options[0];
      return { amount: opt.price, unit: opt.unit || "per person", note: opt.label };
    }

    if (p.type === "driver-passenger") {
      var role = selection.role || "driver";
      if (role === "passenger") {
        return { amount: p.passengerPrice, unit: "per passenger", note: "" };
      }
      return { amount: p.driverPrice, unit: "per driver", note: "" };
    }

    return { amount: null, unit: "", note: "" };
  };

  document.addEventListener("DOMContentLoaded", function () {
    EM.initNav();
  });
})();

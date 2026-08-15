/**
 * Single listing — API data, pricing, inquiry + Stripe/PayPal checkout
 */
document.addEventListener("DOMContentLoaded", async function () {
  EM.setActiveNav("trips");
  EM.ensureHelpers();
  await EM.loadConfig();
  try {
    if (EM.initI18n) EM.initI18n();
  } catch (e) {
    console.warn("i18n init failed", e);
  }
  EM.initTracking(EM.config);

  var id = EM.tripIdFromLocation();
  var trip = id ? await EM.loadTrip(id) : null;

  var root = document.getElementById("trip-root");
  var notFound = document.getElementById("trip-not-found");

  if (!trip) {
    if (root) root.classList.add("hidden");
    if (notFound) notFound.classList.remove("hidden");
    document.title = "Trip not found | excursionmarrakech";
    return;
  }

  document.title = trip.title + " | excursionmarrakech";
  var metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute("content", trip.shortDescription);

  EM._currentTrip = trip;
  EM.applyTripI18n = function (baseTrip) {
    var loc = EM.localizedTrip ? EM.localizedTrip(baseTrip) : baseTrip;
    document.getElementById("trip-category").textContent = EM.categoryLabel
      ? EM.categoryLabel(baseTrip.category)
      : EM.categoryName(baseTrip.category);
    document.getElementById("trip-title").textContent = loc.title;
    document.title = loc.title + " | excursionmarrakech";
    var descHeading = document.getElementById("desc-heading");
    var itinHeading = document.getElementById("itin-heading");
    var inclHeading = document.getElementById("incl-heading");
    var relatedHeading = document.getElementById("related-trips-heading");
    var relatedAll = document.querySelector(".related-trips__all");
    if (descHeading && EM.t) descHeading.textContent = EM.t("trip.desc");
    if (itinHeading && EM.t) itinHeading.textContent = EM.t("trip.itinerary");
    if (inclHeading && EM.t) inclHeading.textContent = EM.t("trip.included");
    if (relatedHeading && EM.t) relatedHeading.textContent = EM.t("trip.related");
    if (relatedAll && EM.t) relatedAll.textContent = EM.t("trip.relatedAll");

    var durationText = loc.durationLabel || loc.duration || "";
    var durationEl = document.getElementById("trip-duration");
    if (durationEl) durationEl.textContent = durationText;
    var startPriceEl = document.getElementById("trip-start-price");
    if (startPriceEl) startPriceEl.textContent = EM.priceLabel(loc);

    var descEl = document.getElementById("trip-description");
    if (descEl) descEl.textContent = loc.description || "";
    var itinEl = document.getElementById("trip-itinerary");
    if (itinEl && Array.isArray(loc.itinerary)) {
      itinEl.innerHTML = loc.itinerary
        .map(function (step) {
          return "<li>" + EM.escapeHtml(step) + "</li>";
        })
        .join("");
    }
    var inclEl = document.getElementById("trip-included");
    if (inclEl && Array.isArray(loc.included)) {
      inclEl.innerHTML = loc.included
        .map(function (item) {
          return "<li>" + EM.escapeHtml(item) + "</li>";
        })
        .join("");
    }

    var rating = EM.ensureRating(baseTrip);
    var ratingEl = document.getElementById("trip-rating");
    if (ratingEl) {
      var reviewsWord = EM.t ? EM.t("trip.reviews") : "reviews";
      ratingEl.innerHTML =
        EM.starsHtml(rating.rating) +
        '<span class="trip-hero__reviews">' +
        rating.reviewCount +
        " " +
        reviewsWord +
        "</span>";
    }

    if (typeof EM.refreshTripPrice === "function") EM.refreshTripPrice();
    if (typeof EM._rebuildTripPricing === "function") EM._rebuildTripPricing();
  };
  EM.applyTripI18n(trip);

  var fallbackImage =
    "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1200&q=80";
  var galleryImages = (trip.images && trip.images.length
    ? trip.images
    : trip.image
      ? [trip.image]
      : [fallbackImage]
  ).filter(Boolean);
  var galleryIndex = 0;
  var tripImage = document.getElementById("trip-image");
  var galleryBar = document.getElementById("trip-gallery-controls");
  var galleryNavs = document.getElementById("trip-gallery-navs");
  var galleryThumbs = document.getElementById("trip-gallery-thumbs");
  var galleryCount = document.getElementById("trip-gallery-count");
  var galleryPrev = document.getElementById("trip-gallery-prev");
  var galleryNext = document.getElementById("trip-gallery-next");

  function showGalleryImage(index) {
    if (!galleryImages.length) return;
    galleryIndex = (index + galleryImages.length) % galleryImages.length;
    tripImage.src = galleryImages[galleryIndex];
    tripImage.alt = trip.title + " — photo " + (galleryIndex + 1);
    if (galleryCount) {
      galleryCount.textContent = galleryIndex + 1 + " / " + galleryImages.length;
    }
    if (galleryThumbs) {
      galleryThumbs.querySelectorAll("[data-gallery-index]").forEach(function (btn) {
        var active = Number(btn.getAttribute("data-gallery-index")) === galleryIndex;
        btn.classList.toggle("is-active", active);
        btn.setAttribute("aria-selected", active ? "true" : "false");
      });
    }
  }

  tripImage.onerror = function () {
    this.onerror = null;
    this.src = fallbackImage;
  };

  var hasGallery = galleryImages.length > 1;
  if (galleryBar) galleryBar.hidden = !hasGallery;
  if (galleryNavs) galleryNavs.hidden = !hasGallery;
  if (galleryThumbs && hasGallery) {
    galleryThumbs.innerHTML = galleryImages
      .map(function (url, i) {
        return (
          '<button type="button" class="trip-gallery-thumb" data-gallery-index="' +
          i +
          '" role="tab" aria-label="Show photo ' +
          (i + 1) +
          '" aria-selected="' +
          (i === 0 ? "true" : "false") +
          '">' +
          '<img src="' +
          EM.escapeHtml(url) +
          '" alt="" loading="lazy" />' +
          "</button>"
        );
      })
      .join("");
    galleryThumbs.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-gallery-index]");
      if (!btn) return;
      showGalleryImage(Number(btn.getAttribute("data-gallery-index")));
    });
  }
  if (galleryPrev) {
    galleryPrev.addEventListener("click", function () {
      showGalleryImage(galleryIndex - 1);
    });
  }
  if (galleryNext) {
    galleryNext.addEventListener("click", function () {
      showGalleryImage(galleryIndex + 1);
    });
  }
  showGalleryImage(0);

  EM.trackEvent("view_item", {
    content_name: trip.title,
    item_id: trip.id,
    currency: "MAD",
    value: EM.startingPrice(trip),
  });

  // Related trips ("You might also like")
  try {
    await EM.loadTrips();
  } catch (e) {
    /* static catalogue already available */
  }
  var relatedSection = document.getElementById("related-trips");
  var relatedRail = document.getElementById("related-trips-rail");
  if (relatedSection && relatedRail && EM.getRelatedTrips) {
    var related = EM.getRelatedTrips(trip, 4);
    if (related.length) {
      relatedSection.hidden = false;
      relatedSection.dataset.tripId = trip.id;
      relatedSection.querySelector(".related-trips__all").href = EM.tripsUrl(trip.category);
      EM.renderTripGrid(relatedRail, related);
      if (EM.syncRelatedTripsNav) EM.syncRelatedTripsNav();
    }
  }

  var selection = {};
  var pricingMount = document.getElementById("pricing-controls");
  var amountEl = document.getElementById("display-amount");
  var unitEl = document.getElementById("display-unit");
  var noteEl = document.getElementById("display-note");
  var totalEl = document.getElementById("display-total");
  var modeInput = document.getElementById("booking-mode");
  var p = trip.pricing;

  function minTravelersRequired() {
    var pricing = trip.pricing || {};
    if (pricing.type !== "private-group") return 1;
    if (selection.mode === "private" && pricing.minPrivate) {
      return Math.max(1, Number(pricing.minPrivate) || 1);
    }
    if (selection.mode === "group" && pricing.minGroup) {
      return Math.max(1, Number(pricing.minGroup) || 1);
    }
    return 1;
  }

  function syncTravelersField() {
    var el = document.getElementById("travelers");
    if (!el) return minTravelersRequired();
    var min = minTravelersRequired();
    el.min = String(min);
    el.setAttribute("aria-valuemin", String(min));
    var current = Number(el.value);
    if (!Number.isFinite(current) || current < min) {
      el.value = String(min);
    }
    return min;
  }

  function currentTravelers() {
    syncTravelersField();
    var el = document.getElementById("travelers");
    var min = minTravelersRequired();
    return Math.max(min, Number(el && el.value) || min);
  }

  function localizeUnit(unit) {
    if (!unit) return "";
    var u = String(unit).toLowerCase();
    if (u.indexOf("per person") !== -1 && EM.t) return EM.t("booking.perPerson");
    return unit;
  }

  function updatePriceDisplay() {
    var resolved = EM.resolveUnitPrice(trip, selection);
    var travelers = currentTravelers();
    var unit = (resolved.unit || "").toLowerCase();
    var total =
      unit.indexOf("buggy") !== -1 ? resolved.amount : resolved.amount * travelers;

    amountEl.textContent = EM.formatPrice(resolved.amount);
    unitEl.textContent = localizeUnit(resolved.unit || "");
    noteEl.textContent = resolved.note || "";
    noteEl.style.display = resolved.note ? "block" : "none";
    if (totalEl) {
      var tpl = EM.t ? EM.t("booking.total") : "Price: {price} · {n} traveler(s)";
      totalEl.textContent = tpl
        .replace("{price}", EM.formatPrice(total))
        .replace("{n}", String(travelers));
    }
    if (modeInput) {
      modeInput.value = JSON.stringify({
        selection: selection,
        amount: resolved.amount,
        total: total,
        unit: resolved.unit,
      });
    }
  }

  function buildPricingControls() {
    var prev = selection;
    if (p.type === "flat") {
      pricingMount.innerHTML = "";
      selection = {};
      return;
    }

    if (p.type === "private-group") {
      var hasPrivate = p.privatePrice != null;
      var hasGroup = p.groupPrice != null;
      selection.mode = (prev && prev.mode) || (hasGroup ? "group" : "private");
      var groupLabel = EM.t ? EM.t("booking.group") : "Group";
      var privateLabel = EM.t ? EM.t("booking.private") : "Private";
      var minLabel = EM.t ? EM.t("booking.min") : "min";
      var html = '<div class="pricing-toggle" role="radiogroup" aria-label="Booking type">';
      if (hasGroup) {
        html +=
          '<div class="pricing-option"><input type="radio" name="bookType" id="type-group" value="group"' +
          (selection.mode === "group" ? " checked" : "") +
          '><label for="type-group">' +
          groupLabel +
          '<span class="opt-price">' +
          EM.formatPrice(p.groupPrice) +
          (p.minGroup ? " · " + minLabel + " " + p.minGroup : "") +
          "</span></label></div>";
      }
      if (hasPrivate) {
        html +=
          '<div class="pricing-option"><input type="radio" name="bookType" id="type-private" value="private"' +
          (selection.mode === "private" ? " checked" : "") +
          '><label for="type-private">' +
          privateLabel +
          '<span class="opt-price">' +
          EM.formatPrice(p.privatePrice) +
          (p.minPrivate ? " · " + minLabel + " " + p.minPrivate : "") +
          "</span></label></div>";
      }
      html += "</div>";
      pricingMount.innerHTML = html;
      pricingMount.querySelectorAll('input[name="bookType"]').forEach(function (input) {
        input.addEventListener("change", function () {
          selection.mode = input.value;
          syncTravelersField();
          updatePriceDisplay();
        });
      });
      syncTravelersField();
      return;
    }

    if (p.type === "options") {
      selection.optionId = (prev && prev.optionId) || p.options[0].id;
      var html =
        '<div class="form-group"><label for="opt-select">Choose option</label><select id="opt-select" name="option">';
      p.options.forEach(function (o) {
        html +=
          '<option value="' +
          EM.escapeHtml(o.id) +
          '"' +
          (o.id === selection.optionId ? " selected" : "") +
          ">" +
          EM.escapeHtml(o.label) +
          " — " +
          EM.formatPrice(o.price) +
          "</option>";
      });
      html += "</select></div>";
      pricingMount.innerHTML = html;
      document.getElementById("opt-select").addEventListener("change", function (e) {
        selection.optionId = e.target.value;
        updatePriceDisplay();
      });
      return;
    }

    if (p.type === "driver-passenger") {
      selection.role = (prev && prev.role) || "driver";
      var driverLabel = EM.t ? EM.t("booking.driver") : "Driver";
      var passengerLabel = EM.t ? EM.t("booking.passenger") : "Passenger";
      pricingMount.innerHTML =
        '<div class="pricing-toggle" role="radiogroup" aria-label="Rider role">' +
        '<div class="pricing-option"><input type="radio" name="role" id="role-driver" value="driver"' +
        (selection.role === "driver" ? " checked" : "") +
        '><label for="role-driver">' +
        driverLabel +
        '<span class="opt-price">' +
        EM.formatPrice(p.driverPrice) +
        "</span></label></div>" +
        '<div class="pricing-option"><input type="radio" name="role" id="role-passenger" value="passenger"' +
        (selection.role === "passenger" ? " checked" : "") +
        '><label for="role-passenger">' +
        passengerLabel +
        '<span class="opt-price">' +
        EM.formatPrice(p.passengerPrice) +
        "</span></label></div></div>";
      pricingMount.querySelectorAll('input[name="role"]').forEach(function (input) {
        input.addEventListener("change", function () {
          selection.role = input.value;
          updatePriceDisplay();
        });
      });
    }
  }

  buildPricingControls();
  syncTravelersField();
  updatePriceDisplay();
  EM._rebuildTripPricing = function () {
    buildPricingControls();
    syncTravelersField();
    updatePriceDisplay();
  };
  EM.refreshTripPrice = function () {
    var el = document.getElementById("trip-start-price");
    var loc = EM.localizedTrip ? EM.localizedTrip(trip) : trip;
    if (el) el.textContent = EM.priceLabel(loc);
    updatePriceDisplay();
  };

  // Phone country field
  var phoneMount = document.getElementById("phone-field-mount");
  if (phoneMount && EM.buildPhoneFieldHtml) {
    phoneMount.innerHTML = EM.buildPhoneFieldHtml({ id: "booking-phone", selected: "MA" });
    EM.initPhoneField("booking-phone");
  }

  document.addEventListener("em:currency", function () {
    updatePriceDisplay();
  });

  var travelersInput = document.getElementById("travelers");
  if (travelersInput) travelersInput.addEventListener("input", updatePriceDisplay);

  // Payment buttons are hidden for now (inquiry booking only)
  var payStripe = document.getElementById("pay-stripe");
  var payPaypal = document.getElementById("pay-paypal");
  var payHint = document.getElementById("pay-hint");
  if (payStripe) payStripe.hidden = true;
  if (payPaypal) payPaypal.hidden = true;
  if (payHint) payHint.hidden = true;

  async function createBooking(mode) {
    var formEl = document.getElementById("booking-form");
    if (!formEl.reportValidity()) return null;
    var data = new FormData(formEl);
    var phoneCountry = String(data.get("phoneCountry") || "MA");
    var phoneNational = String(data.get("phone") || "").trim();
    if (!phoneNational) throw new Error("Please enter your phone number");
    var phoneFull = EM.formatPhoneE164
      ? EM.formatPhoneE164(phoneCountry, phoneNational)
      : phoneNational;

    var payload = {
      tripId: trip.id,
      fullName: String(data.get("fullName") || "").trim(),
      email: String(data.get("email") || "").trim(),
      phone: phoneFull,
      phoneCountry: phoneCountry,
      date: data.get("date"),
      travelers: Number(data.get("travelers")),
      selection: selection,
      mode: mode,
      displayCurrency: (EM.money && EM.money.code) || "MAD",
    };
    if (!payload.fullName || !payload.email || !payload.date || !payload.travelers) {
      throw new Error("Please fill in all booking fields");
    }
    var minTravelers = minTravelersRequired();
    if (payload.travelers < minTravelers) {
      syncTravelersField();
      throw new Error("Minimum " + minTravelers + " travelers required for this option");
    }
    return EM.api("/bookings", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  var form = document.getElementById("booking-form");
  var success = document.getElementById("form-success");
  var submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    success.classList.remove("is-visible");
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";
    }
    try {
      var booking = await createBooking("inquiry");
      if (!booking || !booking.bookingId) throw new Error("Booking was not saved");
      EM.trackEvent("Lead", {
        content_name: trip.title,
        bookingId: booking.bookingId,
      });
      window.location.href =
        "/booking-success?bookingId=" + encodeURIComponent(booking.bookingId);
    } catch (err) {
      success.classList.add("is-visible");
      success.textContent =
        "Error: " +
        (err.message === "Failed to fetch"
          ? "Cannot reach the server. Please check your connection and try again."
          : err.message);
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Request Booking";
      }
    }
  });

  if (payStripe) {
    payStripe.addEventListener("click", async function () {
      payStripe.disabled = true;
      try {
        var booking = await createBooking("payment");
        var session = await EM.api("/payments/stripe/checkout", {
          method: "POST",
          body: JSON.stringify({ bookingId: booking.bookingId }),
        });
        EM.trackEvent("InitiateCheckout", { content_name: trip.title, value: booking.totalAmount });
        window.location.href = session.url;
      } catch (err) {
        alert(err.message);
        payStripe.disabled = false;
      }
    });
  }

  if (payPaypal) {
    payPaypal.addEventListener("click", async function () {
      payPaypal.disabled = true;
      try {
        var booking = await createBooking("payment");
        var order = await EM.api("/payments/paypal/create-order", {
          method: "POST",
          body: JSON.stringify({ bookingId: booking.bookingId }),
        });
        EM.trackEvent("InitiateCheckout", { content_name: trip.title, value: booking.totalAmount });
        if (order.approveUrl) window.location.href = order.approveUrl;
        else throw new Error("No PayPal approve URL");
      } catch (err) {
        alert(err.message);
        payPaypal.disabled = false;
      }
    });
  }

  var dateInput = document.getElementById("booking-date");
  if (dateInput) {
    var d = new Date();
    d.setDate(d.getDate() + 1);
    dateInput.min = d.toISOString().slice(0, 10);
  }

  if (new URLSearchParams(window.location.search).get("cancelled") === "1") {
    success.classList.add("is-visible");
    success.textContent = "Payment was cancelled. You can try again or send an inquiry instead.";
  }

  // JSON-LD — Product + TouristTrip with full Merchant Offer fields
  var tripUrl =
    ((EM.config && EM.config.siteUrl) || "https://excursionmarrakech.net").replace(/\/$/, "") +
    "/" +
    encodeURIComponent(trip.id);
  var offers = [];
  if (p.type === "flat") {
    offers.push({
      name: trip.title,
      price: p.price,
      priceCurrency: "MAD",
    });
  } else if (p.type === "private-group") {
    if (p.groupPrice != null)
      offers.push({ name: "Group — " + trip.title, price: p.groupPrice, priceCurrency: "MAD" });
    if (p.privatePrice != null)
      offers.push({ name: "Private — " + trip.title, price: p.privatePrice, priceCurrency: "MAD" });
  } else if (p.type === "options") {
    p.options.forEach(function (o) {
      offers.push({ name: o.label + " — " + trip.title, price: o.price, priceCurrency: "MAD" });
    });
  } else if (p.type === "driver-passenger") {
    offers.push(
      { name: "Driver — " + trip.title, price: p.driverPrice, priceCurrency: "MAD" },
      { name: "Passenger — " + trip.title, price: p.passengerPrice, priceCurrency: "MAD" }
    );
  }

  var enrich = EM.SEO && EM.SEO.enrichOffers
    ? EM.SEO.enrichOffers(offers, {
        url: tripUrl,
        description: trip.shortDescription || trip.description,
        name: trip.title,
      })
    : offers;

  var absImages = galleryImages.map(function (src) {
    if (!src) return EM.SEO && EM.SEO.defaultImage ? EM.SEO.defaultImage() : trip.image;
    if (/^https?:\/\//i.test(src)) return src;
    var base = ((EM.config && EM.config.siteUrl) || "https://excursionmarrakech.net").replace(/\/$/, "");
    return base + (src.charAt(0) === "/" ? src : "/" + src);
  });

  // Product only for review stars — TouristTrip + reviews triggers GSC critical errors
  var productReviews = (EM.REVIEWS || [])
    .filter(function (r) {
      return r.tripId === trip.id;
    })
    .map(function (r) {
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

  var schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: trip.title,
    description: trip.shortDescription || trip.description || trip.title,
    image: absImages.length ? absImages : absImages[0] || trip.image,
    brand: { "@type": "Brand", name: "excursionmarrakech" },
    sku: trip.id,
    category: EM.categoryName(trip.category),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: Number(rating.rating),
      reviewCount: Number(rating.reviewCount),
      bestRating: 5,
      worstRating: 1,
    },
    offers:
      enrich.length === 1
        ? enrich[0]
        : {
            "@type": "AggregateOffer",
            priceCurrency: "MAD",
            lowPrice: EM.startingPrice(trip),
            highPrice: Math.max.apply(
              null,
              enrich.map(function (o) {
                return Number(o.price) || 0;
              })
            ),
            offerCount: enrich.length,
            offers: enrich,
          },
  };
  if (productReviews.length) schema.review = productReviews;

  if (EM.SEO && EM.SEO.injectJsonLd) EM.SEO.injectJsonLd("trip-product-schema", schema);
  else {
    var script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "trip-product-schema";
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  // Separate TouristTrip entity (no reviews) for trip semantics
  if (EM.SEO && EM.SEO.injectJsonLd) {
    EM.SEO.injectJsonLd("trip-tourist-schema", {
      "@context": "https://schema.org",
      "@type": "TouristTrip",
      name: trip.title,
      description: trip.shortDescription || trip.description || trip.title,
      image: absImages[0] || trip.image,
      touristType: EM.categoryName(trip.category),
      url: tripUrl,
      provider: {
        "@type": "TravelAgency",
        name: "excursionmarrakech",
        url: (EM.config && EM.config.siteUrl) || "https://excursionmarrakech.net",
      },
    });
  }

  // Trip FAQ + cancellation (visible + FAQPage schema)
  var faqMount = document.getElementById("trip-faq");
  if (faqMount) {
    var faqs = [
      {
        q: EM.t ? EM.t("trip.faq1q") : "What is included in this Marrakech excursion?",
        a: EM.t ? EM.t("trip.faq1a") : "Inclusions are listed on this page. Private and Group options show clear MAD pricing before you inquire.",
      },
      {
        q: EM.t ? EM.t("trip.faq2q") : "How do I book?",
        a: EM.t ? EM.t("trip.faq2a") : "Send a booking request with your date and party size, or WhatsApp +212 639 996 960. We confirm availability personally.",
      },
      {
        q: EM.t ? EM.t("trip.faq3q") : "What is the cancellation policy?",
        a: EM.t ? EM.t("trip.faq3a") : "Free cancellation up to 48 hours before the activity. Within 48 hours, fees may apply as confirmed at booking. Weather or safety issues are rescheduled when possible.",
      },
      {
        q: EM.t ? EM.t("trip.faq4q") : "Is hotel pickup included?",
        a: EM.t ? EM.t("trip.faq4a") : "Most day trips and desert tours include pickup in Marrakech when stated in the inclusions. Confirm your hotel or riad address when you book.",
      },
    ];
    faqMount.innerHTML =
      '<span class="eyebrow">' +
      EM.escapeHtml(EM.t ? EM.t("trip.faqEyebrow") : "FAQ") +
      "</span>" +
      "<h2 id=\"trip-faq-heading\">" +
      EM.escapeHtml(EM.t ? EM.t("trip.faqTitle") : "Questions before you book") +
      "</h2>" +
      '<div class="transfer-faq__list">' +
      faqs
        .map(function (f, i) {
          return (
            "<details" +
            (i === 0 ? " open" : "") +
            "><summary>" +
            EM.escapeHtml(f.q) +
            "</summary><p>" +
            EM.escapeHtml(f.a) +
            "</p></details>"
          );
        })
        .join("") +
      "</div>";
    if (EM.SEO && EM.SEO.injectFaqPage) EM.SEO.injectFaqPage(faqs, "trip-faq-schema");
  }

  if (EM.SEO && EM.SEO.applyPageMeta) {
    EM.SEO.applyPageMeta("trip", {
      title: trip.title + " | excursionmarrakech",
      description: (trip.shortDescription || trip.description || trip.title) + " WhatsApp +212 639 996 960.",
      image: absImages[0],
      imageAlt: trip.title,
    });
  }
});

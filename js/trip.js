/**
 * Single listing — API data, pricing, inquiry + Stripe/PayPal checkout
 */
document.addEventListener("DOMContentLoaded", async function () {
  EM.setActiveNav("trips");
  EM.ensureHelpers();
  await EM.loadConfig();
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

  document.getElementById("trip-image").src = trip.image;
  document.getElementById("trip-image").alt = trip.title;
  document.getElementById("trip-image").onerror = function () {
    this.onerror = null;
    this.src =
      "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1200&q=80";
  };
  document.getElementById("trip-category").textContent = EM.categoryName(trip.category);
  document.getElementById("trip-title").textContent = trip.title;
  document.getElementById("trip-duration").textContent = trip.duration;
  document.getElementById("trip-start-price").textContent = EM.priceLabel(trip);

  var rating = EM.ensureRating(trip);
  var ratingEl = document.getElementById("trip-rating");
  if (ratingEl) {
    ratingEl.innerHTML =
      EM.starsHtml(rating.rating) +
      '<span class="trip-hero__reviews">' +
      rating.reviewCount +
      " reviews</span>";
  }

  document.getElementById("trip-description").textContent = trip.description;
  document.getElementById("trip-itinerary").innerHTML = trip.itinerary
    .map(function (step) {
      return "<li>" + EM.escapeHtml(step) + "</li>";
    })
    .join("");
  document.getElementById("trip-included").innerHTML = trip.included
    .map(function (item) {
      return "<li>" + EM.escapeHtml(item) + "</li>";
    })
    .join("");

  var selection = {};
  var pricingMount = document.getElementById("pricing-controls");
  var amountEl = document.getElementById("display-amount");
  var unitEl = document.getElementById("display-unit");
  var noteEl = document.getElementById("display-note");
  var totalEl = document.getElementById("display-total");
  var modeInput = document.getElementById("booking-mode");
  var p = trip.pricing;

  function currentTravelers() {
    var el = document.getElementById("travelers");
    return Math.max(1, Number(el && el.value) || 1);
  }

  function updatePriceDisplay() {
    var resolved = EM.resolveUnitPrice(trip, selection);
    var travelers = currentTravelers();
    var unit = (resolved.unit || "").toLowerCase();
    var total =
      unit.indexOf("buggy") !== -1 ? resolved.amount : resolved.amount * travelers;

    amountEl.textContent = EM.formatPrice(resolved.amount);
    unitEl.textContent = resolved.unit || "";
    noteEl.textContent = resolved.note || "";
    noteEl.style.display = resolved.note ? "block" : "none";
    if (totalEl) {
      totalEl.textContent = "Total: " + EM.formatPrice(total) + " · " + travelers + " traveler(s)";
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
    if (p.type === "flat") {
      pricingMount.innerHTML = "";
      selection = {};
      return;
    }

    if (p.type === "private-group") {
      var hasPrivate = p.privatePrice != null;
      var hasGroup = p.groupPrice != null;
      selection.mode = hasGroup ? "group" : "private";
      var html = '<div class="pricing-toggle" role="radiogroup" aria-label="Booking type">';
      if (hasGroup) {
        html +=
          '<div class="pricing-option"><input type="radio" name="bookType" id="type-group" value="group" checked>' +
          '<label for="type-group">Group<span class="opt-price">' +
          EM.formatPrice(p.groupPrice) +
          "</span></label></div>";
      }
      if (hasPrivate) {
        html +=
          '<div class="pricing-option"><input type="radio" name="bookType" id="type-private" value="private"' +
          (hasGroup ? "" : " checked") +
          '><label for="type-private">Private<span class="opt-price">' +
          EM.formatPrice(p.privatePrice) +
          (p.minPrivate ? " · min " + p.minPrivate : "") +
          "</span></label></div>";
      }
      html += "</div>";
      pricingMount.innerHTML = html;
      pricingMount.querySelectorAll('input[name="bookType"]').forEach(function (input) {
        input.addEventListener("change", function () {
          selection.mode = input.value;
          updatePriceDisplay();
        });
      });
      return;
    }

    if (p.type === "options") {
      selection.optionId = p.options[0].id;
      var html =
        '<div class="form-group"><label for="opt-select">Choose option</label><select id="opt-select" name="option">';
      p.options.forEach(function (o, i) {
        html +=
          '<option value="' +
          EM.escapeHtml(o.id) +
          '"' +
          (i === 0 ? " selected" : "") +
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
      selection.role = "driver";
      pricingMount.innerHTML =
        '<div class="pricing-toggle" role="radiogroup" aria-label="Rider role">' +
        '<div class="pricing-option"><input type="radio" name="role" id="role-driver" value="driver" checked>' +
        '<label for="role-driver">Driver<span class="opt-price">' +
        EM.formatPrice(p.driverPrice) +
        "</span></label></div>" +
        '<div class="pricing-option"><input type="radio" name="role" id="role-passenger" value="passenger">' +
        '<label for="role-passenger">Passenger<span class="opt-price">' +
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
  updatePriceDisplay();

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

  // Payment buttons visibility
  var payStripe = document.getElementById("pay-stripe");
  var payPaypal = document.getElementById("pay-paypal");
  if (payStripe) payStripe.hidden = !(EM.config.paymentsEnabled && EM.config.paymentsEnabled.stripe);
  if (payPaypal) payPaypal.hidden = !(EM.config.paymentsEnabled && EM.config.paymentsEnabled.paypal);
  var payHint = document.getElementById("pay-hint");
  if (
    payHint &&
    EM.config.paymentsEnabled &&
    !EM.config.paymentsEnabled.stripe &&
    !EM.config.paymentsEnabled.paypal
  ) {
    payHint.hidden = false;
  }

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
      EM.trackEvent("Lead", { content_name: trip.title });
      window.location.href =
        "/booking-success?bookingId=" + encodeURIComponent(booking.bookingId);
    } catch (err) {
      success.classList.add("is-visible");
      success.textContent =
        "Error: " +
        (err.message === "Failed to fetch"
          ? "Cannot reach server. Use http://localhost:3000 (npm start must be running)."
          : err.message);
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Request Booking (inquiry)";
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

  // JSON-LD
  var offers = [];
  if (p.type === "flat") {
    offers.push({
      "@type": "Offer",
      price: p.price,
      priceCurrency: "MAD",
      availability: "https://schema.org/InStock",
    });
  } else if (p.type === "private-group") {
    if (p.groupPrice != null)
      offers.push({ "@type": "Offer", name: "Group", price: p.groupPrice, priceCurrency: "MAD" });
    if (p.privatePrice != null)
      offers.push({ "@type": "Offer", name: "Private", price: p.privatePrice, priceCurrency: "MAD" });
  } else if (p.type === "options") {
    p.options.forEach(function (o) {
      offers.push({ "@type": "Offer", name: o.label, price: o.price, priceCurrency: "MAD" });
    });
  } else if (p.type === "driver-passenger") {
    offers.push(
      { "@type": "Offer", name: "Driver", price: p.driverPrice, priceCurrency: "MAD" },
      { "@type": "Offer", name: "Passenger", price: p.passengerPrice, priceCurrency: "MAD" }
    );
  }

  var schema = {
    "@context": "https://schema.org",
    "@type": ["Product", "TouristTrip"],
    name: trip.title,
    description: trip.shortDescription,
    image: trip.image,
    brand: { "@type": "Brand", name: "excursionmarrakech" },
    touristType: EM.categoryName(trip.category),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: rating.rating,
      reviewCount: rating.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
    offers:
      offers.length === 1
        ? offers[0]
        : {
            "@type": "AggregateOffer",
            priceCurrency: "MAD",
            lowPrice: EM.startingPrice(trip),
            offerCount: offers.length,
            offers: offers,
          },
  };
  var script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
});

/**
 * API client — loads trips from backend, falls back to static data.js
 */
(function () {
  "use strict";
  window.EM = window.EM || {};

  EM.API_BASE = "/api";
  EM.config = {
    paymentsEnabled: { stripe: false, paypal: false },
    stripePublishableKey: "",
    paypalClientId: "",
  };

  EM.api = async function (path, options) {
    const res = await fetch(EM.API_BASE + path, {
      headers: { "Content-Type": "application/json", ...(options && options.headers) },
      ...options,
    });
    const data = await res.json().catch(function () {
      return {};
    });
    if (!res.ok) throw new Error(data.error || res.statusText);
    return data;
  };

  EM.loadConfig = async function () {
    try {
      EM.config = await EM.api("/config");
    } catch (e) {
      console.warn("Config unavailable", e);
      EM.config = EM.config || {};
    }
    if (typeof EM.createCurrency === "function") {
      if (EM.money) {
        EM.money.setRates(EM.config.currencyRates || undefined);
      } else {
        EM.money = EM.createCurrency(EM.config.currencyRates || undefined);
      }
    }
    if (typeof EM.mountCurrencySwitcher === "function") {
      EM.mountCurrencySwitcher();
    }
    return EM.config;
  };

  EM.loadTrips = async function (query) {
    try {
      const q = query ? "?" + new URLSearchParams(query).toString() : "";
      const trips = await EM.api("/trips" + q);
      EM.TRIPS = (trips || []).map(function (t) {
        if (EM.ensureRating) EM.ensureRating(t);
        return t;
      });
      return EM.TRIPS;
    } catch (e) {
      console.warn("API trips failed, using static catalogue", e);
      return EM.TRIPS || [];
    }
  };

  EM.loadTrip = async function (id) {
    try {
      const trip = await EM.api("/trips/" + encodeURIComponent(id));
      if (trip && EM.ensureRating) EM.ensureRating(trip);
      return trip;
    } catch (e) {
      return EM.getTrip ? EM.getTrip(id) : null;
    }
  };

  /** Keep helper methods working after API replace of EM.TRIPS */
  EM.ensureHelpers = function () {
    if (!EM.getTrip) {
      EM.getTrip = function (id) {
        return (EM.TRIPS || []).find(function (t) {
          return t.id === id;
        });
      };
    }
    if (!EM.getFeatured) {
      EM.getFeatured = function (limit) {
        return (EM.TRIPS || [])
          .filter(function (t) {
            return t.featured;
          })
          .slice(0, limit || 6);
      };
    }
    if (!EM.getByCategory) {
      EM.getByCategory = function (categoryId) {
        if (!categoryId || categoryId === "all") return (EM.TRIPS || []).slice();
        return (EM.TRIPS || []).filter(function (t) {
          return t.category === categoryId;
        });
      };
    }
    if (!EM.getRelatedTrips) {
      EM.getRelatedTrips = function (trip, limit) {
        limit = limit || 4;
        if (!trip) return [];
        var trips = EM.TRIPS || [];
        var others = trips.filter(function (t) {
          return t && t.id && t.id !== trip.id;
        });
        function byRating(a, b) {
          var ra = EM.ensureRating ? EM.ensureRating(a) : { rating: 0, reviewCount: 0 };
          var rb = EM.ensureRating ? EM.ensureRating(b) : { rating: 0, reviewCount: 0 };
          return rb.rating - ra.rating || rb.reviewCount - ra.reviewCount;
        }
        var same = others
          .filter(function (t) {
            return t.category === trip.category;
          })
          .sort(byRating);
        var rest = others
          .filter(function (t) {
            return t.category !== trip.category;
          })
          .sort(function (a, b) {
            return (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || byRating(a, b);
          });
        return same.concat(rest).slice(0, limit);
      };
    }
    if (!EM.CATEGORIES) {
      EM.CATEGORIES = [
        { id: "desert", name: "Desert Adventures", description: "", image: "" },
        { id: "day-trips", name: "Day Trips", description: "", image: "" },
        { id: "city", name: "City Tours", description: "", image: "" },
        { id: "wellness", name: "Wellness", description: "", image: "" },
        { id: "multi-day", name: "Multi-day", description: "", image: "" },
      ];
    }
  };
})();

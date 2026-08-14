/**
 * Site search page — /search?q=
 */
document.addEventListener("DOMContentLoaded", async function () {
  EM.setActiveNav("search");
  EM.ensureHelpers();
  await EM.loadConfig();
  if (EM.initI18n) EM.initI18n();
  EM.initTracking(EM.config);
  await EM.loadTrips();

  var form = document.getElementById("search-form");
  var input = document.getElementById("search-input");
  var grid = document.getElementById("search-grid");
  var countEl = document.getElementById("search-count");
  var emptyEl = document.getElementById("search-empty");
  var suggestEl = document.getElementById("search-suggestions");
  var titleEl = document.getElementById("search-heading");

  function syncMeta(query, resultCount) {
    var baseTitle = EM.t ? EM.t("seo.search.title") : "Search Marrakech excursions | excursionmarrakech";
    var title = query
      ? (EM.t ? EM.t("search.resultsTitle") : 'Results for “{q}”').replace("{q}", query) +
        " | excursionmarrakech"
      : baseTitle;
    var desc = query
      ? (EM.t ? EM.t("search.resultsDesc") : "{n} Marrakech excursions matching “{q}”. Book with clear pricing.")
          .replace("{n}", String(resultCount))
          .replace("{q}", query)
      : EM.t
        ? EM.t("seo.search.description")
        : "Search Marrakech desert tours, Atlas day trips, airport transfers and more.";
    if (EM.SEO && EM.SEO.applyPageMeta) {
      EM.SEO.applyPageMeta("search", { title: title, description: desc });
    } else {
      document.title = title;
    }
    // Index the search hub; noindex thin/empty query result URLs
    var robots = document.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement("meta");
      robots.setAttribute("name", "robots");
      document.head.appendChild(robots);
    }
    robots.setAttribute("content", query && resultCount === 0 ? "noindex,follow" : "index,follow");

    var canonical = document.querySelector('link[rel="canonical"]');
    var site = ((EM.config && EM.config.siteUrl) || "https://excursionmarrakech.net").replace(/\/$/, "");
    var href = site + "/search" + (query ? "?q=" + encodeURIComponent(query) : "");
    if (canonical) canonical.setAttribute("href", href);
  }

  function renderSuggestions() {
    if (!suggestEl || !EM.SEARCH_SUGGESTIONS) return;
    suggestEl.innerHTML = EM.SEARCH_SUGGESTIONS.map(function (s) {
      return (
        '<a class="search-chip" href="/search?q=' +
        encodeURIComponent(s.q) +
        '">' +
        EM.escapeHtml(s.label) +
        "</a>"
      );
    }).join("");
  }

  function runSearch(query, pushUrl) {
    var q = String(query || "").trim();
    if (input && input.value !== q) input.value = q;

    var result = EM.searchTrips(q);
    var trips = result.trips;
    var showTransfer = result.includeTransfer;
    var total = trips.length + (showTransfer ? 1 : 0);

    if (!q) {
      if (titleEl) titleEl.textContent = EM.t ? EM.t("search.title") : "Search excursions";
      if (countEl) {
        countEl.textContent = EM.t
          ? EM.t("search.hint")
          : "Try Ourika, Agafay, Merzouga, airport transfer…";
      }
      if (emptyEl) emptyEl.hidden = true;
      if (grid) {
        EM.renderTripGrid(grid, EM.getFeatured(6), { includeTransfer: true });
      }
      syncMeta("", 0);
    } else {
      if (titleEl) {
        titleEl.textContent = (EM.t ? EM.t("search.resultsTitle") : 'Results for “{q}”').replace(
          "{q}",
          q
        );
      }
      if (countEl) {
        var word =
          total === 1
            ? EM.t
              ? EM.t("trips.listing")
              : "listing"
            : EM.t
              ? EM.t("trips.listings")
              : "listings";
        countEl.textContent = total + " " + word;
      }
      if (emptyEl) emptyEl.hidden = total > 0;
      if (grid) {
        if (total === 0) {
          grid.innerHTML = "";
        } else if (showTransfer && !trips.length) {
          EM.renderTripGrid(grid, [], { transferOnly: true });
        } else {
          EM.renderTripGrid(grid, trips, { includeTransfer: showTransfer });
        }
      }
      syncMeta(q, total);

      if (EM.SEO && EM.SEO.injectJsonLd && total > 0) {
        var site = ((EM.config && EM.config.siteUrl) || "https://excursionmarrakech.net").replace(
          /\/$/,
          ""
        );
        var items = [];
        if (showTransfer) {
          items.push({
            "@type": "ListItem",
            position: 1,
            url: site + "/airport-transfer",
            name: EM.t ? EM.t("transfer.cardTitle") : "Marrakech Airport — Private Transfer",
          });
        }
        trips.slice(0, 10).forEach(function (t, i) {
          items.push({
            "@type": "ListItem",
            position: items.length + 1,
            url: site + "/" + encodeURIComponent(t.id),
            name: (EM.localizedTrip ? EM.localizedTrip(t) : t).title,
          });
        });
        EM.SEO.injectJsonLd("search-itemlist-schema", {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Search results for " + q,
          numberOfItems: total,
          itemListElement: items,
        });
      }
    }

    if (pushUrl !== false) {
      var url = new URL(window.location.href);
      if (q) url.searchParams.set("q", q);
      else url.searchParams.delete("q");
      window.history.replaceState({}, "", url);
    }

    EM.trackEvent &&
      EM.trackEvent("Search", {
        search_term: q || undefined,
        content_name: "site_search",
      });
  }

  renderSuggestions();

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      runSearch(input ? input.value : "", true);
    });
  }

  var params = new URLSearchParams(window.location.search);
  runSearch(params.get("q") || "", false);

  if (input && params.get("q")) {
    input.focus();
    input.select();
  } else if (input && !params.get("q")) {
    input.focus();
  }

  if (EM.SEO && EM.SEO.PAGE_KEYS) EM.SEO.PAGE_KEYS["/search"] = "search";
});

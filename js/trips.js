/**
 * Archive — API trips + category filters (+ airport transfer card)
 */
document.addEventListener("DOMContentLoaded", async function () {
  EM.setActiveNav("trips");
  EM.ensureHelpers();
  await EM.loadConfig();
  if (EM.initI18n) EM.initI18n();
  EM.initTracking(EM.config);
  await EM.loadTrips();

  var params = new URLSearchParams(window.location.search);
  var active = params.get("category") || "all";
  var grid = document.getElementById("trips-grid");
  var countEl = document.getElementById("trips-count");
  var filterList = document.getElementById("filter-list");

  function applyFilter(categoryId) {
    active = categoryId || "all";
    var trips = EM.getByCategory(active === "all" || active === "transfers" ? null : active);
    if (active === "transfers") {
      EM.renderTripGrid(grid, [], { transferOnly: true });
      if (countEl) {
        countEl.textContent =
          "1 " + (EM.t ? EM.t("trips.listing") : "listing") + " · " + (EM.t ? EM.t("trips.transfersFilter") : "Airport transfers");
      }
    } else {
      EM.renderTripGrid(grid, trips, { includeTransfer: active === "all" });
      if (countEl) {
        var total = trips.length + (active === "all" ? 1 : 0);
        var label =
          active === "all"
            ? EM.t
              ? EM.t("trips.all")
              : "All trips"
            : EM.categoryLabel
              ? EM.categoryLabel(active)
              : EM.categoryName(active);
        var word =
          total === 1
            ? EM.t
              ? EM.t("trips.listing")
              : "listing"
            : EM.t
              ? EM.t("trips.listings")
              : "listings";
        countEl.textContent = total + " " + word + " · " + label;
      }
    }
    document.querySelectorAll(".filter-btn").forEach(function (btn) {
      btn.setAttribute(
        "aria-pressed",
        btn.getAttribute("data-category") === active ? "true" : "false"
      );
    });
    var url = new URL(window.location.href);
    if (active === "all") url.searchParams.delete("category");
    else url.searchParams.set("category", active);
    window.history.replaceState({}, "", url);
  }

  EM.refreshTripsFilters = function () {
    if (!filterList) return;
    filterList.innerHTML =
      '<li><button type="button" class="filter-btn" data-category="all">' +
      EM.escapeHtml(EM.t ? EM.t("trips.all") : "All trips") +
      "</button></li>" +
      '<li><button type="button" class="filter-btn" data-category="transfers">' +
      EM.escapeHtml(EM.t ? EM.t("trips.transfersFilter") : "Airport transfers") +
      "</button></li>" +
      (EM.CATEGORIES || [])
        .map(function (c) {
          return (
            '<li><button type="button" class="filter-btn" data-category="' +
            EM.escapeHtml(c.id) +
            '">' +
            EM.escapeHtml(EM.categoryLabel ? EM.categoryLabel(c.id) : c.name) +
            "</button></li>"
          );
        })
        .join("");
    applyFilter(active);
  };

  if (filterList) {
    filterList.addEventListener("click", function (e) {
      var btn = e.target.closest(".filter-btn");
      if (!btn) return;
      applyFilter(btn.getAttribute("data-category"));
    });
  }

  EM.refreshTripsFilters();
  if (EM.SEO && EM.SEO.applyPageMeta) EM.SEO.applyPageMeta("trips");
});

/**
 * Archive — API trips + category filters
 */
document.addEventListener("DOMContentLoaded", async function () {
  EM.setActiveNav("trips");
  EM.ensureHelpers();
  await EM.loadConfig();
  EM.initTracking(EM.config);
  await EM.loadTrips();

  var params = new URLSearchParams(window.location.search);
  var active = params.get("category") || "all";
  var grid = document.getElementById("trips-grid");
  var countEl = document.getElementById("trips-count");
  var filterList = document.getElementById("filter-list");

  function applyFilter(categoryId) {
    active = categoryId || "all";
    var trips = EM.getByCategory(active === "all" ? null : active);
    EM.renderTripGrid(grid, trips);
    if (countEl) {
      var label = active === "all" ? "All trips" : EM.categoryName(active);
      countEl.textContent =
        trips.length + " " + (trips.length === 1 ? "trip" : "trips") + " · " + label;
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

  if (filterList) {
    filterList.innerHTML =
      '<li><button type="button" class="filter-btn" data-category="all" aria-pressed="true">All trips</button></li>' +
      (EM.CATEGORIES || [])
        .map(function (c) {
          return (
            '<li><button type="button" class="filter-btn" data-category="' +
            EM.escapeHtml(c.id) +
            '">' +
            EM.escapeHtml(c.name) +
            "</button></li>"
          );
        })
        .join("");

    filterList.addEventListener("click", function (e) {
      var btn = e.target.closest(".filter-btn");
      if (!btn) return;
      applyFilter(btn.getAttribute("data-category"));
    });
  }

  applyFilter(active);
});

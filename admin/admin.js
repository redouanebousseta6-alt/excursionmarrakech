const API = "/api";
const tokenKey = "em_admin_token";

const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];

function token() {
  return localStorage.getItem(tokenKey);
}

async function api(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (token()) headers.Authorization = `Bearer ${token()}`;
  const res = await fetch(API + path, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || res.statusText);
  return data;
}

function showApp(loggedIn) {
  const login = $("#login-view");
  const app = $("#app-view");
  login.hidden = loggedIn;
  app.hidden = !loggedIn;
  login.classList.toggle("is-hidden", loggedIn);
  app.classList.toggle("is-hidden", !loggedIn);
}

function showView(name) {
  $$(".nav-btn").forEach((b) => b.classList.toggle("is-active", b.dataset.view === name));
  $$(".view").forEach((v) => {
    const on = v.id === "view-" + name;
    v.hidden = !on;
    v.classList.toggle("is-hidden", !on);
  });
  if (name === "dashboard") loadDashboard();
  if (name === "trips") loadTrips();
  if (name === "bookings") loadBookings();
}

$("#login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const errEl = $("#login-error");
  const btn = e.target.querySelector('button[type="submit"]');
  errEl.hidden = true;
  errEl.textContent = "";
  btn.disabled = true;
  btn.textContent = "Signing in…";
  try {
    const data = await api("/admin/login", {
      method: "POST",
      body: JSON.stringify({ email: fd.get("email"), password: fd.get("password") }),
    });
    if (!data.token) throw new Error("Login failed — no token returned");
    localStorage.setItem(tokenKey, data.token);
    showApp(true);
    showView("dashboard");
  } catch (err) {
    console.error(err);
    errEl.textContent =
      err.message === "Failed to fetch"
        ? "Cannot reach the server. Check your connection and try again."
        : err.message || "Login failed";
    errEl.hidden = false;
  } finally {
    btn.disabled = false;
    btn.textContent = "Sign in";
  }
});

$("#logout-btn").addEventListener("click", () => {
  localStorage.removeItem(tokenKey);
  showApp(false);
});

$$(".nav-btn").forEach((btn) => {
  btn.addEventListener("click", () => showView(btn.dataset.view));
});

document.addEventListener("click", (e) => {
  if (e.target.closest("[data-go-bookings]")) showView("bookings");
});

function renderBookingsTable(bookings, targetSel) {
  const el = $(targetSel);
  if (!el) return;
  el.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>When</th>
          <th>Guest</th>
          <th>Trip</th>
          <th>Travel date</th>
          <th>Total</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${
          bookings.length
            ? bookings
                .map(
                  (b) => `
          <tr>
            <td><small>${escapeHtml((b.createdAt || "").replace("T", " ").slice(0, 16))}</small></td>
            <td>
              ${escapeHtml(b.fullName)}<br>
              <small>${escapeHtml(b.email)}</small><br>
              <small>${escapeHtml(b.phone || "—")}${b.phoneCountry ? " · " + escapeHtml(b.phoneCountry) : ""}</small>
            </td>
            <td>${escapeHtml(b.tripTitle)}<br><small>${b.travelers} travelers</small></td>
            <td>${escapeHtml(b.travelDate)}</td>
            <td>
              ${Number(b.totalAmount).toLocaleString("fr-MA")} MAD
              ${
                b.displayCurrency && b.displayCurrency !== "MAD" && b.displayTotal != null
                  ? `<br><small>≈ ${escapeHtml(String(b.displayTotal))} ${escapeHtml(b.displayCurrency)}</small>`
                  : ""
              }
            </td>
            <td>
              <span class="badge ${escapeHtml(b.status)}">${escapeHtml(b.status)}</span>
              ${b.paymentProvider ? `<br><small>${escapeHtml(b.paymentProvider)}</small>` : ""}
            </td>
            <td class="actions">
              <button type="button" data-status="${b.id}" data-to="confirmed">Confirm</button>
              <button type="button" data-status="${b.id}" data-to="cancelled">Cancel</button>
            </td>
          </tr>`
                )
                .join("")
            : `<tr><td colspan="7">No orders yet. When a guest submits a booking from a trip page, it will appear here.</td></tr>`
        }
      </tbody>
    </table>`;

  el.querySelectorAll("[data-status]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      try {
        await api("/admin/bookings/" + btn.dataset.status, {
          method: "PATCH",
          body: JSON.stringify({ status: btn.dataset.to }),
        });
        loadDashboard();
        if (!$("#view-bookings").hidden) loadBookings();
      } catch (err) {
        alert(err.message);
      }
    });
  });
}

async function loadDashboard() {
  try {
    const s = await api("/admin/stats");
    $("#stats").innerHTML = `
      <div class="stat"><strong>${s.activeTrips}</strong><span>Active excursions</span></div>
      <div class="stat" style="cursor:pointer" data-go-bookings>
        <strong>${s.bookings}</strong><span>Total orders</span>
      </div>
      <div class="stat"><strong>${s.paid}</strong><span>Paid</span></div>
      <div class="stat"><strong>${Number(s.revenueMad).toLocaleString("fr-MA")} MAD</strong><span>Paid revenue</span></div>
    `;
    const bookings = await api("/admin/bookings");
    renderBookingsTable(bookings.slice(0, 8), "#recent-bookings");
  } catch (err) {
    $("#stats").innerHTML = `<p class="error">${escapeHtml(err.message)}</p>`;
  }
}

async function loadTrips() {
  const trips = await api("/admin/trips");
  $("#trips-table").innerHTML = `
    <table>
      <thead><tr><th>Title</th><th>Category</th><th>Featured</th><th>Active</th><th></th></tr></thead>
      <tbody>
        ${trips
          .map(
            (t) => `
          <tr>
            <td><strong>${escapeHtml(t.title)}</strong><br><small>${escapeHtml(t.id)}</small></td>
            <td>${escapeHtml(t.category)}</td>
            <td>${t.featured ? "Yes" : "No"}</td>
            <td>${t.active ? "Yes" : "No"}</td>
            <td class="actions">
              <button type="button" data-edit="${t.id}">Edit</button>
              <button type="button" data-deactivate="${t.id}">${t.active ? "Deactivate" : "Already off"}</button>
            </td>
          </tr>`
          )
          .join("")}
      </tbody>
    </table>`;

  $$("[data-edit]").forEach((btn) => {
    btn.addEventListener("click", () => openTripDialog(trips.find((t) => t.id === btn.dataset.edit)));
  });
  $$("[data-deactivate]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (!confirm("Deactivate this excursion?")) return;
      await api("/admin/trips/" + btn.dataset.deactivate, { method: "DELETE" });
      loadTrips();
    });
  });
}

$("#booking-filter")?.addEventListener("change", loadBookings);

async function loadBookings() {
  try {
    const status = $("#booking-filter").value;
    const q = status ? `?status=${encodeURIComponent(status)}` : "";
    const bookings = await api("/admin/bookings" + q);
    renderBookingsTable(bookings, "#bookings-table");
  } catch (err) {
    $("#bookings-table").innerHTML = `<p class="error">${escapeHtml(err.message)}</p>`;
  }
}

const dialog = $("#trip-dialog");
const form = $("#trip-form");
const imageGalleryList = $("#image-gallery-list");
const imageGalleryEmpty = $("#image-gallery-empty");
const imageUrlInput = $("#image-url");
const imageFileInput = $("#image-file");
const imagePickBtn = $("#image-pick-btn");
const imageUploadStatus = $("#image-upload-status");
const imageUrlAddBtn = $("#image-url-add");

let galleryImages = [];

function renderGallery() {
  if (!imageGalleryList) return;
  imageGalleryList.innerHTML = galleryImages
    .map((url, index) => {
      return `
        <li class="image-gallery-item${index === 0 ? " is-cover" : ""}" data-index="${index}">
          <img src="${escapeHtml(url)}" alt="Gallery image ${index + 1}" />
          ${index === 0 ? '<span class="cover-badge">Cover</span>' : ""}
          <div class="image-gallery-actions">
            <button type="button" data-gallery-up ${index === 0 ? "disabled" : ""}>↑</button>
            <button type="button" data-gallery-down ${index === galleryImages.length - 1 ? "disabled" : ""}>↓</button>
            <button type="button" data-gallery-remove>Remove</button>
          </div>
        </li>`;
    })
    .join("");
  if (imageGalleryEmpty) imageGalleryEmpty.hidden = galleryImages.length > 0;
}

function addGalleryUrls(urls) {
  const next = [...galleryImages];
  urls.forEach((url) => {
    const clean = String(url || "").trim();
    if (!clean || next.includes(clean)) return;
    next.push(clean);
  });
  galleryImages = next;
  renderGallery();
}

imagePickBtn?.addEventListener("click", () => imageFileInput?.click());

imageFileInput?.addEventListener("change", async () => {
  const files = imageFileInput.files ? [...imageFileInput.files] : [];
  if (!files.length) return;
  imageUploadStatus.textContent = files.length > 1 ? `Uploading ${files.length} images…` : "Uploading…";
  imagePickBtn.disabled = true;
  try {
    const body = new FormData();
    files.forEach((file) => body.append("images", file));
    const headers = {};
    if (token()) headers.Authorization = `Bearer ${token()}`;
    const res = await fetch(API + "/admin/upload", { method: "POST", headers, body });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || res.statusText);
    addGalleryUrls(data.urls || (data.url ? [data.url] : []));
    imageUploadStatus.textContent =
      (data.urls || []).length > 1 ? `Uploaded ${(data.urls || []).length} images` : "Uploaded";
  } catch (err) {
    console.error(err);
    imageUploadStatus.textContent = err.message || "Upload failed";
  } finally {
    imagePickBtn.disabled = false;
    imageFileInput.value = "";
  }
});

imageUrlAddBtn?.addEventListener("click", () => {
  const url = String(imageUrlInput?.value || "").trim();
  if (!url) return;
  addGalleryUrls([url]);
  imageUrlInput.value = "";
  if (imageUploadStatus) imageUploadStatus.textContent = "URL added";
});

imageUrlInput?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    imageUrlAddBtn?.click();
  }
});

imageGalleryList?.addEventListener("click", (e) => {
  const item = e.target.closest(".image-gallery-item");
  if (!item) return;
  const index = Number(item.dataset.index);
  if (Number.isNaN(index)) return;
  if (e.target.closest("[data-gallery-remove]")) {
    galleryImages.splice(index, 1);
    renderGallery();
    return;
  }
  if (e.target.closest("[data-gallery-up]") && index > 0) {
    const tmp = galleryImages[index - 1];
    galleryImages[index - 1] = galleryImages[index];
    galleryImages[index] = tmp;
    renderGallery();
    return;
  }
  if (e.target.closest("[data-gallery-down]") && index < galleryImages.length - 1) {
    const tmp = galleryImages[index + 1];
    galleryImages[index + 1] = galleryImages[index];
    galleryImages[index] = tmp;
    renderGallery();
  }
});

$("#pricing-type").addEventListener("change", () => {
  const type = $("#pricing-type").value;
  $("#price-flat").hidden = type !== "flat";
  $("#price-pg").hidden = type !== "private-group";
});

$("#new-trip-btn").addEventListener("click", () => openTripDialog(null));
$("#trip-cancel").addEventListener("click", () => dialog.close());

function openTripDialog(trip) {
  form.reset();
  if (imageUploadStatus) imageUploadStatus.textContent = "";
  if (imageUrlInput) imageUrlInput.value = "";
  $("#trip-dialog-title").textContent = trip ? "Edit excursion" : "New excursion";
  form.id.value = trip?.id || "";
  galleryImages = trip?.images?.length
    ? [...trip.images]
    : trip?.image
      ? [trip.image]
      : [];
  if (trip) {
    form.title.value = trip.title;
    form.category.value = trip.category;
    form.shortDescription.value = trip.shortDescription;
    form.description.value = trip.description;
    form.duration.value = trip.duration || "";
    form.durationLabel.value = trip.durationLabel || "";
    form.featured.checked = !!trip.featured;
    form.active.checked = trip.active !== false;
    form.itinerary.value = (trip.itinerary || []).join("\n");
    form.included.value = (trip.included || []).join("\n");
    const p = trip.pricing || {};
    form.pricingType.value = p.type === "private-group" ? "private-group" : "flat";
    form.flatPrice.value = p.price || "";
    form.privatePrice.value = p.privatePrice || "";
    form.groupPrice.value = p.groupPrice || "";
    form.minPrivate.value = p.minPrivate || "";
    form.minGroup.value = p.minGroup || "";
  } else {
    form.active.checked = true;
    form.pricingType.value = "flat";
  }
  renderGallery();
  $("#pricing-type").dispatchEvent(new Event("change"));
  dialog.showModal();
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const fd = new FormData(form);
  const pricingType = fd.get("pricingType");
  let pricing;
  if (pricingType === "private-group") {
    pricing = {
      type: "private-group",
      privatePrice: fd.get("privatePrice") ? Number(fd.get("privatePrice")) : null,
      groupPrice: fd.get("groupPrice") ? Number(fd.get("groupPrice")) : null,
      unit: "per person",
      minPrivate: fd.get("minPrivate") ? Number(fd.get("minPrivate")) : undefined,
      minGroup: fd.get("minGroup") ? Number(fd.get("minGroup")) : undefined,
    };
  } else {
    pricing = { type: "flat", price: Number(fd.get("flatPrice") || 0), unit: "per person" };
  }

  const payload = {
    title: fd.get("title"),
    category: fd.get("category"),
    shortDescription: fd.get("shortDescription"),
    description: fd.get("description"),
    duration: fd.get("duration"),
    durationLabel: fd.get("durationLabel") || fd.get("duration"),
    image: galleryImages[0] || undefined,
    images: galleryImages,
    featured: form.featured.checked,
    active: form.active.checked,
    itinerary: String(fd.get("itinerary") || "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
    included: String(fd.get("included") || "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
    pricing,
  };

  const existingId = fd.get("id");
  if (existingId) {
    await api("/admin/trips/" + existingId, { method: "PUT", body: JSON.stringify(payload) });
  } else {
    await api("/admin/trips", { method: "POST", body: JSON.stringify(payload) });
  }
  dialog.close();
  loadTrips();
});

function escapeHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

(async function init() {
  if (!token()) return showApp(false);
  try {
    await api("/admin/me");
    showApp(true);
    showView("dashboard");
  } catch {
    localStorage.removeItem(tokenKey);
    showApp(false);
  }
})();

const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { db, rowToTrip, tripToRow } = require("./db");
const { requireAdmin, loginAdmin } = require("./auth");
const { CATEGORIES, startingPrice, computeTotal } = require("./pricing");
const { DEFAULT_RATES } = require("../js/currency.js");
const { uploadTripImage } = require("./upload");

const router = express.Router();

function getRates() {
  const row = db.prepare("SELECT value FROM settings WHERE key = ?").get("currency_rates");
  if (!row) return { ...DEFAULT_RATES };
  try {
    return { ...DEFAULT_RATES, ...JSON.parse(row.value) };
  } catch {
    return { ...DEFAULT_RATES };
  }
}

function convertFromMad(amountMad, code, rates) {
  const rate = rates[code] || 1;
  if (code === "MAD") return Math.round(Number(amountMad));
  return Math.round((Number(amountMad) / rate) * 100) / 100;
}

function slugify(text) {
  return String(text)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

// ——— Public ———
router.get("/health", (_req, res) => {
  res.json({ ok: true, service: "excursionmarrakech" });
});

router.get("/categories", (_req, res) => {
  res.json(CATEGORIES);
});

router.get("/config", (_req, res) => {
  res.json({
    siteUrl: process.env.SITE_URL || "http://localhost:3000",
    stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY || "",
    paypalClientId: process.env.PAYPAL_CLIENT_ID || "",
    paypalMode: process.env.PAYPAL_MODE || "sandbox",
    paymentsEnabled: {
      stripe: !!(process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes("your_key")),
      paypal: !!(process.env.PAYPAL_CLIENT_ID && !process.env.PAYPAL_CLIENT_ID.includes("your_paypal")),
    },
    metaPixelId: process.env.META_PIXEL_ID || "",
    googleAdsId: process.env.GOOGLE_ADS_ID || "",
    currencies: ["MAD", "USD", "EUR", "GBP"],
    currencyRates: getRates(),
    baseCurrency: "MAD",
  });
});

router.get("/trips", (req, res) => {
  const { category, featured } = req.query;
  let sql = "SELECT * FROM trips WHERE active = 1";
  const params = [];
  if (category && category !== "all") {
    sql += " AND category = ?";
    params.push(category);
  }
  if (featured === "1" || featured === "true") {
    sql += " AND featured = 1";
  }
  sql += " ORDER BY featured DESC, title ASC";
  const rows = db.prepare(sql).all(...params);
  res.json(rows.map(rowToTrip));
});

router.get("/trips/:id", (req, res) => {
  const row = db.prepare("SELECT * FROM trips WHERE id = ? AND active = 1").get(req.params.id);
  if (!row) return res.status(404).json({ error: "Trip not found" });
  res.json(rowToTrip(row));
});

router.post("/bookings", (req, res) => {
  const {
    tripId,
    fullName,
    email,
    phone,
    phoneCountry,
    date,
    travelers,
    selection = {},
    mode = "inquiry",
    displayCurrency = "MAD",
  } = req.body || {};

  if (!tripId || !fullName || !email || !date || travelers == null || travelers === "") {
    return res.status(400).json({ error: "Missing required fields" });
  }
  if (!phone || !phoneCountry) {
    return res.status(400).json({ error: "Phone number and country are required" });
  }

  const travelersCount = Number(travelers);
  if (!Number.isFinite(travelersCount) || travelersCount < 1) {
    return res.status(400).json({ error: "Travelers must be at least 1" });
  }

  const row = db.prepare("SELECT * FROM trips WHERE id = ? AND active = 1").get(tripId);
  if (!row) return res.status(404).json({ error: "Trip not found" });
  const trip = rowToTrip(row);
  const priced = computeTotal(trip.pricing, selection, travelersCount);
  if (priced.amount == null) {
    return res.status(400).json({ error: "Unable to resolve price" });
  }

  const rates = getRates();
  const currencyCode = ["MAD", "USD", "EUR", "GBP"].includes(displayCurrency)
    ? displayCurrency
    : "MAD";
  const displayTotal = convertFromMad(priced.total, currencyCode, rates);

  const id = uuidv4();
  const status = mode === "payment" ? "pending_payment" : "inquiry";
  const phoneClean = String(phone).trim();

  db.prepare(`
    INSERT INTO bookings (
      id, trip_id, trip_title, full_name, email, phone, phone_country,
      travel_date, travelers, selection_json, unit_price, total_amount,
      currency, display_currency, display_total, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'MAD', ?, ?, ?)
  `).run(
    id,
    trip.id,
    trip.title,
    String(fullName).trim(),
    String(email).trim().toLowerCase(),
    phoneClean,
    String(phoneCountry).trim().toUpperCase(),
    date,
    travelersCount,
    JSON.stringify(selection),
    priced.amount,
    priced.total,
    currencyCode,
    displayTotal,
    status
  );

  console.log(
    `[booking] ${status} ${id} · ${trip.title} · ${fullName} · ${phoneClean} · ${priced.total} MAD (${displayTotal} ${currencyCode})`
  );

  res.status(201).json({
    bookingId: id,
    status,
    unitPrice: priced.amount,
    totalAmount: priced.total,
    currency: "MAD",
    displayCurrency: currencyCode,
    displayTotal,
    tripTitle: trip.title,
    phone: phoneClean,
  });
});

router.get("/bookings/:id", (req, res) => {
  const b = db.prepare("SELECT * FROM bookings WHERE id = ?").get(req.params.id);
  if (!b) return res.status(404).json({ error: "Booking not found" });
  res.json({
    id: b.id,
    tripId: b.trip_id,
    tripTitle: b.trip_title,
    fullName: b.full_name,
    email: b.email,
    phone: b.phone,
    phoneCountry: b.phone_country,
    travelDate: b.travel_date,
    travelers: b.travelers,
    selection: JSON.parse(b.selection_json || "{}"),
    unitPrice: b.unit_price,
    totalAmount: b.total_amount,
    currency: b.currency,
    displayCurrency: b.display_currency || b.currency,
    displayTotal: b.display_total,
    status: b.status,
    paymentProvider: b.payment_provider,
    createdAt: b.created_at,
  });
});

// ——— Admin auth ———
router.post("/admin/login", (req, res) => {
  const { email, password } = req.body || {};
  const result = loginAdmin(email, password);
  if (!result) return res.status(401).json({ error: "Invalid credentials" });
  res.json(result);
});

router.get("/admin/me", requireAdmin, (req, res) => {
  res.json({ email: req.admin.email, id: req.admin.sub });
});

router.post("/admin/upload", requireAdmin, uploadTripImage);

// ——— Admin trips ———
router.get("/admin/trips", requireAdmin, (_req, res) => {
  const rows = db.prepare("SELECT * FROM trips ORDER BY updated_at DESC").all();
  res.json(rows.map(rowToTrip));
});

router.post("/admin/trips", requireAdmin, (req, res) => {
  const body = req.body || {};
  if (!body.title || !body.pricing || !body.category) {
    return res.status(400).json({ error: "title, category and pricing are required" });
  }
  const id = body.id || slugify(body.title);
  const exists = db.prepare("SELECT id FROM trips WHERE id = ?").get(id);
  if (exists) return res.status(409).json({ error: "Trip id already exists" });

  const trip = {
    id,
    title: body.title,
    shortDescription: body.shortDescription || "",
    description: body.description || "",
    category: body.category,
    duration: body.duration || "",
    durationLabel: body.durationLabel || body.duration || "",
    featured: !!body.featured,
    image: body.image || "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=1200&q=80",
    tags: body.tags || [],
    itinerary: body.itinerary || [],
    included: body.included || [],
    pricing: body.pricing,
    active: body.active !== false,
  };

  const r = tripToRow(trip);
  db.prepare(`
    INSERT INTO trips (
      id, title, short_description, description, category, duration, duration_label,
      featured, image, tags_json, itinerary_json, included_json, pricing_json,
      rating, review_count, active
    ) VALUES (
      @id, @title, @short_description, @description, @category, @duration, @duration_label,
      @featured, @image, @tags_json, @itinerary_json, @included_json, @pricing_json,
      @rating, @review_count, @active
    )
  `).run(r);

  res.status(201).json(rowToTrip(db.prepare("SELECT * FROM trips WHERE id = ?").get(id)));
});

router.put("/admin/trips/:id", requireAdmin, (req, res) => {
  const existing = db.prepare("SELECT * FROM trips WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Trip not found" });

  const prev = rowToTrip(existing);
  const body = req.body || {};
  const trip = {
    ...prev,
    ...body,
    id: prev.id,
    pricing: body.pricing || prev.pricing,
    tags: body.tags || prev.tags,
    itinerary: body.itinerary || prev.itinerary,
    included: body.included || prev.included,
  };

  const r = tripToRow(trip);
  db.prepare(`
    UPDATE trips SET
      title = @title,
      short_description = @short_description,
      description = @description,
      category = @category,
      duration = @duration,
      duration_label = @duration_label,
      featured = @featured,
      image = @image,
      tags_json = @tags_json,
      itinerary_json = @itinerary_json,
      included_json = @included_json,
      pricing_json = @pricing_json,
      rating = @rating,
      review_count = @review_count,
      active = @active,
      updated_at = datetime('now')
    WHERE id = @id
  `).run(r);

  res.json(rowToTrip(db.prepare("SELECT * FROM trips WHERE id = ?").get(prev.id)));
});

router.delete("/admin/trips/:id", requireAdmin, (req, res) => {
  // Soft delete — keep booking history
  const info = db.prepare("UPDATE trips SET active = 0, updated_at = datetime('now') WHERE id = ?").run(
    req.params.id
  );
  if (!info.changes) return res.status(404).json({ error: "Trip not found" });
  res.json({ ok: true });
});

// ——— Admin bookings ———
router.get("/admin/bookings", requireAdmin, (req, res) => {
  const { status } = req.query;
  let sql = "SELECT * FROM bookings";
  const params = [];
  if (status) {
    sql += " WHERE status = ?";
    params.push(status);
  }
  sql += " ORDER BY created_at DESC";
  const rows = db.prepare(sql).all(...params);
  res.json(
    rows.map((b) => ({
      id: b.id,
      tripId: b.trip_id,
      tripTitle: b.trip_title,
      fullName: b.full_name,
      email: b.email,
      phone: b.phone,
      phoneCountry: b.phone_country,
      travelDate: b.travel_date,
      travelers: b.travelers,
      selection: JSON.parse(b.selection_json || "{}"),
      unitPrice: b.unit_price,
      totalAmount: b.total_amount,
      currency: b.currency,
      displayCurrency: b.display_currency || b.currency,
      displayTotal: b.display_total,
      status: b.status,
      paymentProvider: b.payment_provider,
      paymentId: b.payment_id,
      notes: b.notes,
      createdAt: b.created_at,
      updatedAt: b.updated_at,
    }))
  );
});

router.patch("/admin/bookings/:id", requireAdmin, (req, res) => {
  const b = db.prepare("SELECT * FROM bookings WHERE id = ?").get(req.params.id);
  if (!b) return res.status(404).json({ error: "Booking not found" });
  const { status, notes } = req.body || {};
  db.prepare(`
    UPDATE bookings SET
      status = COALESCE(?, status),
      notes = COALESCE(?, notes),
      updated_at = datetime('now')
    WHERE id = ?
  `).run(status || null, notes != null ? notes : null, req.params.id);
  const updated = db.prepare("SELECT * FROM bookings WHERE id = ?").get(req.params.id);
  res.json({ id: updated.id, status: updated.status, notes: updated.notes });
});

router.get("/admin/stats", requireAdmin, (_req, res) => {
  const trips = db.prepare("SELECT COUNT(*) AS c FROM trips WHERE active = 1").get().c;
  const bookings = db.prepare("SELECT COUNT(*) AS c FROM bookings").get().c;
  const paid = db.prepare("SELECT COUNT(*) AS c FROM bookings WHERE status = 'paid'").get().c;
  const revenue = db.prepare(
    "SELECT COALESCE(SUM(total_amount),0) AS s FROM bookings WHERE status = 'paid'"
  ).get().s;
  res.json({ activeTrips: trips, bookings, paid, revenueMad: revenue });
});

module.exports = { router, startingPrice };

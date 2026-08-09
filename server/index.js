require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const { db, rowToTrip } = require("./db");
const { seedIfEmpty } = require("./seed");
const { router: apiRouter } = require("./routes");
const { router: paymentsRouter, stripeWebhookHandler } = require("./payments");
const { startingPrice, CATEGORIES } = require("./pricing");

seedIfEmpty();

const app = express();
const PORT = process.env.PORT || 3000;
const root = path.join(__dirname, "..");

const PAGE_FILES = {
  trips: "trips.html",
  about: "about.html",
  privacy: "privacy.html",
  "terms-of-use": "terms-of-use.html",
  "terms-conditions": "terms-conditions.html",
  "booking-success": "booking-success.html",
};

const RESERVED_SLUGS = new Set([
  ...Object.keys(PAGE_FILES),
  "admin",
  "api",
  "css",
  "js",
  "data",
  "uploads",
  "node_modules",
  "server",
  "assets",
  "favicon.ico",
  "robots.txt",
  "sitemap.xml",
]);

function sendPage(res, file) {
  res.sendFile(path.join(root, file));
}

function withQuery(req) {
  const idx = req.originalUrl.indexOf("?");
  return idx === -1 ? "" : req.originalUrl.slice(idx);
}

// Stripe webhook needs raw body — mount BEFORE json parser
app.post(
  "/api/payments/stripe/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhookHandler
);

app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRouter);
app.use("/api/payments", paymentsRouter);

// Dynamic sitemap for Google
app.get("/sitemap.xml", (_req, res) => {
  const site = process.env.SITE_URL || `http://localhost:${PORT}`;
  const trips = db.prepare("SELECT id, updated_at FROM trips WHERE active = 1").all();
  const staticPages = ["", "/trips", "/about", "/privacy", "/terms-of-use", "/terms-conditions"];
  let urls = staticPages
    .map(
      (p) =>
        `  <url><loc>${site}${p || "/"}</loc><changefreq>weekly</changefreq><priority>${p ? "0.8" : "1.0"}</priority></url>`
    )
    .join("\n");
  urls +=
    "\n" +
    trips
      .map(
        (t) =>
          `  <url><loc>${site}/${encodeURIComponent(t.id)}</loc><lastmod>${(t.updated_at || "").slice(0, 10)}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>`
      )
      .join("\n");

  res.type("application/xml").send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`);
});

app.get("/robots.txt", (_req, res) => {
  const site = process.env.SITE_URL || `http://localhost:${PORT}`;
  res.type("text/plain").send(`User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: ${site}/sitemap.xml
`);
});

// JSON-LD feed helper for a trip (also embedded client-side)
app.get("/api/trips/:id/schema", (req, res) => {
  const row = db.prepare("SELECT * FROM trips WHERE id = ? AND active = 1").get(req.params.id);
  if (!row) return res.status(404).json({ error: "Not found" });
  const trip = rowToTrip(row);
  const site = process.env.SITE_URL || `http://localhost:${PORT}`;
  const low = startingPrice(trip.pricing);
  res.json({
    "@context": "https://schema.org",
    "@type": ["Product", "TouristTrip"],
    name: trip.title,
    description: trip.shortDescription,
    image: trip.image,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: trip.rating,
      reviewCount: trip.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "MAD",
      price: low,
      availability: "https://schema.org/InStock",
      url: `${site}/${encodeURIComponent(trip.id)}`,
    },
  });
});

// Legacy HTML → clean URLs
app.get(["/index.html", "/index"], (req, res) => {
  res.redirect(301, `/${withQuery(req)}`);
});

app.get("/trip.html", (req, res) => {
  const id = typeof req.query.id === "string" ? req.query.id.trim() : "";
  if (id) {
    const params = new URLSearchParams();
    Object.entries(req.query).forEach(([key, value]) => {
      if (key === "id") return;
      if (Array.isArray(value)) value.forEach((v) => params.append(key, String(v)));
      else if (value != null) params.set(key, String(value));
    });
    const q = params.toString();
    return res.redirect(301, `/${encodeURIComponent(id)}${q ? `?${q}` : ""}`);
  }
  return res.redirect(301, "/trips");
});

app.get("/terms.html", (req, res) => {
  res.redirect(301, `/terms-conditions${withQuery(req)}`);
});

app.get("/:page.html", (req, res, next) => {
  const page = req.params.page;
  if (PAGE_FILES[page]) {
    return res.redirect(301, `/${page}${withQuery(req)}`);
  }
  return next();
});

// Clean page routes
app.get("/", (_req, res) => sendPage(res, "index.html"));

Object.entries(PAGE_FILES).forEach(([slug, file]) => {
  app.get(`/${slug}`, (_req, res) => sendPage(res, file));
});

app.use("/uploads", express.static(path.join(root, "uploads")));
app.use("/admin", express.static(path.join(root, "admin")));

// Trip detail: /:slug (domain + trip id)
app.get("/:slug", (req, res, next) => {
  const slug = req.params.slug;
  if (RESERVED_SLUGS.has(slug) || slug.includes(".")) return next();
  const row = db.prepare("SELECT id FROM trips WHERE id = ? AND active = 1").get(slug);
  if (!row) return next();
  return sendPage(res, "trip.html");
});

app.use(express.static(root, { index: false }));

app.use((req, res) => {
  res.status(404).type("text").send("Not found");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`excursionmarrakech running on port ${PORT}`);
  console.log(`Admin panel: /admin/`);
});

require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const { db, rowToTrip } = require("./db");
const { router: apiRouter } = require("./routes");
const { router: paymentsRouter, stripeWebhookHandler } = require("./payments");
const { startingPrice, CATEGORIES } = require("./pricing");

const app = express();
const PORT = process.env.PORT || 3000;
const root = path.join(__dirname, "..");

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
  const staticPages = [
    "",
    "/trips.html",
    "/about.html",
    "/privacy.html",
    "/terms-of-use.html",
    "/terms-conditions.html",
  ];
  let urls = staticPages
    .map(
      (p) => `  <url><loc>${site}${p || "/"}</loc><changefreq>weekly</changefreq><priority>${p ? "0.8" : "1.0"}</priority></url>`
    )
    .join("\n");
  urls +=
    "\n" +
    trips
      .map(
        (t) =>
          `  <url><loc>${site}/trip.html?id=${encodeURIComponent(t.id)}</loc><lastmod>${(t.updated_at || "").slice(0, 10)}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>`
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
      url: `${site}/trip.html?id=${trip.id}`,
    },
  });
});

app.use("/admin", express.static(path.join(root, "admin")));
app.use(express.static(root));

app.use((req, res) => {
  res.status(404).type("text").send("Not found");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`excursionmarrakech running on port ${PORT}`);
  console.log(`Admin panel: /admin/`);
});

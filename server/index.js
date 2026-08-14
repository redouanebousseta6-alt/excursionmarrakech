require("dotenv").config();
const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
const { db, rowToTrip } = require("./db");
const { seedIfEmpty } = require("./seed");
const { router: apiRouter } = require("./routes");
const { router: paymentsRouter, stripeWebhookHandler } = require("./payments");
const { startingPrice, CATEGORIES } = require("./pricing");
const { buildTripSchema, withCrawlerSeo } = require("./seo");

seedIfEmpty();

const app = express();
const PORT = process.env.PORT || 3000;
const root = path.join(__dirname, "..");
/** Bump on frontend deploys so browsers skip stale CSS/JS (7d cache). */
const ASSET_VERSION = process.env.ASSET_VERSION || "20260814c";

const PAGE_FILES = {
  trips: "trips.html",
  about: "about.html",
  privacy: "privacy.html",
  "terms-of-use": "terms-of-use.html",
  "terms-conditions": "terms-conditions.html",
  "booking-success": "booking-success.html",
  "airport-transfer": "airport-transfer.html",
  search: "search.html",
};

const RESERVED_SLUGS = new Set([
  ...Object.keys(PAGE_FILES),
  "admin",
  "api",
  "css",
  "js",
  "data",
  "uploads",
  "images",
  "node_modules",
  "server",
  "assets",
  "favicon.ico",
  "robots.txt",
  "sitemap.xml",
]);

function withAssetVersion(html) {
  return html.replace(
    /(href|src)="(\/?((?:css|js|fonts)\/[^"?]+)\.(?:css|js))"/g,
    (_, attr, url) => `${attr}="${url}?v=${ASSET_VERSION}"`
  );
}

/** Favicon + PWA links for browser tabs and Google Search results. */
function withSeoIcons(html) {
  if (/rel=["']icon["']/i.test(html)) return html;
  const v = ASSET_VERSION;
  const links = [
    `<link rel="icon" href="/favicon.ico" sizes="any" />`,
    `<link rel="icon" href="/favicon.svg?v=${v}" type="image/svg+xml" />`,
    `<link rel="icon" type="image/png" sizes="48x48" href="/favicon-48.png?v=${v}" />`,
    `<link rel="icon" type="image/png" sizes="96x96" href="/favicon-96.png?v=${v}" />`,
    `<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=${v}" />`,
    `<link rel="manifest" href="/site.webmanifest?v=${v}" />`,
    `<meta name="theme-color" content="#c45c26" />`,
    `<meta name="msapplication-TileColor" content="#c45c26" />`,
  ].join("\n    ");
  return html.replace(/<\/head>/i, `    ${links}\n  </head>`);
}

function sendPage(res, file, req) {
  const htmlPath = path.join(root, file);
  let html = fs.readFileSync(htmlPath, "utf8");
  const pathName = (req && req.path) || "/";
  const langParam = req && req.query && typeof req.query.lang === "string" ? req.query.lang : "en";
  const lang = ["en", "fr", "de", "es", "ar"].includes(langParam) ? langParam : "en";
  html = withCrawlerSeo(html, { path: pathName, lang });
  html = withAssetVersion(withSeoIcons(html));
  res.setHeader("Cache-Control", "no-cache");
  res.type("html").send(html);
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
  const staticPages = [
    "",
    "/trips",
    "/search",
    "/about",
    "/airport-transfer",
    "/privacy",
    "/terms-of-use",
    "/terms-conditions",
  ];
  let urls = staticPages
    .map(
      (p) =>
        `  <url><loc>${site}${p || "/"}</loc><changefreq>weekly</changefreq><priority>${
          p === ""
            ? "1.0"
            : p === "/airport-transfer" || p === "/trips" || p === "/search"
              ? "0.9"
              : "0.8"
        }</priority></url>`
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
  res.json(buildTripSchema(trip, { site, lowPrice: low }));
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
app.get("/", (req, res) => sendPage(res, "index.html", req));

Object.entries(PAGE_FILES).forEach(([slug, file]) => {
  app.get(`/${slug}`, (req, res) => sendPage(res, file, req));
});

app.use("/uploads", express.static(path.join(root, "uploads")));
app.use("/admin", express.static(path.join(root, "admin")));

// Trip detail: /:slug (domain + trip id)
app.get("/:slug", (req, res, next) => {
  const slug = req.params.slug;
  if (RESERVED_SLUGS.has(slug) || slug.includes(".")) return next();
  const row = db.prepare("SELECT id FROM trips WHERE id = ? AND active = 1").get(slug);
  if (!row) return next();
  return sendPage(res, "trip.html", req);
});

app.use(
  express.static(root, {
    index: false,
    maxAge: "7d",
    setHeaders(res, filePath) {
      if (/\.webmanifest$/i.test(filePath)) {
        res.setHeader("Content-Type", "application/manifest+json; charset=utf-8");
        res.setHeader("Cache-Control", "public, max-age=86400");
      } else if (/\.(?:ico)$/i.test(filePath)) {
        res.setHeader("Cache-Control", "public, max-age=604800");
      } else if (/\.(?:webp|avif|jpe?g|png|gif|svg|woff2)$/i.test(filePath)) {
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      } else if (/\.(?:css|js)$/i.test(filePath)) {
        // Long-lived only when URL is versioned (?v=); unversioned stays short.
        const versioned = String((res.req && res.req.query && res.req.query.v) || "");
        res.setHeader(
          "Cache-Control",
          versioned
            ? "public, max-age=604800, immutable"
            : "public, max-age=300, must-revalidate"
        );
      }
    },
  })
);

app.use((req, res) => {
  res.status(404).type("text").send("Not found");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`excursionmarrakech running on port ${PORT}`);
  console.log(`Admin panel: /admin/`);
});

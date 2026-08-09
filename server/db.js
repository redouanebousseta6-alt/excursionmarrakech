const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");

const dataDir = path.join(__dirname, "..", "data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, "store.db");
const db = new Database(dbPath);

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS trips (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    short_description TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    duration TEXT NOT NULL,
    duration_label TEXT NOT NULL,
    featured INTEGER NOT NULL DEFAULT 0,
    image TEXT NOT NULL,
    tags_json TEXT NOT NULL DEFAULT '[]',
    itinerary_json TEXT NOT NULL DEFAULT '[]',
    included_json TEXT NOT NULL DEFAULT '[]',
    pricing_json TEXT NOT NULL,
    rating REAL NOT NULL DEFAULT 4.8,
    review_count INTEGER NOT NULL DEFAULT 24,
    active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id TEXT PRIMARY KEY,
    trip_id TEXT NOT NULL,
    trip_title TEXT NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    phone_country TEXT,
    travel_date TEXT NOT NULL,
    travelers INTEGER NOT NULL,
    selection_json TEXT NOT NULL DEFAULT '{}',
    unit_price INTEGER NOT NULL,
    total_amount INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'MAD',
    display_currency TEXT NOT NULL DEFAULT 'MAD',
    display_total REAL,
    status TEXT NOT NULL DEFAULT 'inquiry',
    payment_provider TEXT,
    payment_id TEXT,
    notes TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (trip_id) REFERENCES trips(id)
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`);

// Migrations for existing DBs
const bookingCols = db.prepare("PRAGMA table_info(bookings)").all().map((c) => c.name);
function addBookingCol(name, ddl) {
  if (!bookingCols.includes(name)) {
    db.exec(`ALTER TABLE bookings ADD COLUMN ${ddl}`);
  }
}
addBookingCol("phone", "phone TEXT");
addBookingCol("phone_country", "phone_country TEXT");
addBookingCol("display_currency", "display_currency TEXT DEFAULT 'MAD'");
addBookingCol("display_total", "display_total REAL");

const tripCols = db.prepare("PRAGMA table_info(trips)").all().map((c) => c.name);
function addTripCol(name, ddl) {
  if (!tripCols.includes(name)) {
    db.exec(`ALTER TABLE trips ADD COLUMN ${ddl}`);
  }
}
addTripCol("rating", "rating REAL NOT NULL DEFAULT 4.8");
addTripCol("review_count", "review_count INTEGER NOT NULL DEFAULT 24");

function rowToTrip(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    shortDescription: row.short_description,
    description: row.description,
    category: row.category,
    duration: row.duration,
    durationLabel: row.duration_label,
    featured: !!row.featured,
    image: row.image,
    tags: JSON.parse(row.tags_json || "[]"),
    itinerary: JSON.parse(row.itinerary_json || "[]"),
    included: JSON.parse(row.included_json || "[]"),
    pricing: JSON.parse(row.pricing_json),
    rating: row.rating != null ? Number(row.rating) : 4.8,
    reviewCount: row.review_count != null ? Number(row.review_count) : 24,
    active: !!row.active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function tripToRow(trip) {
  return {
    id: trip.id,
    title: trip.title,
    short_description: trip.shortDescription || trip.short_description || "",
    description: trip.description || "",
    category: trip.category,
    duration: trip.duration || "",
    duration_label: trip.durationLabel || trip.duration_label || trip.duration || "",
    featured: trip.featured ? 1 : 0,
    image: trip.image || "",
    tags_json: JSON.stringify(trip.tags || []),
    itinerary_json: JSON.stringify(trip.itinerary || []),
    included_json: JSON.stringify(trip.included || []),
    pricing_json: JSON.stringify(trip.pricing),
    rating: trip.rating != null ? Number(trip.rating) : 4.8,
    review_count: trip.reviewCount != null ? Number(trip.reviewCount) : trip.review_count != null ? Number(trip.review_count) : 24,
    active: trip.active === false ? 0 : 1,
  };
}

module.exports = { db, rowToTrip, tripToRow, dbPath };

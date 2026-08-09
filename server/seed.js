require("dotenv").config();
const bcrypt = require("bcryptjs");
const path = require("path");
const { db, tripToRow } = require("./db");

// data.js expects window in browser — provide a shim for Node
global.window = global.window || {};
const EM = require(path.join(__dirname, "..", "js", "data.js"));

function seed() {
  const email = process.env.ADMIN_EMAIL || "admin@excursionmarrakech.com";
  const password = process.env.ADMIN_PASSWORD || "Admin123!";

  const existingAdmin = db.prepare("SELECT id FROM admins WHERE email = ?").get(email);
  if (!existingAdmin) {
    const hash = bcrypt.hashSync(password, 10);
    db.prepare("INSERT INTO admins (email, password_hash) VALUES (?, ?)").run(email, hash);
    console.log("Admin created:", email);
  } else {
    console.log("Admin already exists:", email);
  }

  const upsert = db.prepare(`
    INSERT INTO trips (
      id, title, short_description, description, category, duration, duration_label,
      featured, image, tags_json, itinerary_json, included_json, pricing_json,
      rating, review_count, active
    ) VALUES (
      @id, @title, @short_description, @description, @category, @duration, @duration_label,
      @featured, @image, @tags_json, @itinerary_json, @included_json, @pricing_json,
      @rating, @review_count, @active
    )
    ON CONFLICT(id) DO UPDATE SET
      title = excluded.title,
      short_description = excluded.short_description,
      description = excluded.description,
      category = excluded.category,
      duration = excluded.duration,
      duration_label = excluded.duration_label,
      featured = excluded.featured,
      image = excluded.image,
      tags_json = excluded.tags_json,
      itinerary_json = excluded.itinerary_json,
      included_json = excluded.included_json,
      pricing_json = excluded.pricing_json,
      rating = excluded.rating,
      review_count = excluded.review_count,
      active = excluded.active,
      updated_at = datetime('now')
  `);

  const tx = db.transaction((trips) => {
    for (const trip of trips) upsert.run(tripToRow(trip));
  });

  tx(EM.TRIPS);
  console.log(`Seeded ${EM.TRIPS.length} trips`);

  const defaults = {
    site_name: "excursionmarrakech",
    site_tagline: "Premium Marrakech Excursions & Desert Tours",
    contact_email: "silversandstravels@gmail.com",
    contact_phone: "+212 639 996 960",
    currency_rates: JSON.stringify({ MAD: 1, USD: 10, EUR: 10.8, GBP: 12.5 }),
  };
  const setSetting = db.prepare(
    "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO NOTHING"
  );
  for (const [k, v] of Object.entries(defaults)) setSetting.run(k, v);
  console.log("Settings ready");
}

seed();

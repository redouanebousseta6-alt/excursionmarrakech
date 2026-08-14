const crypto = require("crypto");
const { db } = require("./db");

/** Unambiguous alphabet (no 0/O, 1/I/L) for phone-friendly refs */
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

/**
 * Short booking reference, e.g. EM-7K2M9Q
 */
function createBookingId(prefix = "EM") {
  for (let attempt = 0; attempt < 12; attempt++) {
    let body = "";
    const bytes = crypto.randomBytes(6);
    for (let i = 0; i < 6; i++) {
      body += ALPHABET[bytes[i] % ALPHABET.length];
    }
    const id = `${prefix}-${body}`;
    const exists = db.prepare("SELECT 1 FROM bookings WHERE id = ?").get(id);
    if (!exists) return id;
  }
  // Extremely unlikely fallback
  return `${prefix}-${Date.now().toString(36).toUpperCase().slice(-6)}`;
}

module.exports = { createBookingId };

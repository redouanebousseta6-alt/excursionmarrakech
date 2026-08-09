const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { db } = require("./db");

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

function signAdmin(admin) {
  return jwt.sign({ sub: admin.id, email: admin.email, role: "admin" }, JWT_SECRET, {
    expiresIn: "7d",
  });
}

function requireAdmin(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    req.admin = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

function loginAdmin(email, password) {
  const admin = db.prepare("SELECT * FROM admins WHERE email = ?").get(email);
  if (!admin) return null;
  if (!bcrypt.compareSync(password, admin.password_hash)) return null;
  return { id: admin.id, email: admin.email, token: signAdmin(admin) };
}

module.exports = { requireAdmin, loginAdmin, JWT_SECRET };

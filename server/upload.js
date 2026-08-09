const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { randomUUID } = require("crypto");

const uploadsDir = path.join(__dirname, "..", "uploads");
fs.mkdirSync(uploadsDir, { recursive: true });

const ALLOWED_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    const safeExt = ALLOWED_EXT.has(ext) ? ext : ".jpg";
    cb(null, `${Date.now()}-${randomUUID().slice(0, 8)}${safeExt}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME.has(file.mimetype)) {
      return cb(new Error("Only JPEG, PNG, WebP, or GIF images are allowed"));
    }
    cb(null, true);
  },
});

function uploadTripImage(req, res) {
  upload.single("image")(req, res, (err) => {
    if (err) {
      const msg = err instanceof multer.MulterError
        ? err.code === "LIMIT_FILE_SIZE"
          ? "Image must be 8MB or smaller"
          : err.message
        : err.message || "Upload failed";
      return res.status(400).json({ error: msg });
    }
    if (!req.file) return res.status(400).json({ error: "No image file uploaded" });
    return res.json({
      url: `/uploads/${req.file.filename}`,
      filename: req.file.filename,
      size: req.file.size,
    });
  });
}

module.exports = { uploadTripImage, uploadsDir };

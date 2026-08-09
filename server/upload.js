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
  limits: { fileSize: 8 * 1024 * 1024, files: 12 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME.has(file.mimetype)) {
      return cb(new Error("Only JPEG, PNG, WebP, or GIF images are allowed"));
    }
    cb(null, true);
  },
});

function uploadTripImage(req, res) {
  upload.fields([
    { name: "images", maxCount: 12 },
    { name: "image", maxCount: 1 },
  ])(req, res, (err) => {
    if (err) {
      const msg =
        err instanceof multer.MulterError
          ? err.code === "LIMIT_FILE_SIZE"
            ? "Each image must be 8MB or smaller"
            : err.code === "LIMIT_FILE_COUNT"
              ? "You can upload up to 12 images at once"
              : err.message
          : err.message || "Upload failed";
      return res.status(400).json({ error: msg });
    }
    const files = [...(req.files?.images || []), ...(req.files?.image || [])];
    if (!files.length) return res.status(400).json({ error: "No image file uploaded" });
    const urls = files.map((file) => `/uploads/${file.filename}`);
    return res.json({
      urls,
      url: urls[0],
      files: files.map((file) => ({ filename: file.filename, size: file.size, url: `/uploads/${file.filename}` })),
    });
  });
}

module.exports = { uploadTripImage, uploadsDir };

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const config = require('../config');

// Ensure uploads folder exists
if (!fs.existsSync(config.UPLOADS_DIR)) {
  fs.mkdirSync(config.UPLOADS_DIR, { recursive: true });
}

// Storage setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, config.UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanBase = path.basename(file.originalname, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e4)}`;
    cb(null, `${cleanBase || 'device'}-${uniqueSuffix}${ext}`);
  }
});

// File filter (accept common image formats)
const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|gif/;
  const mimeValid = allowed.test(file.mimetype);
  const extValid = allowed.test(path.extname(file.originalname).toLowerCase());

  if (mimeValid && extValid) {
    return cb(null, true);
  }
  cb(new Error('Only image files (JPG, PNG, WEBP) are allowed!'));
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: fileFilter
});

module.exports = upload;

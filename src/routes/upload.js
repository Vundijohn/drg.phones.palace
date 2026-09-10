const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { requireAdminAuth } = require('../middleware/auth');
const { admin } = require('../firebase');
const config = require('../config');

// Protected: POST /api/upload
router.post('/', requireAdminAuth, (req, res) => {
  upload.single('image')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || 'File upload failed'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded. Form field must be named "image".'
      });
    }

    let fileUrl = `uploads/${req.file.filename}`;

    // Optionally attempt upload to Firebase Storage if Admin SDK is active
    if (admin && admin.apps && admin.apps.length > 0) {
      try {
        const bucket = admin.storage().bucket();
        if (bucket) {
          const destination = `phones/${req.file.filename}`;
          await bucket.upload(req.file.path, {
            destination,
            metadata: { contentType: req.file.mimetype }
          });
          console.log(`[Firebase Storage] Uploaded ${destination}`);
        }
      } catch (storageErr) {
        // Fallback to local upload URL if bucket permissions aren't set
        console.warn(`[Firebase Storage] Cloud bucket upload skipped: ${storageErr.message}`);
      }
    }

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      url: fileUrl,
      filename: req.file.filename,
      size: req.file.size
    });
  });
});

module.exports = router;

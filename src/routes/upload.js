const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { requireAdminAuth } = require('../middleware/auth');
const { admin } = require('../firebase');
const config = require('../config');

// Protected: POST /api/upload
router.post('/', requireAdminAuth, (req, res) => {
  upload.array('image', 12)(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || 'File upload failed'
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded. Form field must be named "image".'
      });
    }

    const uploadedFiles = req.files;
    const fileUrls = uploadedFiles.map(file => `uploads/${file.filename}`);

    // Optionally attempt upload to Firebase Storage if Admin SDK is active
    if (admin && admin.apps && admin.apps.length > 0) {
      try {
        const bucket = admin.storage().bucket();
        if (bucket) {
          for (const file of uploadedFiles) {
            const destination = `phones/${file.filename}`;
            await bucket.upload(file.path, {
              destination,
              metadata: { contentType: file.mimetype }
            });
            console.log(`[Firebase Storage] Uploaded ${destination}`);
          }
        }
      } catch (storageErr) {
        // Fallback to local upload URL if bucket permissions aren't set
        console.warn(`[Firebase Storage] Cloud bucket upload skipped: ${storageErr.message}`);
      }
    }

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      url: fileUrls[0],
      urls: fileUrls,
      filenames: uploadedFiles.map(file => file.filename),
      size: uploadedFiles.reduce((total, file) => total + file.size, 0)
    });
  });
});

module.exports = router;

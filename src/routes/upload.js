const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { requireAdminAuth } = require('../middleware/auth');

// Protected: POST /api/upload
router.post('/', requireAdminAuth, (req, res) => {
  upload.single('image')(req, res, (err) => {
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

    // Return the relative URL path served statically by Express
    const fileUrl = `uploads/${req.file.filename}`;

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

const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAdminAuth } = require('../middleware/auth');

// Public: GET /api/settings
router.get('/', (req, res) => {
  try {
    const settings = db.getSettings();
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Protected: PUT /api/settings
router.put('/', requireAdminAuth, (req, res) => {
  try {
    const updated = db.updateSettings(req.body);
    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

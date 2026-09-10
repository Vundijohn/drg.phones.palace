const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config');
const db = require('../db');
const { requireAdminAuth } = require('../middleware/auth');

// Public: POST /api/admin/login
router.post('/login', async (req, res) => {
  try {
    const { pin } = req.body;
    if (!pin) {
      return res.status(400).json({ success: false, message: 'Admin PIN is required' });
    }

    const isValid = await db.verifyAdminPin(pin);
    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Invalid admin PIN' });
    }

    // Generate JWT
    const token = jwt.sign(
      { role: 'admin', timestamp: Date.now() },
      config.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Admin authentication successful',
      token,
      expiresIn: '24h'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Protected: GET /api/admin/verify
router.get('/verify', requireAdminAuth, (req, res) => {
  res.json({
    success: true,
    authenticated: true,
    message: 'Session is valid'
  });
});

// Protected: POST /api/admin/change-pin
router.post('/change-pin', requireAdminAuth, async (req, res) => {
  try {
    const { currentPin, newPin } = req.body;
    if (!currentPin || !newPin) {
      return res.status(400).json({
        success: false,
        message: 'Both currentPin and newPin are required.'
      });
    }

    if (String(newPin).length < 4) {
      return res.status(400).json({
        success: false,
        message: 'New PIN must be at least 4 digits.'
      });
    }

    const isCurrentValid = await db.verifyAdminPin(currentPin);
    if (!isCurrentValid) {
      return res.status(401).json({
        success: false,
        message: 'Current PIN is incorrect.'
      });
    }

    await db.setAdminPin(newPin);

    res.json({
      success: true,
      message: 'Admin security PIN changed successfully.'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Protected: GET /api/admin/stats
router.get('/stats', requireAdminAuth, async (req, res) => {
  try {
    const stats = await db.getStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Public: GET /api/admin/status (Returns database mode & Firebase info)
router.get('/status', async (req, res) => {
  try {
    const status = await db.getStatus();
    res.json({
      success: true,
      ...status
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

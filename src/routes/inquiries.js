const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAdminAuth } = require('../middleware/auth');

// Public: POST /api/inquiries
router.post('/', async (req, res) => {
  try {
    const { phoneId, model, storage, planKey, planLabel, cashPrice } = req.body;
    const inquiry = await db.createInquiry({
      phoneId,
      model,
      storage,
      planKey,
      planLabel,
      cashPrice,
      userAgent: req.headers['user-agent'] || '',
      ip: req.ip || req.connection.remoteAddress || ''
    });

    res.status(201).json({
      success: true,
      message: 'Inquiry registered',
      data: inquiry
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Protected: GET /api/inquiries
router.get('/', requireAdminAuth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 50;
    const list = await db.getInquiries(limit);
    res.json({
      success: true,
      count: list.length,
      data: list
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

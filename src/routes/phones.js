const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAdminAuth } = require('../middleware/auth');

// Public: GET /api/phones
router.get('/', (req, res) => {
  try {
    const { category, search } = req.query;
    const phones = db.getAllPhones({ category, search });
    res.json({
      success: true,
      count: phones.length,
      data: phones
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Public: GET /api/phones/:id
router.get('/:id', (req, res) => {
  try {
    const phone = db.getPhoneById(req.params.id);
    if (!phone) {
      return res.status(404).json({ success: false, message: 'Device not found' });
    }
    res.json({ success: true, data: phone });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Protected: POST /api/phones (Add new phone)
router.post('/', requireAdminAuth, (req, res) => {
  try {
    const { model, category, cashPrice, plans } = req.body;
    if (!model || !category || !cashPrice || !plans) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: model, category, cashPrice, plans'
      });
    }

    const created = db.createPhone(req.body);
    res.status(201).json({
      success: true,
      message: 'Phone added to catalogue successfully',
      data: created
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Protected: PUT /api/phones/:id (Edit phone)
router.put('/:id', requireAdminAuth, (req, res) => {
  try {
    const updated = db.updatePhone(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Device not found' });
    }
    res.json({
      success: true,
      message: 'Phone updated successfully',
      data: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Protected: DELETE /api/phones/:id (Delete phone)
router.delete('/:id', requireAdminAuth, (req, res) => {
  try {
    const removed = db.deletePhone(req.params.id);
    if (!removed) {
      return res.status(404).json({ success: false, message: 'Device not found' });
    }
    res.json({
      success: true,
      message: `Deleted ${removed.model} (${removed.storage || ''}) successfully`,
      data: removed
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Protected: POST /api/phones/reset (Restore defaults)
router.post('/reset', requireAdminAuth, (req, res) => {
  try {
    const phones = db.resetPhones();
    res.json({
      success: true,
      message: 'Catalogue restored to defaults',
      count: phones.length,
      data: phones
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Protected: POST /api/phones/import (Bulk import)
router.post('/import', requireAdminAuth, (req, res) => {
  try {
    const { phones } = req.body;
    if (!Array.isArray(phones) || phones.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Request body must include an array of phones under key "phones".'
      });
    }
    const imported = db.importPhones(phones);
    res.json({
      success: true,
      message: `Imported ${imported.length} phones successfully`,
      count: imported.length,
      data: imported
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

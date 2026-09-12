const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config');
const db = require('../db');
const { requireAdminAuth } = require('../middleware/auth');

// Public: POST /api/admin/register (Create Admin Account)
router.post('/register', async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required.'
      });
    }

    const passwordText = String(password);
    const passwordIsStrong = passwordText.length >= 8
      && /[A-Z]/.test(passwordText)
      && /[a-z]/.test(passwordText)
      && /\d/.test(passwordText);

    if (!passwordIsStrong) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters and include an uppercase letter, a lowercase letter, and a number.'
      });
    }

    const newAccount = await db.createAdminAccount({ name, username, email, password });

    const token = jwt.sign(
      {
        role: 'admin',
        userId: newAccount.id,
        username: newAccount.username,
        name: newAccount.name
      },
      config.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: `Admin account "${newAccount.username}" created successfully!`,
      token,
      user: newAccount
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Public: POST /api/admin/login (Support username+password or PIN)
router.post('/login', async (req, res) => {
  try {
    const { username, password, pin } = req.body;

    // 1. Check Username / Password login
    if (username && password) {
      const user = await db.verifyAdminAccount(username, password);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid username or password.'
        });
      }

      const token = jwt.sign(
        {
          role: 'admin',
          userId: user.id,
          username: user.username,
          name: user.name
        },
        config.JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.json({
        success: true,
        message: `Welcome back, ${user.name || user.username}!`,
        token,
        user
      });
    }

    // 2. Fallback to PIN login
    const pinToTest = pin || password;
    if (pinToTest) {
      const isValid = await db.verifyAdminPin(pinToTest);
      if (isValid) {
        const token = jwt.sign(
          { role: 'admin', username: 'admin', name: 'Store Administrator' },
          config.JWT_SECRET,
          { expiresIn: '7d' }
        );

        return res.json({
          success: true,
          message: 'Admin authentication successful',
          token,
          user: { username: 'admin', name: 'Store Administrator' }
        });
      }
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid credentials. Please check your username and password.'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Protected: GET /api/admin/me
router.get('/me', requireAdminAuth, (req, res) => {
  res.json({
    success: true,
    user: req.admin
  });
});

// Protected: GET /api/admin/verify
router.get('/verify', requireAdminAuth, (req, res) => {
  res.json({
    success: true,
    authenticated: true,
    user: req.admin,
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

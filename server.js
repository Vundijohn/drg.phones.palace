const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./src/config');

// Routes
const phonesRouter = require('./src/routes/phones');
const adminRouter = require('./src/routes/admin');
const inquiriesRouter = require('./src/routes/inquiries');
const uploadRouter = require('./src/routes/upload');
const settingsRouter = require('./src/routes/settings');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file hosting
app.use('/uploads', express.static(config.UPLOADS_DIR));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.static(path.join(__dirname))); // Serves index.html, admin.html, styles, etc.

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: 'DRG Phones Palace API'
  });
});

// API Routes
app.use('/api/phones', phonesRouter);
app.use('/api/admin', adminRouter);
app.use('/api/inquiries', inquiriesRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/settings', settingsRouter);

// 404 handler for unmatched API routes
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.method} ${req.originalUrl} not found`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start Server
const server = app.listen(config.PORT, () => {
  console.log(`=============================================`);
  console.log(`🚀 DRG Phones Palace Server running!`);
  console.log(`🌐 Public Website:  http://localhost:${config.PORT}/`);
  console.log(`👑 Admin Dashboard: http://localhost:${config.PORT}/admin.html`);
  console.log(`⚡ API Health:      http://localhost:${config.PORT}/api/health`);
  console.log(`=============================================`);
});

module.exports = { app, server };

const path = require('path');
require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 3000,
  JWT_SECRET: process.env.JWT_SECRET || 'drg_phones_palace_super_secret_jwt_key_2026',
  ADMIN_DEFAULT_PIN: process.env.ADMIN_DEFAULT_PIN || '2540',
  WHATSAPP_NUMBER: process.env.WHATSAPP_NUMBER || '254797951374',
  DATA_DIR: path.join(__dirname, '..', 'data'),
  UPLOADS_DIR: path.join(__dirname, '..', 'uploads')
};

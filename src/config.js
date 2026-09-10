const path = require('path');
require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 3000,
  JWT_SECRET: process.env.JWT_SECRET || 'drg_phones_palace_super_secret_jwt_key_2026',
  ADMIN_DEFAULT_PIN: process.env.ADMIN_DEFAULT_PIN || '2540',
  WHATSAPP_NUMBER: process.env.WHATSAPP_NUMBER || '254797951374',
  DATA_DIR: path.join(__dirname, '..', 'data'),
  UPLOADS_DIR: path.join(__dirname, '..', 'uploads'),
  USE_FIREBASE: process.env.USE_FIREBASE === 'true' || process.env.USE_FIREBASE === '1',
  FIREBASE_SERVICE_ACCOUNT_PATH: process.env.FIREBASE_SERVICE_ACCOUNT_PATH || path.join(__dirname, '..', 'serviceAccountKey.json'),
  firebaseConfig: {
    apiKey: process.env.FIREBASE_API_KEY || 'AIzaSyDj-I8oO-JKXLXdmK-nJuw3pIrCKLpjeNw',
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || 'phones-3355c.firebaseapp.com',
    projectId: process.env.FIREBASE_PROJECT_ID || 'phones-3355c',
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'phones-3355c.firebasestorage.app',
    databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://phones-3355c-default-rtdb.firebaseio.com/',
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '812106459053',
    appId: process.env.FIREBASE_APP_ID || '1:812106459053:web:efbff10513c9abd7406324',
    measurementId: process.env.FIREBASE_MEASUREMENT_ID || 'G-E2NF0RZQWJ'
  }
};


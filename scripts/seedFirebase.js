/**
 * DRG Phones Palace — Firebase Seeder
 * Seeds default phones catalogue, admin PIN, and settings into
 * Firebase Realtime Database and Cloud Firestore.
 * 
 * Usage: npm run firebase:seed
 */

const path = require('path');
require('dotenv').config();

const config = require('../src/config');
const { DEFAULT_PHONES } = require('../data/seedData');
const {
  rtdbOps,
  firestoreOps,
  testRtdbAccess,
  testFirestoreAccess
} = require('../src/firebase');
const bcrypt = require('bcryptjs');

async function seed() {
  console.log(`=============================================================`);
  console.log(`🚀 Starting DRG Phones Palace Firebase Seeding...`);
  console.log(`📦 Project ID:   ${config.firebaseConfig.projectId}`);
  if (config.firebaseConfig.databaseURL) {
    console.log(`🌐 RTDB URL:     ${config.firebaseConfig.databaseURL}`);
  }
  console.log(`=============================================================`);

  const isRtdb = await testRtdbAccess();
  const isFirestore = await testFirestoreAccess();

  if (!isRtdb && !isFirestore) {
    console.error(`\n❌ Could not connect with write permissions to Firebase.`);
    console.error(`\n👉 FOR FIREBASE REALTIME DATABASE:`);
    console.error(`   1. Open: https://console.firebase.google.com/project/${config.firebaseConfig.projectId}/database`);
    console.error(`   2. Click the "Rules" tab and paste:`);
    console.error(`      {`);
    console.error(`        "rules": {`);
    console.error(`          ".read": true,`);
    console.error(`          ".write": true`);
    console.error(`        }`);
    console.error(`      }`);
    console.error(`   3. Click "Publish".`);
    console.error(`\n👉 OR DOWNLOAD SERVICE ACCOUNT KEY:`);
    console.error(`   1. Go to Project Settings -> Service Accounts -> Generate new private key.`);
    console.error(`   2. Save as "serviceAccountKey.json" in project root for full admin access.`);
    console.error(`\n=============================================================\n`);
    process.exit(1);
  }

  const salt = bcrypt.genSaltSync(10);
  const pinHash = bcrypt.hashSync(config.ADMIN_DEFAULT_PIN, salt);
  const now = new Date().toISOString();

  // 1. Seed Realtime Database if accessible
  if (isRtdb) {
    console.log(`\n📡 Seeding into Firebase Realtime Database...`);
    const phoneMap = {};
    for (const phone of DEFAULT_PHONES) {
      phoneMap[phone.id] = { ...phone, updatedAt: now };
    }
    await rtdbOps.set('phones', phoneMap);
    console.log(`   ✓ Seeded ${DEFAULT_PHONES.length} devices to /phones`);

    await rtdbOps.set('admin/security', {
      pinHash,
      updatedAt: now
    });
    console.log(`   ✓ Seeded Admin PIN to /admin/security (Default: ${config.ADMIN_DEFAULT_PIN})`);

    await rtdbOps.set('settings/general', {
      whatsappNumber: config.WHATSAPP_NUMBER,
      storeName: 'DRG Phones Palace',
      location: 'Nairobi, Kenya',
      updatedAt: now
    });
    console.log(`   ✓ Seeded Store Settings to /settings/general`);
  }

  // 2. Seed Cloud Firestore if accessible
  if (isFirestore) {
    console.log(`\n🔥 Seeding into Google Cloud Firestore...`);
    for (const phone of DEFAULT_PHONES) {
      await firestoreOps.setDoc('phones', phone.id, {
        ...phone,
        updatedAt: now
      });
    }
    console.log(`   ✓ Seeded ${DEFAULT_PHONES.length} devices to collection "phones"`);

    await firestoreOps.setDoc('admin', 'security', {
      pinHash,
      updatedAt: now
    });
    console.log(`   ✓ Seeded Admin PIN to collection "admin" (doc: "security")`);

    await firestoreOps.setDoc('settings', 'general', {
      whatsappNumber: config.WHATSAPP_NUMBER,
      storeName: 'DRG Phones Palace',
      location: 'Nairobi, Kenya',
      updatedAt: now
    });
    console.log(`   ✓ Seeded Store Settings to collection "settings" (doc: "general")`);
  }

  console.log(`\n=============================================================`);
  console.log(`🎉 Firebase Database successfully seeded!`);
  console.log(`📱 ${DEFAULT_PHONES.length} Devices active in inventory`);
  console.log(`👑 Admin & Store Configuration applied`);
  console.log(`=============================================================\n`);
  process.exit(0);
}

seed().catch(err => {
  console.error(`\n❌ Error during seeding:`, err.message);
  process.exit(1);
});

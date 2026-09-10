/**
 * DRG Phones Palace — Firebase Firestore Seeder
 * Seeds default phones catalogue, admin PIN, and settings into Cloud Firestore.
 * 
 * Usage: npm run firebase:seed
 */

const path = require('path');
require('dotenv').config();

const config = require('../src/config');
const { DEFAULT_PHONES } = require('../data/seedData');
const { firestoreOps, testFirestoreAccess } = require('../src/firebase');
const bcrypt = require('bcryptjs');

async function seed() {
  console.log(`=============================================================`);
  console.log(`🚀 Starting DRG Phones Palace Firebase Firestore Seeding...`);
  console.log(`📦 Target Project ID: ${config.firebaseConfig.projectId}`);
  console.log(`=============================================================`);

  // Verify connection
  const ready = await testFirestoreAccess();
  if (!ready) {
    console.error(`\n❌ Could not connect to Cloud Firestore on project "${config.firebaseConfig.projectId}".`);
    console.error(`👉 Please ensure Cloud Firestore is enabled:`);
    console.error(`   https://console.firebase.google.com/project/${config.firebaseConfig.projectId}/firestore`);
    console.error(`   Click "Create Database" -> "Start in test mode" -> "Enable".\n`);
    process.exit(1);
  }

  try {
    // 1. Seed Phones
    console.log(`\n📱 Seeding ${DEFAULT_PHONES.length} devices into collection "phones"...`);
    let count = 0;
    for (const phone of DEFAULT_PHONES) {
      await firestoreOps.setDoc('phones', phone.id, {
        ...phone,
        updatedAt: new Date().toISOString()
      });
      count++;
      process.stdout.write(`   ✓ [${count}/${DEFAULT_PHONES.length}] Seeded: ${phone.model} (${phone.storage || 'Standard'})\n`);
    }

    // 2. Seed Admin Security PIN
    console.log(`\n🔑 Seeding Admin PIN hash into collection "admin" (doc: "security")...`);
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(config.ADMIN_DEFAULT_PIN, salt);
    await firestoreOps.setDoc('admin', 'security', {
      pinHash: hash,
      updatedAt: new Date().toISOString()
    });
    console.log(`   ✓ Admin PIN hash stored (Default PIN: ${config.ADMIN_DEFAULT_PIN})`);

    // 3. Seed Settings
    console.log(`\n⚙️ Seeding Store Settings into collection "settings" (doc: "general")...`);
    await firestoreOps.setDoc('settings', 'general', {
      whatsappNumber: config.WHATSAPP_NUMBER,
      storeName: 'DRG Phones Palace',
      location: 'Nairobi, Kenya',
      updatedAt: new Date().toISOString()
    });
    console.log(`   ✓ Store settings saved (WhatsApp: +${config.WHATSAPP_NUMBER})`);

    console.log(`\n=============================================================`);
    console.log(`🎉 Firebase Firestore successfully seeded!`);
    console.log(`📱 ${count} Phones catalogue documents ready`);
    console.log(`👑 Admin credentials & store settings configured`);
    console.log(`=============================================================\n`);
    process.exit(0);
  } catch (err) {
    console.error(`\n❌ Error during seeding:`, err.message);
    process.exit(1);
  }
}

seed();

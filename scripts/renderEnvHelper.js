/**
 * DRG Phones Palace — Render / Production Environment Variable Generator
 *
 * Generates a clean single-line base64 representation of your Firebase Service Account key
 * to paste into Render's Environment settings as FIREBASE_SERVICE_ACCOUNT_BASE64.
 *
 * Usage: node scripts/renderEnvHelper.js
 */

const fs = require('fs');
const path = require('path');

const keyPath = path.resolve(__dirname, '..', 'serviceAccountKey.json');

if (!fs.existsSync(keyPath)) {
  console.log('⚠️ serviceAccountKey.json not found in project root.');
  console.log('👉 To enable permanent Firebase Storage on Render:');
  console.log('   1. In Firebase Console: Project Settings -> Service Accounts -> Generate new private key');
  console.log('   2. Save file as serviceAccountKey.json in this project root');
  console.log('   3. Run this script again: node scripts/renderEnvHelper.js');
  process.exit(1);
}

try {
  const content = fs.readFileSync(keyPath, 'utf8');
  // Verify it is valid JSON
  const parsed = JSON.parse(content);
  const base64 = Buffer.from(JSON.stringify(parsed)).toString('base64');

  console.log('========================================================================');
  console.log('🚀 FIREBASE STORAGE DEPLOYMENT HELPER (RENDER / PRODUCTION)');
  console.log('========================================================================\n');
  console.log('In your Render service dashboard (Dashboard -> DRG Phones Palace -> Environment):');
  console.log('Set these environment variables:\n');
  console.log('1. USE_FIREBASE');
  console.log('   Value: true\n');
  console.log('2. FIREBASE_STORAGE_BUCKET');
  console.log('   Value: ' + (parsed.project_id ? `${parsed.project_id}.firebasestorage.app` : 'phones-3355c.firebasestorage.app') + '\n');
  console.log('3. FIREBASE_SERVICE_ACCOUNT_BASE64');
  console.log('   Value (copy the single line below):\n');
  console.log(base64);
  console.log('\n========================================================================');
  console.log('✅ Done! Paste this into Render, save, and redeploy.');
  console.log('========================================================================');
} catch (e) {
  console.error('Error processing service account key:', e.message);
  process.exit(1);
}

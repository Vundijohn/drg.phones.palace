const fs = require('fs');
const path = require('path');
const config = require('./config');

let adminAppSdk = null;
let getAdminFirestore = null;
let getAdminDatabase = null;
let getAdminStorage = null;
try {
  adminAppSdk = require('firebase-admin/app');
  getAdminFirestore = require('firebase-admin/firestore').getFirestore;
  getAdminDatabase = require('firebase-admin/database').getDatabase;
  getAdminStorage = require('firebase-admin/storage').getStorage;
} catch (err) {
  console.warn(`[Firebase] Admin SDK unavailable: ${err.message}`);
}

const { initializeApp: initClientApp, getApps: getClientApps } = require('firebase/app');
const {
  getFirestore: getClientFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  limit: firestoreLimit,
  getDocsFromServer
} = require('firebase/firestore');

const {
  getDatabase: getClientDatabase,
  ref: rtdbRef,
  get: rtdbGet,
  set: rtdbSet,
  update: rtdbUpdate,
  remove: rtdbRemove
} = require('firebase/database');

let isFirestoreConnected = false;
let isRtdbConnected = false;
let isStorageConnected = false;
let firestoreMode = 'none'; // 'admin' | 'client' | 'none'
let rtdbMode = 'none';      // 'admin' | 'client' | 'none'

let adminDb = null;
let adminRtdb = null;
let adminStorage = null;
let adminApp = null;
let clientDb = null;
let clientRtdb = null;
let clientApp = null;

function loadServiceAccountObject() {
  // Option 1: Base64 environment variable (best for Render/PaaS)
  if (config.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    try {
      const decoded = Buffer.from(config.FIREBASE_SERVICE_ACCOUNT_BASE64.trim(), 'base64').toString('utf8');
      const parsed = JSON.parse(decoded);
      return { account: parsed, source: 'FIREBASE_SERVICE_ACCOUNT_BASE64' };
    } catch (e) {
      console.warn(`[Firebase] Could not parse FIREBASE_SERVICE_ACCOUNT_BASE64: ${e.message}`);
    }
  }

  // Option 2: Raw or encoded JSON environment variable
  if (config.FIREBASE_SERVICE_ACCOUNT_JSON) {
    try {
      let raw = config.FIREBASE_SERVICE_ACCOUNT_JSON.trim();
      // Remove accidental wrapping quotes
      if ((raw.startsWith("'") && raw.endsWith("'")) || (raw.startsWith('"') && raw.endsWith('"'))) {
        raw = raw.slice(1, -1).trim();
      }
      // Check if base64 encoded
      if (!raw.startsWith('{') && /^[A-Za-z0-9+/=]+$/.test(raw)) {
        try {
          raw = Buffer.from(raw, 'base64').toString('utf8');
        } catch (e) {}
      }
      const parsed = JSON.parse(raw);
      return { account: parsed, source: 'FIREBASE_SERVICE_ACCOUNT_JSON' };
    } catch (e) {
      console.warn(`[Firebase] Could not parse FIREBASE_SERVICE_ACCOUNT_JSON: ${e.message}`);
    }
  }

  // Option 3: Local file path
  const serviceAccountPath = path.resolve(config.FIREBASE_SERVICE_ACCOUNT_PATH);
  if (fs.existsSync(serviceAccountPath)) {
    try {
      const content = fs.readFileSync(serviceAccountPath, 'utf8');
      const parsed = JSON.parse(content);
      return { account: parsed, source: 'serviceAccountKey.json' };
    } catch (e) {
      console.warn(`[Firebase] Could not read serviceAccountKey.json: ${e.message}`);
    }
  }

  return null;
}

function initializeFirebase() {
  if (!config.USE_FIREBASE) {
    return false;
  }

  // 1. Try Admin SDK with Service Account Key
  if (adminAppSdk) {
    const loaded = loadServiceAccountObject();
    if (loaded && loaded.account) {
      try {
        const serviceAccount = loaded.account;
        // Fix escaped newlines in private key if present
        if (serviceAccount.private_key && typeof serviceAccount.private_key === 'string') {
          serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
        }

        const bucketName = config.firebaseConfig.storageBucket || `${serviceAccount.project_id || config.firebaseConfig.projectId}.firebasestorage.app`;
        const apps = adminAppSdk.getApps();
        adminApp = apps.length > 0
          ? apps[0]
          : adminAppSdk.initializeApp({
            credential: adminAppSdk.cert(serviceAccount),
            storageBucket: bucketName,
            databaseURL: config.firebaseConfig.databaseURL,
            projectId: serviceAccount.project_id || config.firebaseConfig.projectId
          });
        adminDb = getAdminFirestore(adminApp);
        if (getAdminStorage) {
          adminStorage = getAdminStorage(adminApp);
        }
        firestoreMode = 'admin';

        if (getAdminDatabase) {
          adminRtdb = getAdminDatabase(adminApp);
          rtdbMode = 'admin';
        }

        console.log(`[Firebase] 🔥 Initialized Firebase Admin SDK via ${loaded.source} (Project: ${serviceAccount.project_id || config.firebaseConfig.projectId})`);
        return true;
      } catch (err) {
        console.warn(`[Firebase] Failed initializing Admin SDK with service account: ${err.message}`);
      }
    }
  }

  // 2. Initialize Client SDK with provided firebaseConfig
  try {
    const apps = getClientApps();
    clientApp = apps.length > 0 ? apps[0] : initClientApp(config.firebaseConfig);
    
    // Firestore
    try {
      clientDb = getClientFirestore(clientApp);
      firestoreMode = 'client';
    } catch (e) {}

    // Realtime Database
    try {
      clientRtdb = getClientDatabase(clientApp, config.firebaseConfig.databaseURL);
      rtdbMode = 'client';
    } catch (e) {}

    console.log(`[Firebase] 🔥 Initialized Firebase SDK with Project: ${config.firebaseConfig.projectId}`);
    if (config.firebaseConfig.databaseURL) {
      console.log(`[Firebase] 🌐 Realtime Database URL: ${config.firebaseConfig.databaseURL}`);
    }
    return true;
  } catch (err) {
    console.warn(`[Firebase] Failed initializing Firebase Client SDK: ${err.message}`);
    return false;
  }
}

let lastFirestoreTestTime = 0;
let lastRtdbTestTime = 0;
const TEST_COOLDOWN_MS = 30000;

// Test Realtime Database connectivity
async function testRtdbAccess(force = false) {
  if (rtdbMode === 'none' || !config.firebaseConfig.databaseURL) {
    isRtdbConnected = false;
    return false;
  }

  const now = Date.now();
  if (!force && lastRtdbTestTime && (now - lastRtdbTestTime < TEST_COOLDOWN_MS)) {
    return isRtdbConnected;
  }
  lastRtdbTestTime = now;

  try {
    if (rtdbMode === 'admin' && adminRtdb) {
      await adminRtdb.ref('_health').once('value');
      isRtdbConnected = true;
      console.log(`[Firebase] ✅ Realtime Database connected and active via Admin SDK.`);
      return true;
    } else if (rtdbMode === 'client' && clientRtdb) {
      const snap = await rtdbGet(rtdbRef(clientRtdb, '_health'));
      isRtdbConnected = true;
      console.log(`[Firebase] ✅ Realtime Database connected and active.`);
      return true;
    }
  } catch (err) {
    isRtdbConnected = false;
    const isPermissionDenied = err.message && err.message.toLowerCase().includes('permission denied');
    console.warn(`\n================================================================`);
    console.warn(`⚠️  FIREBASE REALTIME DATABASE NOTICE:`);
    console.warn(`   Database URL: ${config.firebaseConfig.databaseURL}`);
    if (isPermissionDenied) {
      console.warn(`   Status: 🔒 Permission Denied (Database is currently locked by security rules).`);
      console.warn(`   👉 To allow read/write in Firebase Console:`);
      console.warn(`      1. Visit: https://console.firebase.google.com/project/${config.firebaseConfig.projectId}/database/phones-3355c-default-rtdb/rules`);
      console.warn(`      2. Update the rules to:`);
      console.warn(`         {`);
      console.warn(`           "rules": {`);
      console.warn(`             ".read": true,`);
      console.warn(`             ".write": true`);
      console.warn(`           }`);
      console.warn(`         }`);
      console.warn(`      3. Click "Publish".`);
      console.warn(`   👉 Or place your "serviceAccountKey.json" in project root for admin bypass.`);
    } else {
      console.warn(`   Connection check error: ${err.message}`);
    }
    console.warn(`   ⚡ Fallback to local store active until rules are published.`);
    console.warn(`================================================================\n`);
    return false;
  }
  return false;
}

// Test Firestore connectivity
async function testFirestoreAccess(force = false) {
  if (firestoreMode === 'none') {
    isFirestoreConnected = false;
    return false;
  }

  const now = Date.now();
  if (!force && lastFirestoreTestTime && (now - lastFirestoreTestTime < TEST_COOLDOWN_MS)) {
    return isFirestoreConnected;
  }
  lastFirestoreTestTime = now;

  try {
    if (firestoreMode === 'admin' && adminDb) {
      await adminDb.collection('_health').limit(1).get();
      isFirestoreConnected = true;
      console.log(`[Firebase] ✅ Cloud Firestore connected and active.`);
      return true;
    } else if (firestoreMode === 'client' && clientDb) {
      const testCol = collection(clientDb, '_health');
      const q = query(testCol, firestoreLimit(1));
      await getDocsFromServer(q);
      isFirestoreConnected = true;
      console.log(`[Firebase] ✅ Cloud Firestore connected and active.`);
      return true;
    }
  } catch (err) {
    isFirestoreConnected = false;
    return false;
  }
  return false;
}

// Realtime Database Universal Operations
const rtdbOps = {
  async get(pathStr) {
    if (rtdbMode === 'admin' && adminRtdb) {
      const snap = await adminRtdb.ref(pathStr).once('value');
      return snap.val();
    }
    if (rtdbMode === 'client' && clientRtdb) {
      const snap = await rtdbGet(rtdbRef(clientRtdb, pathStr));
      return snap.val();
    }
    return null;
  },

  async set(pathStr, data) {
    if (rtdbMode === 'admin' && adminRtdb) {
      await adminRtdb.ref(pathStr).set(data);
      return data;
    }
    if (rtdbMode === 'client' && clientRtdb) {
      await rtdbSet(rtdbRef(clientRtdb, pathStr), data);
      return data;
    }
    return null;
  },

  async update(pathStr, updates) {
    if (rtdbMode === 'admin' && adminRtdb) {
      await adminRtdb.ref(pathStr).update(updates);
      return updates;
    }
    if (rtdbMode === 'client' && clientRtdb) {
      await rtdbUpdate(rtdbRef(clientRtdb, pathStr), updates);
      return updates;
    }
    return null;
  },

  async remove(pathStr) {
    if (rtdbMode === 'admin' && adminRtdb) {
      await adminRtdb.ref(pathStr).remove();
      return true;
    }
    if (rtdbMode === 'client' && clientRtdb) {
      await rtdbRemove(rtdbRef(clientRtdb, pathStr));
      return true;
    }
    return false;
  }
};

// Firestore Universal Operations
const firestoreOps = {
  async getDoc(colName, docId) {
    if (firestoreMode === 'admin' && adminDb) {
      const snap = await adminDb.collection(colName).doc(docId).get();
      return snap.exists ? { id: snap.id, ...snap.data() } : null;
    }
    if (firestoreMode === 'client' && clientDb) {
      const ref = doc(clientDb, colName, docId);
      const snap = await getDoc(ref);
      return snap.exists() ? { id: snap.id, ...snap.data() } : null;
    }
    return null;
  },

  async setDoc(colName, docId, data, merge = true) {
    if (firestoreMode === 'admin' && adminDb) {
      await adminDb.collection(colName).doc(docId).set(data, { merge });
      return { id: docId, ...data };
    }
    if (firestoreMode === 'client' && clientDb) {
      const ref = doc(clientDb, colName, docId);
      await setDoc(ref, data, { merge });
      return { id: docId, ...data };
    }
    return null;
  },

  async updateDoc(colName, docId, updates) {
    if (firestoreMode === 'admin' && adminDb) {
      const ref = adminDb.collection(colName).doc(docId);
      await ref.update(updates);
      const updated = await ref.get();
      return { id: updated.id, ...updated.data() };
    }
    if (firestoreMode === 'client' && clientDb) {
      const ref = doc(clientDb, colName, docId);
      await updateDoc(ref, updates);
      const updated = await getDoc(ref);
      return { id: updated.id, ...updated.data() };
    }
    return null;
  },

  async deleteDoc(colName, docId) {
    if (firestoreMode === 'admin' && adminDb) {
      await adminDb.collection(colName).doc(docId).delete();
      return true;
    }
    if (firestoreMode === 'client' && clientDb) {
      const ref = doc(clientDb, colName, docId);
      await deleteDoc(ref);
      return true;
    }
    return false;
  },

  async getCollection(colName, maxLimit = 1000) {
    if (firestoreMode === 'admin' && adminDb) {
      const snapshot = await adminDb.collection(colName).limit(maxLimit).get();
      const list = [];
      snapshot.forEach(docSnap => {
        list.push({ id: docSnap.id, ...docSnap.data() });
      });
      return list;
    }
    if (firestoreMode === 'client' && clientDb) {
      const colRef = collection(clientDb, colName);
      const q = query(colRef, firestoreLimit(maxLimit));
      const snapshot = await getDocs(q);
      const list = [];
      snapshot.forEach(docSnap => {
        list.push({ id: docSnap.id, ...docSnap.data() });
      });
      return list;
    }
    return [];
  }
};

let lastStorageTestTime = 0;
// Test Firebase Storage connectivity
async function testStorageAccess(force = false) {
  if (!adminStorage) {
    isStorageConnected = false;
    return false;
  }

  const now = Date.now();
  if (!force && lastStorageTestTime && (now - lastStorageTestTime < TEST_COOLDOWN_MS)) {
    return isStorageConnected;
  }
  lastStorageTestTime = now;

  try {
    const bucketName = config.firebaseConfig.storageBucket || `${config.firebaseConfig.projectId}.firebasestorage.app`;
    const bucket = adminStorage.bucket(bucketName);
    const [exists] = await bucket.exists();
    isStorageConnected = exists;
    if (exists) {
      console.log(`[Firebase] ✅ Firebase Storage bucket active: ${bucketName}`);
    }
    return exists;
  } catch (err) {
    isStorageConnected = false;
    console.warn(`[Firebase] ⚠️ Storage bucket check notice: ${err.message}`);
    return false;
  }
}

initializeFirebase();

module.exports = {
  get adminApp() { return adminApp; },
  get adminDb() { return adminDb; },
  get adminRtdb() { return adminRtdb; },
  get adminStorage() { return adminStorage; },
  get clientDb() { return clientDb; },
  get clientRtdb() { return clientRtdb; },
  get clientApp() { return clientApp; },
  get firestoreMode() { return firestoreMode; },
  get rtdbMode() { return rtdbMode; },
  initializeFirebase,
  testFirestoreAccess,
  testRtdbAccess,
  testStorageAccess,
  isFirestoreConnected: () => isFirestoreConnected,
  isRtdbConnected: () => isRtdbConnected,
  isStorageConnected: () => isStorageConnected,
  firestoreOps,
  rtdbOps
};

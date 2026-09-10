const fs = require('fs');
const path = require('path');
const config = require('./config');

let admin = null;
let getAdminDatabase = null;
try {
  admin = require('firebase-admin');
  getAdminDatabase = require('firebase-admin/database').getDatabase;
} catch (e) {
  // admin optional
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
let firestoreMode = 'none'; // 'admin' | 'client' | 'none'
let rtdbMode = 'none';      // 'admin' | 'client' | 'none'

let adminDb = null;
let adminRtdb = null;
let clientDb = null;
let clientRtdb = null;
let clientApp = null;

function initializeFirebase() {
  if (!config.USE_FIREBASE) {
    return false;
  }

  // 1. Try Admin SDK with Service Account Key if file exists
  if (admin) {
    const serviceAccountPath = path.resolve(config.FIREBASE_SERVICE_ACCOUNT_PATH);
    if (fs.existsSync(serviceAccountPath)) {
      try {
        const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
        if (admin.apps.length === 0) {
          admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            storageBucket: config.firebaseConfig.storageBucket,
            databaseURL: config.firebaseConfig.databaseURL,
            projectId: config.firebaseConfig.projectId
          });
        }
        adminDb = admin.firestore();
        firestoreMode = 'admin';

        if (getAdminDatabase) {
          adminRtdb = getAdminDatabase();
          rtdbMode = 'admin';
        }

        console.log(`[Firebase] 🔥 Initialized Firebase Admin SDK via serviceAccountKey.json (Project: ${config.firebaseConfig.projectId})`);
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

initializeFirebase();

module.exports = {
  admin,
  adminDb,
  adminRtdb,
  clientDb,
  clientRtdb,
  firestoreMode,
  rtdbMode,
  initializeFirebase,
  testFirestoreAccess,
  testRtdbAccess,
  isFirestoreConnected: () => isFirestoreConnected,
  isRtdbConnected: () => isRtdbConnected,
  firestoreOps,
  rtdbOps
};

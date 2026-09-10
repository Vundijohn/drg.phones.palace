const fs = require('fs');
const path = require('path');
const config = require('./config');

let admin = null;
try {
  admin = require('firebase-admin');
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
  where,
  limit: firestoreLimit,
  getDocsFromServer
} = require('firebase/firestore');

let isConnected = false;
let connectionTested = false;
let firestoreMode = 'none'; // 'admin' | 'client' | 'none'
let adminDb = null;
let clientDb = null;
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
            projectId: config.firebaseConfig.projectId
          });
        }
        adminDb = admin.firestore();
        firestoreMode = 'admin';
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
    clientDb = getClientFirestore(clientApp);
    firestoreMode = 'client';
    console.log(`[Firebase] 🔥 Initialized Firebase SDK with Project: ${config.firebaseConfig.projectId}`);
    return true;
  } catch (err) {
    console.warn(`[Firebase] Failed initializing Firebase Client SDK: ${err.message}`);
    firestoreMode = 'none';
    return false;
  }
}

// Check if Firestore is reachable (and enabled in Firebase Console)
async function testFirestoreAccess() {
  if (firestoreMode === 'none') {
    isConnected = false;
    connectionTested = true;
    return false;
  }

  try {
    if (firestoreMode === 'admin' && adminDb) {
      // Test read from admin
      await adminDb.collection('_health').limit(1).get();
      isConnected = true;
      connectionTested = true;
      console.log(`[Firebase] ✅ Cloud Firestore connection verified and active.`);
      return true;
    } else if (firestoreMode === 'client' && clientDb) {
      // Test remote server read with client SDK
      const testCol = collection(clientDb, '_health');
      const q = query(testCol, firestoreLimit(1));
      await getDocsFromServer(q);
      isConnected = true;
      connectionTested = true;
      console.log(`[Firebase] ✅ Cloud Firestore connection verified and active.`);
      return true;
    }
  } catch (err) {
    isConnected = false;
    connectionTested = true;
    const isApiDisabled = err.message && (err.message.includes('not been used') || err.message.includes('disabled') || err.message.includes('PERMISSION_DENIED'));
    
    console.warn(`\n================================================================`);
    console.warn(`⚠️  FIREBASE FIRESTORE NOTICE:`);
    if (isApiDisabled) {
      console.warn(`   Cloud Firestore is not yet activated on project "${config.firebaseConfig.projectId}".`);
      console.warn(`   👉 To activate Firestore in 1 minute:`);
      console.warn(`      1. Visit: https://console.firebase.google.com/project/${config.firebaseConfig.projectId}/firestore`);
      console.warn(`      2. Click "Create Database" and select "Start in test mode".`);
    } else {
      console.warn(`   Firestore connection check: ${err.message}`);
    }
    console.warn(`   ⚡ The server is running smoothly using the local data store as fallback.`);
    console.warn(`================================================================\n`);
    return false;
  }
}

// Universal Firestore Document & Collection operations
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

// Initialize right away
initializeFirebase();

module.exports = {
  admin,
  adminDb,
  clientDb,
  firestoreMode,
  initializeFirebase,
  testFirestoreAccess,
  isFirebaseConnected: () => isConnected,
  firestoreOps
};

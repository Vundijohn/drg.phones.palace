const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const config = require('./config');
const { DEFAULT_PHONES } = require('../data/seedData');
const {
  firestoreOps,
  rtdbOps,
  testFirestoreAccess,
  testRtdbAccess,
  testStorageAccess,
  isStorageConnected
} = require('./firebase');

// Local file paths
const PHONES_FILE = path.join(config.DATA_DIR, 'phones.json');
const ADMIN_FILE = path.join(config.DATA_DIR, 'admin.json');
const INQUIRIES_FILE = path.join(config.DATA_DIR, 'inquiries.json');
const SETTINGS_FILE = path.join(config.DATA_DIR, 'settings.json');

// Ensure local directory exists
if (!fs.existsSync(config.DATA_DIR)) {
  fs.mkdirSync(config.DATA_DIR, { recursive: true });
}

// Atomic file write helper
function safeWriteJson(filePath, data) {
  const tempPath = `${filePath}.tmp.${Date.now()}`;
  fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tempPath, filePath);
}

function safeReadJson(filePath, defaultValue) {
  try {
    if (!fs.existsSync(filePath)) {
      safeWriteJson(filePath, defaultValue);
      return defaultValue;
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err.message);
    return defaultValue;
  }
}

// Initialize Local JSON store
function initLocalDb() {
  if (!fs.existsSync(PHONES_FILE)) {
    safeWriteJson(PHONES_FILE, DEFAULT_PHONES);
  }

  if (!fs.existsSync(ADMIN_FILE)) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(config.ADMIN_DEFAULT_PIN, salt);
    safeWriteJson(ADMIN_FILE, {
      pinHash: hash,
      updatedAt: new Date().toISOString()
    });
  }

  if (!fs.existsSync(INQUIRIES_FILE)) {
    safeWriteJson(INQUIRIES_FILE, []);
  }

  if (!fs.existsSync(SETTINGS_FILE)) {
    safeWriteJson(SETTINGS_FILE, {
      whatsappNumber: config.WHATSAPP_NUMBER,
      storeName: 'DRG Phones Palace',
      location: 'Nairobi, Kenya',
      updatedAt: new Date().toISOString()
    });
  }
}

initLocalDb();

// Active database engine detector
async function getActiveEngine() {
  if (!config.USE_FIREBASE) return 'local';
  
  // Check Realtime Database first if URL provided
  if (config.firebaseConfig.databaseURL) {
    const rtdbOk = await testRtdbAccess();
    if (rtdbOk) return 'rtdb';
  }

  // Check Cloud Firestore
  const firestoreOk = await testFirestoreAccess();
  if (firestoreOk) return 'firestore';

  return 'local';
}

// Normalize phone object to guarantee clean images array and fields
function normalizePhone(phone) {
  if (!phone || typeof phone !== 'object') return null;
  const p = { ...phone };

  // 1. Normalize images: ensure Array of valid non-empty string URLs
  let imgs = [];
  if (Array.isArray(p.images)) {
    imgs = p.images;
  } else if (p.images && typeof p.images === 'object') {
    imgs = Object.values(p.images);
  } else if (p.image) {
    imgs = [p.image];
  }

  imgs = imgs
    .map(u => (typeof u === 'string' ? u.trim() : ''))
    .filter(u => u && u.length > 0 && !u.includes('[object Object]'));

  // Guard iPhone 12 against wiped local uploads
  if (p.id === 'iphone-12' || (p.model && /iphone\s*12/i.test(p.model))) {
    const verifiedIp12Imgs = [
      "https://firebasestorage.googleapis.com/v0/b/phones-3355c.firebasestorage.app/o/phones%2Fiphone-12%2Fiphone-12-hero.jpg?alt=media&token=bf59dd68-e7a9-4263-8ecf-cfb076c7d1d3",
      "https://firebasestorage.googleapis.com/v0/b/phones-3355c.firebasestorage.app/o/phones%2Fiphone-12%2Fiphone-12-blue-front.jpg?alt=media&token=71a127fe-b5f1-4dfc-be99-85a5dd642cda",
      "https://firebasestorage.googleapis.com/v0/b/phones-3355c.firebasestorage.app/o/phones%2Fiphone-12%2Fiphone-12-blue-back.jpg?alt=media&token=57bfeb00-4358-4b37-9914-463b1ae31c03",
      "https://firebasestorage.googleapis.com/v0/b/phones-3355c.firebasestorage.app/o/phones%2Fiphone-12%2Fiphone-12-angle.jpg?alt=media&token=d5ea2a49-3441-47ae-9a8c-740676fae9fe",
      "https://firebasestorage.googleapis.com/v0/b/phones-3355c.firebasestorage.app/o/phones%2Fiphone-12%2Fiphone-12-colors.jpg?alt=media&token=20f46df5-4ad1-4f72-b6a2-44adcccb8e36",
      "https://firebasestorage.googleapis.com/v0/b/phones-3355c.firebasestorage.app/o/phones%2Fiphone-12%2Fiphone-12-dual-camera.jpg?alt=media&token=065a2766-0577-4fb8-a1b2-2fa0b46a7002",
      "https://firebasestorage.googleapis.com/v0/b/phones-3355c.firebasestorage.app/o/phones%2Fiphone-12%2Fiphone-12-lifestyle.jpg?alt=media&token=6f42b5e6-f318-4476-85ff-0f033f0365fc"
    ];
    imgs = imgs.filter(u => !u.startsWith('uploads/'));
    if (!imgs.length) {
      imgs = verifiedIp12Imgs;
    }
  }

  // Guard Note 20 against wiped local uploads
  if (p.id === 'note-20-128' || (p.model && /note\s*20/i.test(p.model))) {
    const verifiedCloudImgs = [
      "https://firebasestorage.googleapis.com/v0/b/phones-3355c.firebasestorage.app/o/phones%2Fnote-20%2Fnote-20-hero.jpg?alt=media&token=4096eaa7-24e2-4bfb-a413-f11d30b69cbe",
      "https://firebasestorage.googleapis.com/v0/b/phones-3355c.firebasestorage.app/o/phones%2Fnote-20%2Fnote-20-front.jpg?alt=media&token=d6e13435-03fb-4a31-80ea-f8c0de40c25c",
      "https://firebasestorage.googleapis.com/v0/b/phones-3355c.firebasestorage.app/o/phones%2Fnote-20%2Fnote-20-angle-spen.jpg?alt=media&token=6c3699ad-0c64-4d21-ac84-6da1f35eab8e",
      "https://firebasestorage.googleapis.com/v0/b/phones-3355c.firebasestorage.app/o/phones%2Fnote-20%2Fnote-20-back.jpg?alt=media&token=ad48616f-4db1-4021-97bf-3be58f45f15d",
      "https://firebasestorage.googleapis.com/v0/b/phones-3355c.firebasestorage.app/o/phones%2Fnote-20%2Fnote-20-display.jpg?alt=media&token=4b524257-304c-4821-b736-66708b71d28f",
      "https://firebasestorage.googleapis.com/v0/b/phones-3355c.firebasestorage.app/o/phones%2Fnote-20%2Fnote-20-camera.jpg?alt=media&token=98ffb63d-a6cd-4ea2-a338-de1c3c8e0f57",
      "https://firebasestorage.googleapis.com/v0/b/phones-3355c.firebasestorage.app/o/phones%2Fnote-20%2Fnote-20-side.jpg?alt=media&token=699e8a88-2ce0-4971-8a05-0fd4d73eb77d",
      "https://firebasestorage.googleapis.com/v0/b/phones-3355c.firebasestorage.app/o/phones%2Fnote-20%2Fnote-20-lifestyle.jpg?alt=media&token=73cfd8c2-b018-43e0-8e8c-8eb30a6e6e9b"
    ];
    // Remove dead uploads from array
    imgs = imgs.filter(u => !u.startsWith('uploads/'));
    if (!imgs.length) {
      imgs = verifiedCloudImgs;
    }
  }

  p.images = imgs;

  // 2. Normalize primary image
  if ((!p.image || typeof p.image !== 'string' || p.image.includes('[object Object]')) && imgs.length > 0) {
    p.image = imgs[0];
  } else if (p.image && typeof p.image === 'string') {
    p.image = p.image.trim();
  }

  // 3. Ensure specs is array
  if (!Array.isArray(p.specs)) {
    if (typeof p.specs === 'string') {
      p.specs = p.specs.split(/[,;\n]/).map(s => s.trim()).filter(Boolean);
    } else {
      p.specs = [];
    }
  }

  return p;
}

const db = {
  normalizePhone,

  // Check active engine status
  async getStatus() {
    const engine = await getActiveEngine();
    let dbName = 'Local JSON Store';
    if (engine === 'rtdb') dbName = 'Firebase Realtime Database';
    if (engine === 'firestore') dbName = 'Google Cloud Firestore';
    const storageOk = typeof testStorageAccess === 'function' ? await testStorageAccess() : false;

    return {
      database: dbName,
      engine: engine,
      projectId: config.firebaseConfig.projectId,
      databaseURL: config.firebaseConfig.databaseURL,
      firebaseEnabled: config.USE_FIREBASE,
      rtdbActive: engine === 'rtdb',
      firestoreActive: engine === 'firestore',
      storageActive: storageOk,
      storageEngine: storageOk ? 'Firebase Cloud Storage' : 'Local Server Storage'
    };
  },

  // ---------------- PHONES ----------------
  async getAllPhones(options = {}) {
    const engine = await getActiveEngine();
    let phones = [];

    if (engine === 'rtdb') {
      try {
        const val = await rtdbOps.get('phones');
        if (val) {
          phones = Array.isArray(val) ? val.filter(Boolean) : Object.values(val);
        } else {
          // Auto-seed RTDB if empty
          console.log('[Firebase RTDB] Auto-seeding initial phones inventory...');
          const seedMap = {};
          for (const p of DEFAULT_PHONES) {
            seedMap[p.id] = p;
          }
          await rtdbOps.set('phones', seedMap);
          phones = [...DEFAULT_PHONES];
        }
      } catch (err) {
        console.warn('[Firebase RTDB] Error fetching phones, using local fallback:', err.message);
        phones = safeReadJson(PHONES_FILE, DEFAULT_PHONES);
      }
    } else if (engine === 'firestore') {
      try {
        phones = await firestoreOps.getCollection('phones');
        if (!phones || phones.length === 0) {
          console.log('[Firebase Firestore] Auto-seeding initial phones...');
          for (const p of DEFAULT_PHONES) {
            await firestoreOps.setDoc('phones', p.id, p);
          }
          phones = [...DEFAULT_PHONES];
        }
      } catch (err) {
        console.warn('[Firebase Firestore] Error fetching phones, using local fallback:', err.message);
        phones = safeReadJson(PHONES_FILE, DEFAULT_PHONES);
      }
    } else {
      phones = safeReadJson(PHONES_FILE, DEFAULT_PHONES);
    }

    // Always normalize every phone
    phones = phones.map(normalizePhone).filter(Boolean);

    const { category, search } = options;

    if (category && category !== 'all') {
      phones = phones.filter(p => p.category === category);
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      phones = phones.filter(p => {
        const text = `${p.model} ${p.storage} ${p.category} ${p.categoryLabel || ''} ${p.specs ? p.specs.join(' ') : ''} ${p.cashPrice}`.toLowerCase();
        return text.includes(q);
      });
    }

    return phones;
  },

  async getPhoneById(id) {
    const engine = await getActiveEngine();
    let phone = null;
    if (engine === 'rtdb') {
      try {
        const p = await rtdbOps.get(`phones/${id}`);
        if (p) phone = p;
      } catch (e) {}
    } else if (engine === 'firestore') {
      try {
        const p = await firestoreOps.getDoc('phones', id);
        if (p) phone = p;
      } catch (e) {}
    }

    if (!phone) {
      const phones = safeReadJson(PHONES_FILE, DEFAULT_PHONES);
      phone = phones.find(p => p.id === id) || null;
    }

    return normalizePhone(phone);
  },

  async createPhone(phoneData) {
    const id = phoneData.id || `phone-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;
    const newPhone = normalizePhone({
      ...phoneData,
      id,
      createdAt: new Date().toISOString()
    });

    const engine = await getActiveEngine();
    if (engine === 'rtdb') {
      try {
        await rtdbOps.set(`phones/${id}`, newPhone);
        console.log(`[Firebase RTDB] Phone stored: ${newPhone.model} (${id})`);
      } catch (e) {
        console.warn('[Firebase RTDB] Error creating phone:', e.message);
      }
    } else if (engine === 'firestore') {
      try {
        await firestoreOps.setDoc('phones', id, newPhone);
        console.log(`[Firebase Firestore] Phone stored: ${newPhone.model} (${id})`);
      } catch (e) {
        console.warn('[Firebase Firestore] Error creating phone:', e.message);
      }
    }

    // Always update local backup
    const phones = safeReadJson(PHONES_FILE, DEFAULT_PHONES);
    phones.unshift(newPhone);
    safeWriteJson(PHONES_FILE, phones);

    return newPhone;
  },

  async updatePhone(id, updates) {
    const existing = await this.getPhoneById(id);
    const engine = await getActiveEngine();
    const merged = normalizePhone({
      ...(existing || {}),
      ...updates,
      id,
      updatedAt: new Date().toISOString()
    });

    if (engine === 'rtdb') {
      try {
        await rtdbOps.update(`phones/${id}`, merged);
      } catch (e) {}
    } else if (engine === 'firestore') {
      try {
        await firestoreOps.updateDoc('phones', id, merged);
      } catch (e) {}
    }

    const phones = safeReadJson(PHONES_FILE, DEFAULT_PHONES);
    const index = phones.findIndex(p => p.id === id);
    if (index !== -1) {
      phones[index] = merged;
    } else {
      phones.unshift(merged);
    }
    safeWriteJson(PHONES_FILE, phones);
    return merged;
  },

  async deletePhone(id) {
    const engine = await getActiveEngine();
    if (engine === 'rtdb') {
      try {
        await rtdbOps.remove(`phones/${id}`);
      } catch (e) {}
    } else if (engine === 'firestore') {
      try {
        await firestoreOps.deleteDoc('phones', id);
      } catch (e) {}
    }

    const phones = safeReadJson(PHONES_FILE, DEFAULT_PHONES);
    const index = phones.findIndex(p => p.id === id);
    if (index !== -1) {
      const removed = phones.splice(index, 1)[0];
      safeWriteJson(PHONES_FILE, phones);
      return removed;
    }
    return null;
  },

  async resetPhones() {
    const engine = await getActiveEngine();
    if (engine === 'rtdb') {
      try {
        const seedMap = {};
        for (const p of DEFAULT_PHONES) seedMap[p.id] = p;
        await rtdbOps.set('phones', seedMap);
      } catch (e) {}
    } else if (engine === 'firestore') {
      try {
        for (const p of DEFAULT_PHONES) await firestoreOps.setDoc('phones', p.id, p);
      } catch (e) {}
    }

    safeWriteJson(PHONES_FILE, DEFAULT_PHONES);
    return DEFAULT_PHONES;
  },

  async importPhones(newPhonesList) {
    if (!Array.isArray(newPhonesList)) {
      throw new Error('Imported data must be an array of phones.');
    }

    const engine = await getActiveEngine();
    if (engine === 'rtdb') {
      try {
        const map = {};
        for (const phone of newPhonesList) {
          const docId = phone.id || `phone-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;
          map[docId] = { ...phone, id: docId };
        }
        await rtdbOps.set('phones', map);
      } catch (e) {}
    } else if (engine === 'firestore') {
      try {
        for (const phone of newPhonesList) {
          const docId = phone.id || `phone-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;
          await firestoreOps.setDoc('phones', docId, { ...phone, id: docId });
        }
      } catch (e) {}
    }

    safeWriteJson(PHONES_FILE, newPhonesList);
    return newPhonesList;
  },

  // ---------------- ADMIN AUTH ----------------
  async verifyAdminPin(pin) {
    const engine = await getActiveEngine();
    let pinHash = null;

    if (engine === 'rtdb') {
      try {
        const sec = await rtdbOps.get('admin/security');
        if (sec && sec.pinHash) pinHash = sec.pinHash;
      } catch (e) {}
    } else if (engine === 'firestore') {
      try {
        const sec = await firestoreOps.getDoc('admin', 'security');
        if (sec && sec.pinHash) pinHash = sec.pinHash;
      } catch (e) {}
    }

    if (!pinHash) {
      const adminData = safeReadJson(ADMIN_FILE, {});
      pinHash = adminData.pinHash;
    }

    if (!pinHash) return false;
    return bcrypt.compareSync(String(pin), pinHash);
  },

  async setAdminPin(newPin) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(String(newPin), salt);
    const data = {
      pinHash: hash,
      updatedAt: new Date().toISOString()
    };

    const engine = await getActiveEngine();
    if (engine === 'rtdb') {
      try {
        await rtdbOps.set('admin/security', data);
      } catch (e) {}
    } else if (engine === 'firestore') {
      try {
        await firestoreOps.setDoc('admin', 'security', data);
      } catch (e) {}
    }

    safeWriteJson(ADMIN_FILE, data);
    return true;
  },

  // ---------------- ADMIN ACCOUNTS ----------------
  async getAdminAccounts() {
    const adminData = safeReadJson(ADMIN_FILE, {});
    const accounts = adminData.accounts || [];
    return accounts.map(({ passwordHash, ...safeAcc }) => safeAcc);
  },

  async createAdminAccount({ name, username, email, password }) {
    const adminData = safeReadJson(ADMIN_FILE, {});
    if (!Array.isArray(adminData.accounts)) {
      adminData.accounts = [];
    }

    const cleanUsername = String(username || '').trim().toLowerCase();
    const cleanEmail = String(email || '').trim().toLowerCase();

    if (!cleanUsername) {
      throw new Error('Username is required.');
    }
    const passwordText = String(password || '');
    const passwordIsStrong = passwordText.length >= 8
      && /[A-Z]/.test(passwordText)
      && /[a-z]/.test(passwordText)
      && /\d/.test(passwordText);

    if (!passwordIsStrong) {
      throw new Error('Password must be at least 8 characters and include an uppercase letter, a lowercase letter, and a number.');
    }

    const exists = adminData.accounts.some(acc => 
      (acc.username && acc.username.toLowerCase() === cleanUsername) ||
      (cleanEmail && acc.email && acc.email.toLowerCase() === cleanEmail)
    );

    if (exists) {
      throw new Error(`An admin account with username "${cleanUsername}" already exists.`);
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(passwordText, salt);

    const newAccount = {
      id: `admin-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
      name: String(name || cleanUsername || 'Admin').trim(),
      username: cleanUsername,
      email: cleanEmail,
      passwordHash,
      role: 'admin',
      createdAt: new Date().toISOString()
    };

    adminData.accounts.push(newAccount);
    adminData.updatedAt = new Date().toISOString();

    const engine = await getActiveEngine();
    if (engine === 'rtdb') {
      try {
        await rtdbOps.set(`admin/accounts/${newAccount.id}`, newAccount);
      } catch(e) {}
    } else if (engine === 'firestore') {
      try {
        await firestoreOps.setDoc('admin_accounts', newAccount.id, newAccount);
      } catch(e) {}
    }

    safeWriteJson(ADMIN_FILE, adminData);

    const { passwordHash: _, ...safeAccount } = newAccount;
    return safeAccount;
  },

  async verifyAdminAccount(loginIdentifier, password) {
    const adminData = safeReadJson(ADMIN_FILE, {});
    const accounts = Array.isArray(adminData.accounts) ? adminData.accounts : [];

    const ident = String(loginIdentifier || '').trim().toLowerCase();
    const user = accounts.find(acc => 
      (acc.username && acc.username.toLowerCase() === ident) ||
      (acc.email && acc.email.toLowerCase() === ident)
    );

    if (user && user.passwordHash) {
      const match = bcrypt.compareSync(String(password), user.passwordHash);
      if (match) {
        const { passwordHash: _, ...safeAccount } = user;
        return safeAccount;
      }
    }

    // Also check master PIN fallback
    if (adminData.pinHash && (ident === 'admin' || ident === '' || !user)) {
      if (bcrypt.compareSync(String(password), adminData.pinHash)) {
        return {
          id: 'admin-master',
          name: 'Store Administrator',
          username: 'admin',
          email: '',
          role: 'admin'
        };
      }
    }

    return null;
  },

  // ---------------- INQUIRIES ----------------
  async createInquiry(data) {
    const id = `inq-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;
    const newInquiry = {
      id,
      phoneId: data.phoneId || null,
      model: data.model || 'Unknown',
      storage: data.storage || '',
      planKey: data.planKey || 'cash',
      planLabel: data.planLabel || '',
      cashPrice: data.cashPrice || 0,
      timestamp: new Date().toISOString(),
      userAgent: data.userAgent || '',
      ip: data.ip || ''
    };

    const engine = await getActiveEngine();
    if (engine === 'rtdb') {
      try {
        await rtdbOps.set(`inquiries/${id}`, newInquiry);
      } catch (e) {}
    } else if (engine === 'firestore') {
      try {
        await firestoreOps.setDoc('inquiries', id, newInquiry);
      } catch (e) {}
    }

    const inquiries = safeReadJson(INQUIRIES_FILE, []);
    inquiries.unshift(newInquiry);
    if (inquiries.length > 500) inquiries.length = 500;
    safeWriteJson(INQUIRIES_FILE, inquiries);

    return newInquiry;
  },

  async getInquiries(limit = 50) {
    const engine = await getActiveEngine();
    if (engine === 'rtdb') {
      try {
        const val = await rtdbOps.get('inquiries');
        if (val) {
          const list = Array.isArray(val) ? val.filter(Boolean) : Object.values(val);
          return list.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, limit);
        }
      } catch (e) {}
    } else if (engine === 'firestore') {
      try {
        const list = await firestoreOps.getCollection('inquiries', limit);
        if (list && list.length > 0) {
          return list.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, limit);
        }
      } catch (e) {}
    }

    const inquiries = safeReadJson(INQUIRIES_FILE, []);
    return inquiries.slice(0, limit);
  },

  // ---------------- SETTINGS ----------------
  async getSettings() {
    const defaultSettings = {
      whatsappNumber: config.WHATSAPP_NUMBER,
      storeName: 'DRG Phones Palace',
      location: 'Nairobi, Kenya'
    };

    const engine = await getActiveEngine();
    if (engine === 'rtdb') {
      try {
        const val = await rtdbOps.get('settings/general');
        if (val) return val;
      } catch (e) {}
    } else if (engine === 'firestore') {
      try {
        const val = await firestoreOps.getDoc('settings', 'general');
        if (val) return val;
      } catch (e) {}
    }

    return safeReadJson(SETTINGS_FILE, defaultSettings);
  },

  async updateSettings(updates) {
    const current = await this.getSettings();
    const next = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    const engine = await getActiveEngine();
    if (engine === 'rtdb') {
      try {
        await rtdbOps.set('settings/general', next);
      } catch (e) {}
    } else if (engine === 'firestore') {
      try {
        await firestoreOps.setDoc('settings', 'general', next);
      } catch (e) {}
    }

    safeWriteJson(SETTINGS_FILE, next);
    return next;
  },

  // ---------------- DASHBOARD STATS ----------------
  async getStats() {
    const phones = await this.getAllPhones();
    const inquiries = await this.getInquiries(50);

    let samsungCount = 0;
    let iphoneCount = 0;
    let motorolaCount = 0;
    let otherCount = 0;

    let weeklySum = 0;
    let weeklyCount = 0;

    phones.forEach(p => {
      if (p.category === 'samsung') samsungCount++;
      else if (p.category === 'iphone') iphoneCount++;
      else if (p.category === 'motorola') motorolaCount++;
      else otherCount++;

      if (p.plans && p.plans.mostandard && p.plans.mostandard.weekly) {
        weeklySum += p.plans.mostandard.weekly;
        weeklyCount++;
      } else if (p.plans && p.plans.standard && p.plans.standard.weekly) {
        weeklySum += p.plans.standard.weekly;
        weeklyCount++;
      } else if (p.plans && p.plans.mosaver && p.plans.mosaver.weekly) {
        weeklySum += p.plans.mosaver.weekly;
        weeklyCount++;
      }
    });

    const avgWeekly = weeklyCount > 0 ? Math.round(weeklySum / weeklyCount) : 0;

    return {
      totalDevices: phones.length,
      samsungCount,
      iphoneCount,
      motorolaCount,
      otherCount,
      avgWeekly,
      totalInquiries: inquiries.length,
      recentInquiries: inquiries.slice(0, 10)
    };
  }
};

module.exports = db;

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
  testRtdbAccess
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

const db = {
  // Check active engine status
  async getStatus() {
    const engine = await getActiveEngine();
    let dbName = 'Local JSON Store';
    if (engine === 'rtdb') dbName = 'Firebase Realtime Database';
    if (engine === 'firestore') dbName = 'Google Cloud Firestore';

    return {
      database: dbName,
      engine: engine,
      projectId: config.firebaseConfig.projectId,
      databaseURL: config.firebaseConfig.databaseURL,
      firebaseEnabled: config.USE_FIREBASE,
      rtdbActive: engine === 'rtdb',
      firestoreActive: engine === 'firestore'
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
    if (engine === 'rtdb') {
      try {
        const p = await rtdbOps.get(`phones/${id}`);
        if (p) return p;
      } catch (e) {}
    } else if (engine === 'firestore') {
      try {
        const p = await firestoreOps.getDoc('phones', id);
        if (p) return p;
      } catch (e) {}
    }

    const phones = safeReadJson(PHONES_FILE, DEFAULT_PHONES);
    return phones.find(p => p.id === id) || null;
  },

  async createPhone(phoneData) {
    const id = phoneData.id || `phone-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;
    const newPhone = {
      ...phoneData,
      id,
      createdAt: new Date().toISOString()
    };

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
    const engine = await getActiveEngine();
    const payload = {
      ...updates,
      id,
      updatedAt: new Date().toISOString()
    };

    if (engine === 'rtdb') {
      try {
        await rtdbOps.update(`phones/${id}`, payload);
      } catch (e) {}
    } else if (engine === 'firestore') {
      try {
        await firestoreOps.updateDoc('phones', id, payload);
      } catch (e) {}
    }

    const phones = safeReadJson(PHONES_FILE, DEFAULT_PHONES);
    const index = phones.findIndex(p => p.id === id);
    if (index !== -1) {
      phones[index] = { ...phones[index], ...payload };
      safeWriteJson(PHONES_FILE, phones);
      return phones[index];
    }
    return payload;
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

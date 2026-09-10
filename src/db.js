const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const config = require('./config');
const { DEFAULT_PHONES } = require('../data/seedData');
const { firestoreOps, isFirebaseConnected, testFirestoreAccess } = require('./firebase');

// Local file paths
const PHONES_FILE = path.join(config.DATA_DIR, 'phones.json');
const ADMIN_FILE = path.join(config.DATA_DIR, 'admin.json');
const INQUIRIES_FILE = path.join(config.DATA_DIR, 'inquiries.json');
const SETTINGS_FILE = path.join(config.DATA_DIR, 'settings.json');

// Ensure local directory exists
if (!fs.existsSync(config.DATA_DIR)) {
  fs.mkdirSync(config.DATA_DIR, { recursive: true });
}

// Atomic file write helper to prevent partial writes / corruption
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

// Initialize Local JSON files
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

// Check if we should use Firestore
async function shouldUseFirestore() {
  if (!config.USE_FIREBASE) return false;
  return await testFirestoreAccess();
}

// DB Operations Object
const db = {
  // Check active mode
  async getStatus() {
    const firestoreActive = await shouldUseFirestore();
    return {
      database: firestoreActive ? 'Cloud Firestore' : 'Local JSON Store',
      projectId: config.firebaseConfig.projectId,
      firebaseEnabled: config.USE_FIREBASE,
      firestoreActive
    };
  },

  // ---------------- PHONES ----------------
  async getAllPhones(options = {}) {
    const useFirestore = await shouldUseFirestore();
    let phones = [];

    if (useFirestore) {
      try {
        phones = await firestoreOps.getCollection('phones');
        // If Firestore is empty, auto-seed with DEFAULT_PHONES
        if (!phones || phones.length === 0) {
          console.log('[Firebase] Seeding initial phone inventory into Cloud Firestore...');
          for (const phone of DEFAULT_PHONES) {
            await firestoreOps.setDoc('phones', phone.id, phone);
          }
          phones = [...DEFAULT_PHONES];
        }
      } catch (err) {
        console.warn('[Firebase] Error reading phones from Firestore, falling back to local store:', err.message);
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
    const useFirestore = await shouldUseFirestore();
    if (useFirestore) {
      try {
        const doc = await firestoreOps.getDoc('phones', id);
        if (doc) return doc;
      } catch (err) {
        console.warn(`[Firebase] Error fetching phone ${id}:`, err.message);
      }
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

    const useFirestore = await shouldUseFirestore();
    if (useFirestore) {
      try {
        await firestoreOps.setDoc('phones', id, newPhone);
        console.log(`[Firebase] Phone created in Firestore: ${newPhone.model} (${id})`);
      } catch (err) {
        console.warn('[Firebase] Error saving to Firestore, writing locally:', err.message);
      }
    }

    // Always keep local backup up to date
    const phones = safeReadJson(PHONES_FILE, DEFAULT_PHONES);
    phones.unshift(newPhone);
    safeWriteJson(PHONES_FILE, phones);

    return newPhone;
  },

  async updatePhone(id, updates) {
    let updated = null;
    const useFirestore = await shouldUseFirestore();

    if (useFirestore) {
      try {
        const payload = {
          ...updates,
          id,
          updatedAt: new Date().toISOString()
        };
        updated = await firestoreOps.updateDoc('phones', id, payload);
      } catch (err) {
        console.warn(`[Firebase] Error updating phone ${id} in Firestore:`, err.message);
      }
    }

    // Update local store as well
    const phones = safeReadJson(PHONES_FILE, DEFAULT_PHONES);
    const index = phones.findIndex(p => p.id === id);
    if (index !== -1) {
      phones[index] = {
        ...phones[index],
        ...updates,
        id,
        updatedAt: new Date().toISOString()
      };
      safeWriteJson(PHONES_FILE, phones);
      if (!updated) updated = phones[index];
    }

    return updated;
  },

  async deletePhone(id) {
    let removed = null;
    const useFirestore = await shouldUseFirestore();

    if (useFirestore) {
      try {
        await firestoreOps.deleteDoc('phones', id);
        console.log(`[Firebase] Deleted phone ${id} from Firestore`);
      } catch (err) {
        console.warn(`[Firebase] Error deleting phone from Firestore:`, err.message);
      }
    }

    const phones = safeReadJson(PHONES_FILE, DEFAULT_PHONES);
    const index = phones.findIndex(p => p.id === id);
    if (index !== -1) {
      removed = phones.splice(index, 1)[0];
      safeWriteJson(PHONES_FILE, phones);
    }

    return removed;
  },

  async resetPhones() {
    const useFirestore = await shouldUseFirestore();
    if (useFirestore) {
      try {
        for (const p of DEFAULT_PHONES) {
          await firestoreOps.setDoc('phones', p.id, p);
        }
      } catch (err) {
        console.warn('[Firebase] Error resetting Firestore phones:', err.message);
      }
    }

    safeWriteJson(PHONES_FILE, DEFAULT_PHONES);
    return DEFAULT_PHONES;
  },

  async importPhones(newPhonesList) {
    if (!Array.isArray(newPhonesList)) {
      throw new Error('Imported data must be an array of phones.');
    }

    const useFirestore = await shouldUseFirestore();
    if (useFirestore) {
      try {
        for (const phone of newPhonesList) {
          const docId = phone.id || `phone-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;
          await firestoreOps.setDoc('phones', docId, { ...phone, id: docId });
        }
      } catch (err) {
        console.warn('[Firebase] Error importing phones to Firestore:', err.message);
      }
    }

    safeWriteJson(PHONES_FILE, newPhonesList);
    return newPhonesList;
  },

  // ---------------- ADMIN AUTH ----------------
  async verifyAdminPin(pin) {
    const useFirestore = await shouldUseFirestore();
    let pinHash = null;

    if (useFirestore) {
      try {
        const adminDoc = await firestoreOps.getDoc('admin', 'security');
        if (adminDoc && adminDoc.pinHash) {
          pinHash = adminDoc.pinHash;
        }
      } catch (err) {
        console.warn('[Firebase] Error reading admin PIN from Firestore:', err.message);
      }
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

    const useFirestore = await shouldUseFirestore();
    if (useFirestore) {
      try {
        await firestoreOps.setDoc('admin', 'security', data);
        console.log('[Firebase] Admin PIN updated in Firestore');
      } catch (err) {
        console.warn('[Firebase] Error updating admin PIN in Firestore:', err.message);
      }
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

    const useFirestore = await shouldUseFirestore();
    if (useFirestore) {
      try {
        await firestoreOps.setDoc('inquiries', id, newInquiry);
        console.log(`[Firebase] Inquiry stored in Firestore: ${id}`);
      } catch (err) {
        console.warn('[Firebase] Error writing inquiry to Firestore:', err.message);
      }
    }

    const inquiries = safeReadJson(INQUIRIES_FILE, []);
    inquiries.unshift(newInquiry);
    if (inquiries.length > 500) {
      inquiries.length = 500;
    }
    safeWriteJson(INQUIRIES_FILE, inquiries);

    return newInquiry;
  },

  async getInquiries(limit = 50) {
    const useFirestore = await shouldUseFirestore();
    if (useFirestore) {
      try {
        const inquiries = await firestoreOps.getCollection('inquiries', limit);
        if (inquiries && inquiries.length > 0) {
          return inquiries.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, limit);
        }
      } catch (err) {
        console.warn('[Firebase] Error reading inquiries from Firestore:', err.message);
      }
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

    const useFirestore = await shouldUseFirestore();
    if (useFirestore) {
      try {
        const doc = await firestoreOps.getDoc('settings', 'general');
        if (doc) return doc;
      } catch (err) {
        console.warn('[Firebase] Error getting settings from Firestore:', err.message);
      }
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

    const useFirestore = await shouldUseFirestore();
    if (useFirestore) {
      try {
        await firestoreOps.setDoc('settings', 'general', next);
        console.log('[Firebase] Settings updated in Firestore');
      } catch (err) {
        console.warn('[Firebase] Error updating settings in Firestore:', err.message);
      }
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

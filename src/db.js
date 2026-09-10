const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const config = require('./config');
const { DEFAULT_PHONES } = require('../data/seedData');

// File paths
const PHONES_FILE = path.join(config.DATA_DIR, 'phones.json');
const ADMIN_FILE = path.join(config.DATA_DIR, 'admin.json');
const INQUIRIES_FILE = path.join(config.DATA_DIR, 'inquiries.json');
const SETTINGS_FILE = path.join(config.DATA_DIR, 'settings.json');

// Ensure directory exists
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

// Initialization of DB stores
function initDb() {
  // 1. Phones store
  if (!fs.existsSync(PHONES_FILE)) {
    safeWriteJson(PHONES_FILE, DEFAULT_PHONES);
  }

  // 2. Admin PIN store
  if (!fs.existsSync(ADMIN_FILE)) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(config.ADMIN_DEFAULT_PIN, salt);
    safeWriteJson(ADMIN_FILE, {
      pinHash: hash,
      updatedAt: new Date().toISOString()
    });
  }

  // 3. Inquiries store
  if (!fs.existsSync(INQUIRIES_FILE)) {
    safeWriteJson(INQUIRIES_FILE, []);
  }

  // 4. Settings store
  if (!fs.existsSync(SETTINGS_FILE)) {
    safeWriteJson(SETTINGS_FILE, {
      whatsappNumber: config.WHATSAPP_NUMBER,
      storeName: 'DRG Phones Palace',
      location: 'Nairobi, Kenya',
      updatedAt: new Date().toISOString()
    });
  }
}

initDb();

// DB Operations Object
const db = {
  // Phones
  getAllPhones(options = {}) {
    let phones = safeReadJson(PHONES_FILE, DEFAULT_PHONES);
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

  getPhoneById(id) {
    const phones = safeReadJson(PHONES_FILE, DEFAULT_PHONES);
    return phones.find(p => p.id === id) || null;
  },

  createPhone(phoneData) {
    const phones = safeReadJson(PHONES_FILE, DEFAULT_PHONES);
    const id = phoneData.id || `phone-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;
    const newPhone = {
      ...phoneData,
      id,
      createdAt: new Date().toISOString()
    };
    phones.unshift(newPhone);
    safeWriteJson(PHONES_FILE, phones);
    return newPhone;
  },

  updatePhone(id, updates) {
    const phones = safeReadJson(PHONES_FILE, DEFAULT_PHONES);
    const index = phones.findIndex(p => p.id === id);
    if (index === -1) return null;

    phones[index] = {
      ...phones[index],
      ...updates,
      id: phones[index].id, // preserve ID
      updatedAt: new Date().toISOString()
    };

    safeWriteJson(PHONES_FILE, phones);
    return phones[index];
  },

  deletePhone(id) {
    const phones = safeReadJson(PHONES_FILE, DEFAULT_PHONES);
    const index = phones.findIndex(p => p.id === id);
    if (index === -1) return false;

    const removed = phones.splice(index, 1)[0];
    safeWriteJson(PHONES_FILE, phones);
    return removed;
  },

  resetPhones() {
    safeWriteJson(PHONES_FILE, DEFAULT_PHONES);
    return DEFAULT_PHONES;
  },

  importPhones(newPhonesList) {
    if (!Array.isArray(newPhonesList)) {
      throw new Error('Imported data must be an array of phones.');
    }
    safeWriteJson(PHONES_FILE, newPhonesList);
    return newPhonesList;
  },

  // Admin Auth
  verifyAdminPin(pin) {
    const adminData = safeReadJson(ADMIN_FILE, {});
    if (!adminData.pinHash) return false;
    return bcrypt.compareSync(String(pin), adminData.pinHash);
  },

  setAdminPin(newPin) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(String(newPin), salt);
    const data = {
      pinHash: hash,
      updatedAt: new Date().toISOString()
    };
    safeWriteJson(ADMIN_FILE, data);
    return true;
  },

  // Inquiries
  createInquiry(data) {
    const inquiries = safeReadJson(INQUIRIES_FILE, []);
    const newInquiry = {
      id: `inq-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
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
    inquiries.unshift(newInquiry);
    // Keep last 500 inquiries
    if (inquiries.length > 500) {
      inquiries.length = 500;
    }
    safeWriteJson(INQUIRIES_FILE, inquiries);
    return newInquiry;
  },

  getInquiries(limit = 50) {
    const inquiries = safeReadJson(INQUIRIES_FILE, []);
    return inquiries.slice(0, limit);
  },

  // Settings
  getSettings() {
    return safeReadJson(SETTINGS_FILE, {
      whatsappNumber: config.WHATSAPP_NUMBER,
      storeName: 'DRG Phones Palace',
      location: 'Nairobi, Kenya'
    });
  },

  updateSettings(updates) {
    const current = safeReadJson(SETTINGS_FILE, {});
    const next = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    safeWriteJson(SETTINGS_FILE, next);
    return next;
  },

  // Dashboard Stats
  getStats() {
    const phones = safeReadJson(PHONES_FILE, DEFAULT_PHONES);
    const inquiries = safeReadJson(INQUIRIES_FILE, []);

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

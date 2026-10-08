const fs = require('fs');
const path = require('path');

async function auditSite() {
  const base = 'http://localhost:3000';
  console.log('==============================================');
  console.log('🔍 DRG PHONES PALACE — COMPREHENSIVE SITE AUDIT');
  console.log('==============================================\n');

  let passed = 0;
  let warnings = 0;
  let failed = 0;

  function report(name, ok, details = '') {
    if (ok) {
      passed++;
      console.log(`[PASS] ${name}${details ? ' -> ' + details : ''}`);
    } else {
      failed++;
      console.log(`[FAIL] ${name}${details ? ' -> ' + details : ''}`);
    }
  }

  // 1. Health & Server Status
  try {
    const res = await fetch(`${base}/api/health`);
    const data = await res.json();
    report('API Health & Database Mode', res.ok && data.status === 'healthy', 
      `Database: ${data.database} (Project: ${data.firebaseProjectId})`);
  } catch (e) {
    report('API Health & Database Mode', false, e.message);
  }

  // 2. Static Delivery
  try {
    const r1 = await fetch(`${base}/`);
    report('Customer Storefront (/)', r1.status === 200, `${r1.headers.get('content-type')}`);
    const r2 = await fetch(`${base}/admin.html`);
    report('Admin Dashboard (/admin.html)', r2.status === 200, `${r2.headers.get('content-type')}`);
    const r3 = await fetch(`${base}/assets/site.css`);
    report('Site CSS (/assets/site.css)', r3.status === 200, `${(await r3.text()).length} bytes`);
    const r4 = await fetch(`${base}/assets/site.js`);
    report('Site JS (/assets/site.js)', r4.status === 200, `${(await r4.text()).length} bytes`);
  } catch (e) {
    report('Static Delivery', false, e.message);
  }

  // 3. Image Assets Audit
  const keyImages = [
    'images/drg-logo.png',
    'images/phones-bg.jpg',
    'images/phones-ambient-lively.jpg',
    'images/phones-hero-lively.jpg',
    'images/phones-waves-lively.jpg',
    'images/galaxy-s25-ultra.jpg',
    'images/galaxy-s24-ultra.jpg',
    'images/galaxy-s23-ultra.jpg',
    'images/galaxy-s22-ultra.jpg',
    'images/galaxy-s21-ultra.jpg',
    'images/galaxy-s21-plus.jpg',
    'images/galaxy-s22-plus.jpg',
    'images/galaxy-s20-ultra.jpg',
    'images/galaxy-note-20.jpg',
    'images/galaxy-a14.jpg',
    'images/iphone-11.jpg',
    'images/iphone-xr.jpg',
    'images/iphone-12.jpg',
    'images/moto-g54.jpg',
    'images/moto-edge-40.jpg'
  ];

  let missingImgs = 0;
  for (const img of keyImages) {
    const imgRes = await fetch(`${base}/${img}`);
    if (imgRes.status !== 200) {
      missingImgs++;
      console.warn(`⚠️ Missing image asset: ${img}`);
    }
  }
  report('Catalogue & Showroom Image Assets', missingImgs === 0, `${keyImages.length - missingImgs}/${keyImages.length} verified`);

  // 4. Admin Auth & Token Issuance
  let token = null;
  try {
    const loginRes = await fetch(`${base}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin: '2540' })
    });
    const loginData = await loginRes.json();
    token = loginData.token;
    report('Admin Authentication (PIN 2540)', loginRes.ok && loginData.success && !!token, 'JWT issued');
  } catch (e) {
    report('Admin Authentication', false, e.message);
  }

  // 5. Store Settings Endpoint
  try {
    const setRes = await fetch(`${base}/api/settings`);
    const setData = await setRes.json();
    report('Store Settings (/api/settings)', setRes.ok && setData.success, 
      `WhatsApp: ${setData.data.whatsappNumber}, Store: "${setData.data.storeName}"`);
  } catch (e) {
    report('Store Settings', false, e.message);
  }

  // 6. Public Phones Inventory
  let initialCount = 0;
  try {
    const phonesRes = await fetch(`${base}/api/phones`);
    const phonesData = await phonesRes.json();
    initialCount = phonesData.count;
    report('Catalogue Inventory (/api/phones)', phonesRes.ok && phonesData.success, 
      `${phonesData.count} renewed phones available`);
  } catch (e) {
    report('Catalogue Inventory', false, e.message);
  }

  // 7. Customer Inquiry Submission Simulation
  let testInquiryId = null;
  try {
    const inqRes = await fetch(`${base}/api/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'Audit Galaxy Test',
        storage: '256GB',
        planKey: 'mosaver',
        planLabel: 'MoSaver (6M)',
        cashPrice: 35999
      })
    });
    const inqData = await inqRes.json();
    testInquiryId = inqData.data ? inqData.data.id : null;
    report('Customer Inquiry Registration (/api/inquiries)', inqRes.ok && inqData.success, 
      `Inquiry registered: ${testInquiryId}`);
  } catch (e) {
    report('Customer Inquiry Registration', false, e.message);
  }

  // 8. Admin Inquiries List View (Protected)
  try {
    const getInqRes = await fetch(`${base}/api/inquiries`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const getInqData = await getInqRes.json();
    report('Admin Inquiries Review (/api/inquiries protected)', getInqRes.ok && getInqData.success, 
      `${getInqData.count} inquiries recorded in database`);
  } catch (e) {
    report('Admin Inquiries Review', false, e.message);
  }

  // 9. Admin Arbitrary Pricing Validation (Create, Update with odd numbers)
  const arbitraryTestPhone = {
    id: 'audit-device-' + Date.now(),
    model: 'Audit Phone Note 20 Flagship',
    category: 'samsung',
    categoryLabel: 'Samsung',
    storage: '256GB',
    condition: 'Renewed · Grade A+',
    cashPrice: 35999, // odd price
    plans: {
      cash: { label: 'Cash', deposit: 0, weekly: 0, weeks: 0, total: 35999 },
      mosaver: { label: 'MoSaver (6M)', deposit: 16199, weekly: 1370, weeks: 26, total: 51819 }, // arbitrary deposit & weekly
      mostandard: { label: 'MoStandard (12M)', deposit: 8999, weekly: 1160, weeks: 52, total: 69319 }
    },
    defaultPlan: 'mostandard'
  };

  try {
    // Create
    const createRes = await fetch(`${base}/api/phones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(arbitraryTestPhone)
    });
    const createData = await createRes.json();

    // Update with another arbitrary amount (e.g. 35987.50)
    const updateRes = await fetch(`${base}/api/phones/${arbitraryTestPhone.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ ...arbitraryTestPhone, cashPrice: 35987 })
    });
    const updateData = await updateRes.json();

    // Delete
    const delRes = await fetch(`${base}/api/phones/${arbitraryTestPhone.id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const delData = await delRes.json();

    const ok = createRes.ok && updateRes.ok && delRes.ok;
    report('Arbitrary Price Admin CRUD (35,999 / 16,199 / 8,999)', ok, 
      `Create: ${createRes.status}, Update: ${updateRes.status}, Delete: ${delRes.status}`);
  } catch (e) {
    report('Arbitrary Price Admin CRUD', false, e.message);
  }

  // 10. Dashboard Stats
  try {
    const statsRes = await fetch(`${base}/api/admin/stats`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const statsData = await statsRes.json();
    report('Dashboard Stats Calculation', statsRes.ok && statsData.success, 
      `Devices: ${statsData.data.totalDevices}, Avg Weekly: KES ${statsData.data.avgWeekly}, Inquiries: ${statsData.data.totalInquiries}`);
  } catch (e) {
    report('Dashboard Stats Calculation', false, e.message);
  }

  console.log('\n==============================================');
  console.log(`📊 AUDIT SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('==============================================');
}

auditSite().catch(console.error);

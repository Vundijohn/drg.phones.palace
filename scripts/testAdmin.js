const fs = require('fs');
const path = require('path');

async function runTests() {
  const base = 'http://localhost:3000';
  console.log('--- STARTING ADMIN TESTS ---');

  // Test 1: Health check
  console.log('\n[1] Checking /api/health...');
  const healthRes = await fetch(`${base}/api/health`);
  const healthData = await healthRes.json();
  console.log('Health response:', healthData);

  // Test 2: Fetch admin.html
  console.log('\n[2] Checking admin.html page delivery...');
  const pageRes = await fetch(`${base}/admin.html`);
  const htmlContent = await pageRes.text();
  console.log('admin.html status:', pageRes.status, 'bytes:', htmlContent.length);

  // Test 3: Test incorrect PIN login
  console.log('\n[3] Testing wrong PIN login...');
  const wrongPinRes = await fetch(`${base}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pin: '9999' })
  });
  const wrongPinData = await wrongPinRes.json();
  console.log('Wrong PIN status:', wrongPinRes.status, 'success:', wrongPinData.success);

  // Test 4: Test correct PIN login (default 2540)
  console.log('\n[4] Testing correct PIN login (2540)...');
  const correctPinRes = await fetch(`${base}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pin: '2540' })
  });
  const correctPinData = await correctPinRes.json();
  console.log('Correct PIN status:', correctPinRes.status, 'success:', correctPinData.success);
  console.log('Token received:', !!correctPinData.token);
  const token = correctPinData.token;

  // Test 5: Check admin session verification
  console.log('\n[5] Checking protected /api/admin/me & /api/admin/verify...');
  const meRes = await fetch(`${base}/api/admin/me`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log('/api/admin/me:', meRes.status, await meRes.json());

  const verifyRes = await fetch(`${base}/api/admin/verify`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log('/api/admin/verify:', verifyRes.status, await verifyRes.json());

  // Test 6: Check database status
  console.log('\n[6] Checking /api/admin/status...');
  const statusRes = await fetch(`${base}/api/admin/status`);
  console.log('/api/admin/status:', await statusRes.json());

  // Test 7: Check admin stats
  console.log('\n[7] Checking /api/admin/stats...');
  const statsRes = await fetch(`${base}/api/admin/stats`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log('/api/admin/stats:', await statsRes.json());

  // Test 8: Check phones inventory API
  console.log('\n[8] Checking /api/phones catalogue...');
  const phonesRes = await fetch(`${base}/api/phones`);
  const phonesData = await phonesRes.json();
  console.log('/api/phones count:', phonesData.count, 'success:', phonesData.success);
  if (phonesData.data && phonesData.data.length > 0) {
    console.log('Sample phone:', phonesData.data[0].model, phonesData.data[0].cashPrice);
  }

  // Test 9: Test phone CRUD via Admin API
  console.log('\n[9] Testing CRUD - Add test phone...');
  const testPhone = {
    id: 'test-unit-' + Date.now(),
    model: 'Test Galaxy Admin Phone',
    category: 'samsung',
    categoryLabel: 'Samsung',
    storage: '128GB',
    condition: 'Renewed · Grade A+',
    cashPrice: 32000,
    specs: ['Test spec 1', 'Test spec 2'],
    plans: {
      cash: { label: 'Cash', deposit: 0, weekly: 0, weeks: 0, total: 32000 },
      mosaver: { label: 'MoSaver', deposit: 14400, weekly: 1200, weeks: 26, total: 45600 },
      mostandard: { label: 'MoStandard', deposit: 11200, weekly: 900, weeks: 52, total: 58000 }
    },
    defaultPlan: 'mostandard'
  };

  const createRes = await fetch(`${base}/api/phones`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(testPhone)
  });
  const createData = await createRes.json();
  console.log('Create phone status:', createRes.status, 'success:', createData.success);

  // Test 10: Update test phone
  console.log('\n[10] Testing CRUD - Update test phone...');
  const updateRes = await fetch(`${base}/api/phones/${testPhone.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ ...testPhone, cashPrice: 33000 })
  });
  const updateData = await updateRes.json();
  console.log('Update phone status:', updateRes.status, 'success:', updateData.success);

  // Test 11: Delete test phone
  console.log('\n[11] Testing CRUD - Delete test phone...');
  const deleteRes = await fetch(`${base}/api/phones/${testPhone.id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const deleteData = await deleteRes.json();
  console.log('Delete phone status:', deleteRes.status, 'success:', deleteData.success);

  // Test 12: Validate client-side JS and DOM in admin.html
  console.log('\n[12] Validating admin.html DOM IDs & element bindings...');
  const idsToCheck = [
    'pinGateScreen', 'adminDashboardScreen', 'pinCard', 'logoutBtn', 'currentAdminName',
    'tabSignInBtn', 'tabRegisterBtn', 'adminLoginForm', 'adminRegisterForm',
    'loginUsername', 'loginPassword', 'loginError', 'togglePinLoginBtn', 'pinLoginSection',
    'gatePinInput', 'pinUnlockSubmitBtn', 'regFullName', 'regUsername', 'regEmail',
    'regPassword', 'regConfirmPassword', 'registerError', 'registerSuccess',
    'themeToggleBtn', 'themeIcon', 'themeLabel', 'adminToast',
    'kpiTotalDevices', 'kpiSamsungCount', 'kpiIphoneCount', 'kpiAvgWeekly',
    'adminSearchInput', 'inventoryTableBody', 'tableEmptyState', 'adminCategoryFilter',
    'addPhoneModal', 'openAddPhoneModalBtn', 'closeAddPhoneModalBtn', 'cancelAddPhoneBtn',
    'addPhoneForm', 'planTypeSamsungBtn', 'planTypeStandardBtn', 'multiTierFields', 'singleTierFields',
    'newPhoneModel', 'newPhoneStorage', 'newPhoneCategory', 'newPhoneCondition', 'newPhoneSpecs',
    'newPhoneCashPrice', 'recalcPlansBtn', 'newMoSaverDeposit', 'newMoSaverWeekly',
    'newMoStandardDeposit', 'newMoStandardWeekly', 'newStandardDeposit', 'newStandardWeekly', 'newStandardWeeks',
    'deleteConfirmModal', 'deleteModalMessage', 'closeDeleteModalBtn', 'cancelDeleteBtn', 'confirmDeleteBtn',
    'changePinModal', 'changePinBtn', 'closeChangePinModalBtn', 'cancelChangePinBtn',
    'changePinForm', 'currentPinInput', 'newPinInput', 'changePinError',
    'backupModalBtn', 'backupModal', 'closeBackupModalBtn', 'cancelBackupBtn',
    'backupJsonTextarea', 'copyJsonBtn', 'importJsonBtn', 'resetCatalogueBtn',
    'photoPreviewBox', 'photoPreviewImg', 'photoPreviewPlaceholder', 'clearPhotoBtn',
    'phoneFileInput', 'uploadPhotoBtn', 'uploadProgressHint', 'newPhoneImage', 'phoneGalleryPreview',
    'backendStatusBadge'
  ];

  let missingIds = [];
  for (const id of idsToCheck) {
    if (!htmlContent.includes(`id="${id}"`)) {
      missingIds.push(id);
    }
  }

  if (missingIds.length === 0) {
    console.log('✅ All 60+ critical DOM IDs required by JavaScript exist in admin.html!');
  } else {
    console.warn('⚠️ Missing DOM IDs found in admin.html:', missingIds);
  }

  // Check script tags for syntax validity
  const scriptMatch = htmlContent.match(/<script[\s\S]*?>([\s\S]*?)<\/script>/i);
  if (scriptMatch && scriptMatch[1]) {
    try {
      new Function(scriptMatch[1].replace(/const /g, 'var ').replace(/let /g, 'var '));
      console.log('✅ JavaScript inside admin.html parsed successfully (no syntax errors)!');
    } catch (syntaxErr) {
      // Some globals like document/window/fetch will throw ReferenceError at execution, but syntax error is SyntaxError
      if (syntaxErr.name === 'SyntaxError') {
        console.error('❌ Syntax error in admin.html script:', syntaxErr.message);
      } else {
        console.log('✅ JavaScript syntax in admin.html is valid! (Runtime reference: ' + syntaxErr.message + ')');
      }
    }
  }

  console.log('\n--- TESTS COMPLETE ---');
}

runTests().catch(err => {
  console.error('Test run failed:', err);
  process.exit(1);
});

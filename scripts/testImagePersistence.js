const fs = require('fs');
const path = require('path');

async function runTest() {
  const base = 'http://localhost:3000';
  console.log('======================================================');
  console.log('🧪 TESTING IMAGE UPLOAD & PERSISTENCE ARCHITECTURE');
  console.log('======================================================\n');

  let passed = 0;
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

  // 1. Storage Status
  let uploadStatus = null;
  try {
    const res = await fetch(`${base}/api/upload/status`);
    uploadStatus = await res.json();
    report('Upload Engine Status', res.ok && uploadStatus.success, 
      `Storage: ${uploadStatus.storage} (isCloudStorage: ${uploadStatus.isCloudStorage})`);
  } catch (e) {
    report('Upload Engine Status', false, e.message);
  }

  // 2. Admin Auth
  let token = null;
  try {
    const res = await fetch(`${base}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin: '2540' })
    });
    const data = await res.json();
    token = data.token;
    report('Admin Authentication', res.ok && data.success && !!token, 'Token acquired');
  } catch (e) {
    report('Admin Authentication', false, e.message);
  }

  // 3. Multipart Upload
  let uploadedUrl = null;
  try {
    const logoPath = path.resolve(__dirname, '..', 'images', 'drg-logo.png');
    const fileBuf = fs.readFileSync(logoPath);
    const blob = new Blob([fileBuf], { type: 'image/png' });
    const formData = new FormData();
    formData.append('image', blob, 'test-phone-logo.png');

    const res = await fetch(`${base}/api/upload`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });
    const data = await res.json();
    uploadedUrl = data.url;
    report('Multipart Image Upload', res.ok && data.success && !!uploadedUrl,
      `Engine: ${data.storage}, URL: ${uploadedUrl.slice(0, 70)}...`);
  } catch (e) {
    report('Multipart Image Upload', false, e.message);
  }

  // 4. Verify Uploaded Image Accessibility (HTTP 200)
  try {
    const res = await fetch(uploadedUrl);
    report('Uploaded Image Download Verification', res.status === 200,
      `Status: ${res.status}, Content-Type: ${res.headers.get('content-type')}`);
  } catch (e) {
    report('Uploaded Image Download Verification', false, e.message);
  }

  // 5. Base64 Upload Endpoint
  let base64Url = null;
  try {
    const sampleDataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const res = await fetch(`${base}/api/upload/base64`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        imageBase64: sampleDataUrl,
        filename: 'test-pixel.png'
      })
    });
    const data = await res.json();
    base64Url = data.url;
    report('Base64 Direct Upload Endpoint', res.ok && data.success && !!base64Url,
      `Saved: ${base64Url.slice(0, 60)}...`);
  } catch (e) {
    report('Base64 Direct Upload Endpoint', false, e.message);
  }

  // 6. Device Creation with Uploaded Image
  const testPhoneId = 'test-img-persist-' + Date.now();
  try {
    const newPhone = {
      id: testPhoneId,
      model: 'Persistence Test Phone',
      category: 'samsung',
      categoryLabel: 'Samsung',
      storage: '256GB',
      condition: 'Renewed · Grade A+',
      image: uploadedUrl,
      images: [uploadedUrl, base64Url].filter(Boolean),
      cashPrice: 45000,
      specs: ['Flagship processor', '5G ready'],
      plans: {
        cash: { label: 'Cash', deposit: 0, weekly: 0, weeks: 0, total: 45000 },
        mostandard: { label: 'MoStandard', deposit: 15750, weekly: 1100, weeks: 52, total: 72950 }
      },
      defaultPlan: 'mostandard'
    };

    const res = await fetch(`${base}/api/phones`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newPhone)
    });
    const data = await res.json();
    report('Add Phone with Uploaded Image', res.ok && data.success,
      `ID: ${testPhoneId}, Primary: ${data.data && data.data.image ? data.data.image.slice(0, 40) + '...' : 'none'}`);
  } catch (e) {
    report('Add Phone with Uploaded Image', false, e.message);
  }

  // 7. Verify Phone Image Persistence via Public API
  try {
    const res = await fetch(`${base}/api/phones/${testPhoneId}`);
    const data = await res.json();
    const hasImage = data.success && data.data && data.data.image === uploadedUrl;
    const hasImagesArray = data.success && data.data && Array.isArray(data.data.images) && data.data.images.length >= 1;
    report('Phone Image Retrieval & Array Normalization', hasImage && hasImagesArray,
      `Stored primary: ${hasImage ? 'Matches uploaded URL' : 'Mismatch'}, Images count: ${data.data && data.data.images ? data.data.images.length : 0}`);
  } catch (e) {
    report('Phone Image Retrieval & Array Normalization', false, e.message);
  }

  // 8. Update Phone with New Image Order / Edit
  try {
    const updateRes = await fetch(`${base}/api/phones/${testPhoneId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        image: base64Url,
        images: [base64Url, uploadedUrl]
      })
    });
    const updateData = await updateRes.json();
    const ok = updateRes.ok && updateData.success && updateData.data && updateData.data.image === base64Url;
    report('Update Phone Image & Reorder Persistence', ok,
      `Updated image: ${updateData.data && updateData.data.image ? updateData.data.image.slice(0, 50) + '...' : 'none'}`);
  } catch (e) {
    report('Update Phone Image & Reorder Persistence', false, e.message);
  }

  // 9. Clean up test phone
  try {
    await fetch(`${base}/api/phones/${testPhoneId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log(`[INFO] Cleaned up test device ${testPhoneId}`);
  } catch (e) {}

  console.log('\n======================================================');
  console.log(`📊 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('======================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTest().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

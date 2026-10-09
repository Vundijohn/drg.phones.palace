const fs = require('fs');

async function testOfferFeature() {
  const base = 'http://localhost:3000';
  console.log('--- TESTING SPECIAL OFFER ON FINANCIAL STRUCTURE ONLY ---');

  // 1. Check API returned devices
  const phonesRes = await fetch(base + '/api/phones');
  const phonesData = await phonesRes.json();
  const motoG17 = phonesData.data.find(p => p.id === 'moto-g17');
  console.log('1. moto-g17 in API:', Boolean(motoG17));
  if (motoG17) {
    console.log('   onOffer:', motoG17.onOffer);
    console.log('   cashPrice:', motoG17.cashPrice);
    console.log('   originalPrice:', motoG17.originalPrice);
    console.log('   offerTag:', motoG17.offerTag);
    console.log('   cash hint (should not have offer):', motoG17.plans?.cash?.hint);
    console.log('   standard financing hint (should have offer):', motoG17.plans?.standard?.hint);
  }

  // 2. Test Admin PUT edit with offer fields
  const loginRes = await fetch(base + '/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pin: '2540' })
  });
  const { token } = await loginRes.json();
  console.log('2. Admin authenticated:', Boolean(token));

  // Edit moto-edge-40 to be on offer
  const motoEdge = phonesData.data.find(p => p.id === 'moto-edge-40');
  if (motoEdge) {
    const updated = {
      ...motoEdge,
      onOffer: true,
      originalPrice: 18500,
      offerTag: 'FINANCING DEAL'
    };
    const putRes = await fetch(base + '/api/phones/moto-edge-40', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify(updated)
    });
    const putData = await putRes.json();
    console.log('3. Admin PUT edit success:', putData.success, '| onOffer:', putData.data?.onOffer, '| origPrice:', putData.data?.originalPrice);

    // Revert back so moto-edge-40 stays clean
    await fetch(base + '/api/phones/moto-edge-40', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify({ ...motoEdge, onOffer: false, originalPrice: null })
    });
  }

  // 3. Verify CSS rules
  const css = fs.readFileSync('assets/site.css', 'utf8');
  console.log('4. CSS rules verified:');
  console.log('   .offer-card-badge:', css.includes('.offer-card-badge'));
  console.log('   .financial-structure-offer-banner:', css.includes('.financial-structure-offer-banner'));
  console.log('   .f-offer-badge:', css.includes('.f-offer-badge'));
  console.log('   .has-financing-offer:', css.includes('.has-financing-offer'));

  // 4. Verify JS rules
  const js = fs.readFileSync('assets/site.js', 'utf8');
  console.log('5. JS rules verified:');
  console.log('   phone.onOffer check:', js.includes('phone.onOffer'));
  console.log('   financial-structure-offer-banner rendered:', js.includes('financial-structure-offer-banner'));
  console.log('   phone-card-offer-row REMOVED from card body:', !js.includes('class="phone-card-offer-row"'));
  console.log('   openPhoneDetails financing offer badge:', js.includes('isFinancingOffer'));

  // 5. Verify admin.html
  const adminHtml = fs.readFileSync('admin.html', 'utf8');
  console.log('6. admin.html verified:');
  console.log('   phoneOnOffer input in financing section:', adminHtml.includes('id="phoneOnOffer"'));
  console.log('   phoneOriginalPrice input:', adminHtml.includes('id="phoneOriginalPrice"'));
  console.log('   phoneOfferTag input:', adminHtml.includes('id="phoneOfferTag"'));
  console.log('   openEditPhoneModal populates onOffer:', adminHtml.includes('onOfferCheckbox.checked = Boolean(phone.onOffer)'));
  console.log('   renderInventory displays finOfferBadge:', adminHtml.includes('finOfferBadge'));

  console.log('\n--- ALL VERIFICATIONS COMPLETE ---');
}

testOfferFeature();

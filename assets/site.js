
// ── THEME TOGGLE ──────────────────────────────────────────
const themeBtn = document.getElementById('theme-toggle');
const htmlEl = document.documentElement;

function setTheme(light) {
  if (light) {
    htmlEl.classList.add('light');
    themeBtn.textContent = 'Dark';
    localStorage.setItem('theme', 'light');
  } else {
    htmlEl.classList.remove('light');
    themeBtn.textContent = 'Light';
    localStorage.setItem('theme', 'dark');
  }
}
const savedTheme = localStorage.getItem('theme');
const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
setTheme(savedTheme === 'light' || (!savedTheme && prefersLight));
themeBtn.addEventListener('click', () => setTheme(!htmlEl.classList.contains('light')));

// English / Kiswahili language toggle
const languageButton = document.getElementById('language-toggle');
const footerLanguageButton = document.getElementById('footer-language-toggle');
const languageCopy = {
  en: {
    heroEyebrow:'DRG PHONES PALACE - NAIROBI, KENYA', heroTitle:'Phones. <em>Zero compromise.</em>', heroDesc:'Certified renewed smartphones, carefully tested and ready for your next move.', requestPhone:'Request a Phone', viewInventory:'View Inventory',
    navPhones:'Phones', navInventory:'Inventory', navHow:'How It Works', navRequest:'Request', inventoryLabel:'RENEWED INVENTORY', inventoryTitle:'Curated Flagships,<br><em>accessible to everyone.</em>', inventoryDesc:'We deal exclusively in renewed iPhones, Samsung Galaxy devices, and Motorola smartphones. Every device is backed by our multi-point hardware verification, tested battery health, and flexible financing with low upfront deposits.',
    howLabel:'HOW IT WORKS', howTitle:'From shortlist<br><em>to your hand.</em>', howDesc:'A clear, private process for finding a genuine renewed phone without the guesswork.', process1Title:'Tell us what you need', process1Desc:'Choose from live inventory or send us your preferred brand, model, storage, and budget.', process2Title:'We confirm the device', process2Desc:'We verify availability, condition, financing options, and delivery details with you.', process3Title:'Receive with confidence', process3Desc:'Pay through your chosen plan, then get your tested phone delivered across Nairobi.',
    faqLabel:'QUICK ANSWERS', faqTitle:'Your questions,<br><em>answered clearly.</em>', faqDesc:'Everything you need to know before choosing your next renewed phone.', faq1Q:'Are the phones genuine and tested?', faq1A:'Yes. Every listed device is checked for core functions, screen condition, battery performance, cameras, network readiness, and cosmetic grade.', faq2Q:'Can I pay in weekly instalments?', faq2A:'Yes. Available plans vary by device and may include cash, standard weekly payments, MoSaver, and MoStandard options.', faq3Q:'Do you deliver outside Nairobi?', faq3A:'We offer same-day delivery across Nairobi and can help arrange delivery to other locations. Confirm your area with our team.', faq4Q:'Can you find a phone not in the catalogue?', faq4A:'Yes. Send us the model, storage, preferred condition, and budget through the request form and we will check availability.',
    requestLabel:'SUBMIT A REQUEST', requestTitle:'Start your phone<br><em>search.</em>', requestDesc:'Tell us what you are looking for. We will reply on WhatsApp with available options, pricing, and payment plans.', sendRequest:'Send Phone Request'
  },
  sw: {
    heroEyebrow:'DRG PHONES PALACE - NAIROBI, KENYA', heroTitle:'Simu bora. <em>Bila kuathiri ubora.</em>', heroDesc:'Simu zilizotengenezwa upya, zilizokaguliwa kwa umakini na tayari kwa hatua yako inayofuata.', requestPhone:'Omba Simu', viewInventory:'Tazama Simu',
    navPhones:'Simu', navInventory:'Simu Zilizopo', navHow:'Jinsi Inavyofanya Kazi', navRequest:'Omba Simu', inventoryLabel:'SIMU ZILIZOTENGENEZWA UPYA', inventoryTitle:'Simu bora,<br><em>zinazopatikana kwa wote.</em>', inventoryDesc:'Tunauza iPhone, Samsung Galaxy na Motorola zilizotengenezwa upya pekee. Kila simu hukaguliwa, betri hujaribiwa na mipango rahisi ya malipo hutolewa.',
    howLabel:'JINSI INAVYOFANYA KAZI', howTitle:'Kutoka chaguo lako<br><em>hadi mkononi.</em>', howDesc:'Njia wazi na rahisi ya kupata simu halisi iliyotengenezwa upya bila usumbufu.', process1Title:'Tuambie unachohitaji', process1Desc:'Chagua simu kwenye orodha au tuma chapa, modeli, hifadhi na bajeti yako.', process2Title:'Tunathibitisha simu', process2Desc:'Tunathibitisha upatikanaji, hali, mpango wa malipo na maelezo ya usafirishaji.', process3Title:'Pokea kwa ujasiri', process3Desc:'Lipa kwa mpango uliochagua na upokee simu yako iliyokaguliwa Nairobi.',
    faqLabel:'MAJIBU YA HARAKA', faqTitle:'Maswali yako,<br><em>yamejibiwa wazi.</em>', faqDesc:'Kila unachohitaji kujua kabla ya kuchagua simu yako iliyotengenezwa upya.', faq1Q:'Je, simu ni halisi na zimekaguliwa?', faq1A:'Ndiyo. Kila simu hukaguliwa utendaji, skrini, betri, kamera, mtandao na hali ya nje.', faq2Q:'Je, naweza kulipa kwa awamu za kila wiki?', faq2A:'Ndiyo. Mipango hutegemea simu na inaweza kuwa pesa taslimu, malipo ya kila wiki, MoSaver au MoStandard.', faq3Q:'Je, mnasafirisha nje ya Nairobi?', faq3A:'Tunatoa usafirishaji wa siku hiyo Nairobi na tunaweza kupanga usafirishaji maeneo mengine. Thibitisha eneo lako nasi.', faq4Q:'Mnaweza kupata simu ambayo haipo kwenye orodha?', faq4A:'Ndiyo. Tuma modeli, hifadhi, hali unayotaka na bajeti kupitia fomu ya ombi.',
    requestLabel:'TUMA OMBI', requestTitle:'Anza kutafuta<br><em>simu yako.</em>', requestDesc:'Tuambie unachotafuta. Tutakujibu WhatsApp na chaguo, bei na mipango ya malipo.', sendRequest:'Tuma Ombi la Simu'
  }
};
function setLanguage(language){
  const copy = languageCopy[language] || languageCopy.en;
  document.documentElement.lang = language === 'sw' ? 'sw' : 'en';
  document.querySelectorAll('[data-lang-key]').forEach(element => {
    const value = copy[element.dataset.langKey];
    if(value) element.innerHTML = value;
  });
  const nextLanguage = language === 'en' ? 'Kiswahili' : 'English';
  languageButton.textContent = nextLanguage;
  languageButton.setAttribute('aria-label', `Switch to ${nextLanguage}`);
  footerLanguageButton.textContent = language === 'en' ? 'English / Kiswahili' : 'Kiswahili / English';
  localStorage.setItem('drg_language', language);
  if(window.processReady) renderProcessStep();
}
const savedLanguage = localStorage.getItem('drg_language') || 'en';
setLanguage(savedLanguage);
languageButton.addEventListener('click', () => setLanguage((localStorage.getItem('drg_language') || 'en') === 'en' ? 'sw' : 'en'));
footerLanguageButton.addEventListener('click', () => languageButton.click());

// ── THREE.JS 3D SCENE (PHONE-THEMED WIREFRAME GEOMETRY) ───
const canvas = document.getElementById('three-canvas');
if (typeof THREE !== 'undefined' && canvas) {
  try {
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
    camera.position.set(0, 0, 50);

    // Particle field (Starfield)
    const PARTICLES = 1800;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(PARTICLES * 3);
    const pSizes = new Float32Array(PARTICLES);
    for (let i = 0; i < PARTICLES; i++) {
      pPos[i*3]   = (Math.random() - 0.5) * 160;
      pPos[i*3+1] = (Math.random() - 0.5) * 100;
      pPos[i*3+2] = (Math.random() - 0.5) * 80;
      pSizes[i]   = Math.random() * 1.5 + 0.3;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute('size', new THREE.BufferAttribute(pSizes, 1));
    const pMat = new THREE.PointsMaterial({
      color: 0xc8a96e, size: 0.35, transparent: true, opacity: 0.55,
      sizeAttenuation: true, depthWrite: false
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // 3D Wireframe Smartphone Frame Silhouette
    const phoneGroup = new THREE.Group();

    // Phone outer body
    const phoneBodyGeo = new THREE.BoxGeometry(9, 18, 0.8, 2, 4, 1);
    const phoneBodyMat = new THREE.MeshBasicMaterial({ color: 0xc8a96e, wireframe: true, transparent: true, opacity: 0.15 });
    const phoneBody = new THREE.Mesh(phoneBodyGeo, phoneBodyMat);
    phoneGroup.add(phoneBody);

    // Phone screen outline
    const screenGeo = new THREE.PlaneGeometry(8, 16.5);
    const screenMat = new THREE.MeshBasicMaterial({ color: 0x6e9ec8, wireframe: true, transparent: true, opacity: 0.08 });
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.z = 0.41;
    phoneGroup.add(screenMesh);

    // Camera Island
    const camBumpGeo = new THREE.BoxGeometry(3.6, 4.8, 0.35);
    const camBumpMat = new THREE.MeshBasicMaterial({ color: 0xc8a96e, wireframe: true, transparent: true, opacity: 0.2 });
    const camBump = new THREE.Mesh(camBumpGeo, camBumpMat);
    camBump.position.set(-2, 5.8, -0.5);
    phoneGroup.add(camBump);

    // Camera Rings
    for(let c = 0; c < 3; c++){
      const ringGeo = new THREE.TorusGeometry(0.55, 0.1, 8, 20);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x6e9ec8, wireframe: true, transparent: true, opacity: 0.25 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(-2, 7 - c * 1.2, -0.7);
      phoneGroup.add(ring);
    }

    phoneGroup.position.set(24, -4, -18);
    scene.add(phoneGroup);

    // Floating wireframe torus ring
    const torusGeo = new THREE.TorusGeometry(12, 3.5, 18, 55);
    const torusMat = new THREE.MeshBasicMaterial({ color: 0xc8a96e, wireframe: true, transparent: true, opacity: 0.08 });
    const torus = new THREE.Mesh(torusGeo, torusMat);
    torus.position.set(-26, 12, -22);
    scene.add(torus);

    // Floating icosahedron (Chip / Prism)
    const icoGeo = new THREE.IcosahedronGeometry(7, 1);
    const icoMat = new THREE.MeshBasicMaterial({ color: 0x6e9ec8, wireframe: true, transparent: true, opacity: 0.10 });
    const ico = new THREE.Mesh(icoGeo, icoMat);
    ico.position.set(-20, -18, -15);
    scene.add(ico);

    // Floating octahedron
    const octGeo = new THREE.OctahedronGeometry(5, 0);
    const octMat = new THREE.MeshBasicMaterial({ color: 0xc8a96e, wireframe: true, transparent: true, opacity: 0.12 });
    const oct = new THREE.Mesh(octGeo, octMat);
    oct.position.set(8, -22, -12);
    scene.add(oct);

    // Mouse parallax
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', e => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    const clock = new THREE.Clock();
    function animateScene() {
      requestAnimationFrame(animateScene);
      if (document.hidden) return;
      const t = clock.getElapsedTime();

      particles.rotation.y = t * 0.015;
      particles.rotation.x = t * 0.007;

      // Phone silhouette motion
      phoneGroup.rotation.y = t * 0.22;
      phoneGroup.rotation.x = Math.sin(t * 0.3) * 0.15;
      phoneGroup.position.y = -4 + Math.sin(t * 0.4) * 2;

      torus.rotation.x = t * 0.2;
      torus.rotation.y = t * 0.15;
      torus.position.y = 12 + Math.cos(t * 0.5) * 2.5;

      ico.rotation.y = t * 0.25;
      ico.rotation.x = t * 0.18;

      oct.rotation.x = t * 0.35;
      oct.rotation.z = t * 0.25;

      // Parallax camera
      camera.position.x += (mouseX * 4.5 - camera.position.x) * 0.04;
      camera.position.y += (-mouseY * 3.5 - camera.position.y) * 0.04;
      camera.lookAt(scene.position);

      // Dynamic light/dark material colors
      const isLight = htmlEl.classList.contains('light');
      pMat.color.setHex(isLight ? 0x7a4f0a : 0xc8a96e);
      pMat.opacity = isLight ? 0.65 : 0.55;
      phoneBodyMat.color.setHex(isLight ? 0x7a4f0a : 0xc8a96e);
      torusMat.color.setHex(isLight ? 0x7a4f0a : 0xc8a96e);
      icoMat.color.setHex(isLight ? 0x1a4a80 : 0x6e9ec8);
      octMat.color.setHex(isLight ? 0x7a4f0a : 0xc8a96e);

      renderer.render(scene, camera);
    }
    animateScene();
  } catch (err) {
    console.warn('Three.js canvas setup skipped:', err);
  }
}

// ── 3D TILT PHONE CARD INTERACTION ────────────────────────
const tiltCard = document.getElementById('tilt-card');
if(tiltCard){
  const heroRightContainer = tiltCard.parentElement;
  heroRightContainer.addEventListener('mousemove', e => {
    const rect = heroRightContainer.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    tiltCard.style.transform = `rotateY(${x * 20}deg) rotateX(${-y * 16}deg) scale(1.02)`;
  });
  heroRightContainer.addEventListener('mouseleave', () => {
    tiltCard.style.transform = 'rotateY(0deg) rotateX(0deg) scale(1)';
    tiltCard.style.transition = 'transform 0.6s ease';
  });
  heroRightContainer.addEventListener('mouseenter', () => {
    tiltCard.style.transition = 'transform 0.1s ease';
  });
}

// ── SCROLL REVEAL ─────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revealObserver.unobserve(e.target); }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = (i % 4) * 0.08 + 's';
  revealObserver.observe(el);
});

// ── MOBILE MENU ───────────────────────────────────────────
const burgerBtn = document.getElementById('burgerBtn');
const mobileMenu = document.getElementById('mobileMenu');
burgerBtn.addEventListener('click', () => mobileMenu.classList.toggle('open'));
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

document.getElementById('year').textContent = new Date().getFullYear();

// ── CINEMATIC HERO SLIDER ────────────────────────────────
const hero = document.querySelector('.hero');
const heroSlideButtons = document.querySelectorAll('.hero-slide-dot');
const heroPrevButton = document.querySelector('.hero-prev');
const heroNextButton = document.querySelector('.hero-next');
const heroSlideCount = document.querySelector('.hero-slide-count');
const heroPhoneSlides = document.querySelectorAll('.hero-phone-slide');
const heroSingleSlides = document.querySelectorAll('.hero-single-slide');
const heroModels = [
  {name:'iPhone', image:'images/hero-iphone.png'},
  {name:'Samsung Galaxy', image:'images/hero-samsung.png'},
  {name:'iPhone Camera', image:'images/hero-iphone-camera.png'},
  {name:'Foldable Phone', image:'images/hero-foldable.png'}
];
const heroImages = heroModels.map(model => model.image);
function setHeroSlide(index) {
  const requestedImage = heroImages[index];
  hero.style.backgroundImage = 'linear-gradient(180deg,#171717 0%,#0b0b0b 72%,#070707 100%)';
  heroSlideButtons.forEach((button, buttonIndex) => button.classList.toggle('active', buttonIndex === index));
  heroPhoneSlides.forEach((slide, slideIndex) => slide.classList.toggle('active', slideIndex === index));
  heroSingleSlides.forEach((slide, slideIndex) => slide.classList.toggle('active', slideIndex === index));
  heroSlideCount.textContent = `0${index + 1} / 04`;
}
heroSlideButtons.forEach((button, index) => button.addEventListener('click', () => {
  heroSlideIndex = index;
  setHeroSlide(heroSlideIndex);
}));
let heroSlideIndex = 0;
function moveHeroSlide(direction){
  heroSlideIndex = (heroSlideIndex + direction + heroImages.length) % heroImages.length;
  setHeroSlide(heroSlideIndex);
}
heroPrevButton.addEventListener('click', () => moveHeroSlide(-1));
heroNextButton.addEventListener('click', () => moveHeroSlide(1));
document.addEventListener('keydown', e => {
  if(e.key === 'ArrowLeft') moveHeroSlide(-1);
  if(e.key === 'ArrowRight') moveHeroSlide(1);
});
setHeroSlide(0);
setInterval(() => { heroSlideIndex = (heroSlideIndex + 1) % heroImages.length; setHeroSlide(heroSlideIndex); }, 6500);

// ── RENEWED PHONES CATALOGUE DATA & LOGIC ─────────────────
let WHATSAPP_NUMBER = "254797951374";

const DEFAULT_PHONES = [
  {
    id: "s25-ultra-256", category: "samsung", categoryLabel: "Samsung",
    model: "Galaxy S25 Ultra", storage: "256GB", condition: "Renewed · Grade A+",
    image: "images/galaxy-s25-ultra.jpg",
    specs: ["Snapdragon 8 Elite, 5G ready", "200MP Quad Camera, 100x Space Zoom", "Built-in S-Pen, Titanium Armor Frame"],
    cashPrice: 115999,
    plans: {
      cash: { label: "Cash", deposit: 0, weekly: 0, weeks: 0, total: 115999, hint: "One-time payment · 0% financing fee" },
      mosaver: { label: "MoSaver (6M)", deposit: 52199, weekly: 4410, weeks: 26, total: 166859, hint: "⚡ 6 Months · Save KES 45,340 vs 12M" },
      mostandard: { label: "MoStandard (12M)", deposit: 40599, weekly: 3300, weeks: 52, total: 212199, hint: "Low deposit (35%) · 52 easy weekly payments" }
    },
    defaultPlan: "mostandard"
  },
  {
    id: "s24-ultra-256", category: "samsung", categoryLabel: "Samsung",
    model: "Galaxy S24 Ultra", storage: "256GB", condition: "Renewed · Grade A+",
    image: "images/galaxy-s24-ultra.jpg",
    specs: ["Galaxy AI built-in, 5G flagship", "200MP Quad Pro-visual camera", "Flat 120Hz display, S-Pen included"],
    cashPrice: 94999,
    plans: {
      cash: { label: "Cash", deposit: 0, weekly: 0, weeks: 0, total: 94999, hint: "One-time payment · 0% financing fee" },
      mosaver: { label: "MoSaver (6M)", deposit: 42699, weekly: 3610, weeks: 26, total: 136559, hint: "⚡ 6 Months · Save KES 37,040 vs 12M" },
      mostandard: { label: "MoStandard (12M)", deposit: 33199, weekly: 2700, weeks: 52, total: 173599, hint: "Low deposit (35%) · 52 easy weekly payments" }
    },
    defaultPlan: "mostandard"
  },
  {
    id: "s23-ultra-256", category: "samsung", categoryLabel: "Samsung",
    model: "Galaxy S23 Ultra", storage: "256GB", condition: "Renewed · Grade A+",
    image: "images/galaxy-s23-ultra.jpg",
    specs: ["200MP camera, 100x Space Zoom", "6.8\" Dynamic AMOLED 2X 120Hz", "Built-in S-Pen, 5,000mAh battery"],
    cashPrice: 76999,
    plans: {
      cash: { label: "Cash", deposit: 0, weekly: 0, weeks: 0, total: 76999, hint: "One-time payment · 0% financing fee" },
      mosaver: { label: "MoSaver (6M)", deposit: 34599, weekly: 2930, weeks: 26, total: 110779, hint: "⚡ 6 Months · Save KES 30,000 vs 12M" },
      mostandard: { label: "MoStandard (12M)", deposit: 26899, weekly: 2190, weeks: 52, total: 140779, hint: "Low deposit (35%) · 52 easy weekly payments" }
    },
    defaultPlan: "mostandard"
  },
  {
    id: "s22-ultra-256", category: "samsung", categoryLabel: "Samsung",
    model: "Galaxy S22 Ultra", storage: "256GB", condition: "Renewed · Grade A+",
    image: "images/galaxy-s22-ultra.jpg",
    specs: ["108MP Quad camera, 100x zoom", "Dynamic AMOLED 120Hz display", "Integrated S-Pen, 45W fast charge"],
    cashPrice: 66999,
    plans: {
      cash: { label: "Cash", deposit: 0, weekly: 0, weeks: 0, total: 66999, hint: "One-time payment · 0% financing fee" },
      mosaver: { label: "MoSaver (6M)", deposit: 30099, weekly: 2550, weeks: 26, total: 96399, hint: "⚡ 6 Months · Save KES 25,800 vs 12M" },
      mostandard: { label: "MoStandard (12M)", deposit: 23399, weekly: 1900, weeks: 52, total: 122199, hint: "Low deposit (35%) · 52 easy weekly payments" }
    },
    defaultPlan: "mostandard"
  },
  {
    id: "s21-ultra-128", category: "samsung", categoryLabel: "Samsung",
    model: "Galaxy S21 Ultra 5G", storage: "128GB", condition: "Renewed · Grade A+",
    image: "images/galaxy-s21-ultra.jpg",
    specs: ["108MP Pro Grade Camera, 8K video", "6.8\" Quad HD+ 120Hz display", "S-Pen support, 5,000mAh battery"],
    cashPrice: 42999,
    plans: {
      cash: { label: "Cash", deposit: 0, weekly: 0, weeks: 0, total: 42999, hint: "One-time payment · 0% financing fee" },
      mosaver: { label: "MoSaver (6M)", deposit: 19399, weekly: 1640, weeks: 26, total: 62039, hint: "⚡ 6 Months · Save KES 16,580 vs 12M" },
      mostandard: { label: "MoStandard (12M)", deposit: 10499, weekly: 1310, weeks: 52, total: 78619, hint: "Low deposit (KES 10,499) · KES 1,310/week" }
    },
    defaultPlan: "mostandard"
  },
  {
    id: "s22-plus-128", category: "samsung", categoryLabel: "Samsung",
    model: "Galaxy S22+ 5G", storage: "128GB", condition: "Renewed · Grade A+",
    image: "images/galaxy-s22-plus.jpg",
    specs: ["6.6\" Dynamic AMOLED 2X 120Hz", "50MP Triple camera, Nightography", "Armor Aluminum Frame, 45W charge"],
    cashPrice: 44999,
    plans: {
      cash: { label: "Cash", deposit: 0, weekly: 0, weeks: 0, total: 44999, hint: "One-time payment · 0% financing fee" },
      mosaver: { label: "MoSaver (6M)", deposit: 20299, weekly: 1710, weeks: 26, total: 64759, hint: "⚡ 6 Months · Save KES 17,540 vs 12M" },
      mostandard: { label: "MoStandard (12M)", deposit: 11299, weekly: 1370, weeks: 52, total: 82539, hint: "Low deposit (KES 11,299) · KES 1,370/week" }
    },
    defaultPlan: "mostandard"
  },
  {
    id: "s21-plus-128", category: "samsung", categoryLabel: "Samsung",
    model: "Galaxy S21+ 5G", storage: "128GB", condition: "Renewed · Grade A+",
    image: "images/galaxy-s21-plus.jpg",
    specs: ["6.7\" Dynamic AMOLED 120Hz display", "64MP telephoto camera, 30x zoom", "4,800mAh battery, 5G ready"],
    cashPrice: 34199,
    plans: {
      cash: { label: "Cash", deposit: 0, weekly: 0, weeks: 0, total: 34199, hint: "One-time payment · 0% financing fee" },
      mosaver: { label: "MoSaver (6M)", deposit: 15399, weekly: 1300, weeks: 26, total: 49199, hint: "⚡ 6 Months · Save KES 17,020 vs 12M" },
      mostandard: { label: "MoStandard (12M)", deposit: 8499, weekly: 1110, weeks: 52, total: 66219, hint: "Lowest deposit (KES 8,499) · KES 1,110/week" }
    },
    defaultPlan: "mostandard"
  },
  {
    id: "iphone-12", category: "iphone", categoryLabel: "iPhone",
    model: "iPhone 12", storage: "128GB", condition: "Renewed · Grade A",
    image: "images/iphone-12.jpg",
    specs: ["5G ready flagship, Super Retina XDR", "12MP dual camera, Night mode & 4K", "Face ID, Ceramic Shield, MagSafe"],
    cashPrice: 23000,
    plans: {
      cash: { label: "Cash", deposit: 0, weekly: 0, weeks: 0, total: 23000, hint: "One-time cash payment" },
      standard: { label: "Weekly (10 Wks)", deposit: 5000, weekly: 1800, weeks: 10, total: 23000, hint: "10 Weeks Lipa Mdogo Mdogo" }
    },
    defaultPlan: "standard"
  },
  {
    id: "iphone-11", category: "iphone", categoryLabel: "iPhone",
    model: "iPhone 11", storage: "64GB", condition: "Renewed · Grade A",
    image: "images/iphone-11.jpg",
    specs: ["Liquid Retina HD 6.1\" display", "12MP Ultra-Wide dual camera", "All-day battery life, A13 Bionic"],
    cashPrice: 16500,
    plans: {
      cash: { label: "Cash", deposit: 0, weekly: 0, weeks: 0, total: 16500, hint: "One-time cash payment" },
      standard: { label: "Weekly (10 Wks)", deposit: 4000, weekly: 1250, weeks: 10, total: 16500, hint: "10 Weeks Lipa Mdogo Mdogo" }
    },
    defaultPlan: "standard"
  },
  {
    id: "moto-g54", category: "motorola", categoryLabel: "Motorola",
    model: "Moto G54 5G", storage: "256GB", condition: "Renewed · Like New",
    image: "images/moto-g54.jpg",
    specs: ["5G ready, 6.5\" 120Hz display", "50MP OIS camera, Quad Pixel", "6,000mAh massive battery"],
    cashPrice: 10400,
    plans: {
      cash: { label: "Cash", deposit: 0, weekly: 0, weeks: 0, total: 10400, hint: "One-time cash payment" },
      standard: { label: "Weekly (8 Wks)", deposit: 2800, weekly: 950, weeks: 8, total: 10400, hint: "8 Weeks Lipa Mdogo Mdogo" }
    },
    defaultPlan: "standard"
  },
  {
    id: "moto-edge-40", category: "motorola", categoryLabel: "Motorola",
    model: "Moto Edge 40", storage: "256GB", condition: "Renewed · Like New",
    image: "images/moto-edge-40.jpg",
    specs: ["Curved pOLED 144Hz display", "50MP camera, OIS & f/1.4 aperture", "68W TurboPower fast charging"],
    cashPrice: 15950,
    plans: {
      cash: { label: "Cash", deposit: 0, weekly: 0, weeks: 0, total: 15950, hint: "One-time cash payment" },
      standard: { label: "Weekly (9 Wks)", deposit: 3800, weekly: 1350, weeks: 9, total: 15950, hint: "9 Weeks Lipa Mdogo Mdogo" }
    },
    defaultPlan: "standard"
  },
  {
    id: "moto-g17", category: "motorola", categoryLabel: "Motorola",
    model: "Motorola Moto G17 4G", storage: "128GB", condition: "Renewed · Like New",
    image: "images/moto-g54.jpg",
    specs: ["Smooth 90Hz HD+ display", "50MP Quad Pixel camera system", "5,000mAh long battery life", "Dolby Atmos stereo speakers"],
    cashPrice: 27500,
    onOffer: true,
    originalPrice: 29500,
    offerTag: "OFFER",
    plans: {
      cash: { label: "Cash", deposit: 0, weekly: 0, weeks: 0, total: 27500, hint: "One-time cash payment · Special offer" },
      standard: { label: "Weekly (10 Wks)", deposit: 6500, weekly: 2100, weeks: 10, total: 27500, hint: "10 Weeks Lipa Mdogo Mdogo" }
    },
    defaultPlan: "standard"
  },
];

let phones = [];
let currentCategory = "all";
let globalPlanMode = "default";
const activePlanByPhone = {};
const SUPPORTED_PHONE_CATEGORIES = new Set(["iphone", "samsung", "motorola", "other"]);
const INVENTORY_STORAGE_KEY = 'drg_renewed_phones_data_v2';
const INVENTORY_CHANNEL_NAME = 'drg_inventory_channel';

function money(n){
  return "KES " + Number(n).toLocaleString("en-KE");
}

function displayCondition(phone){
  const raw = String(phone.condition || '').replace(/^renewed\s*(?:[-]|·)\s*/i, '').trim();
  if(/brand\s*new/i.test(raw)) return 'Renewed - Grade A';
  if(/excellent/i.test(raw)) return 'Renewed - Grade A+';
  if(!raw) return 'Renewed - Verified';
  return `Renewed - ${raw}`;
}

function loadPhones(){
  try {
    const stored = localStorage.getItem(INVENTORY_STORAGE_KEY) || localStorage.getItem('drg_vundi_phones_v3');
    if(stored){
      const parsed = JSON.parse(stored);
      if(Array.isArray(parsed) && parsed.length > 0){
        phones = parsed;
        return;
      }
    }
  } catch(err){}
  phones = JSON.parse(JSON.stringify(DEFAULT_PHONES));
}

function savePhones(){
  try {
    localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(phones));
    localStorage.setItem('drg_vundi_phones_v3', JSON.stringify(phones));
  } catch(e){}
}

loadPhones();

// Realtime cross-tab synchronization with Admin Studio
if(typeof BroadcastChannel !== 'undefined'){
  try {
    const inventoryChannel = new BroadcastChannel(INVENTORY_CHANNEL_NAME);
    inventoryChannel.onmessage = (event) => {
      if(event.data && event.data.type === 'INVENTORY_UPDATED' && Array.isArray(event.data.phones)){
        phones = event.data.phones;
        savePhones();
        renderPhones();
        renderFeaturedPhones();
      }
    };
  } catch(e){}
}

window.addEventListener('storage', (e) => {
  if(e.key === INVENTORY_STORAGE_KEY || e.key === 'drg_vundi_phones_v3'){
    loadPhones();
    renderPhones();
    renderFeaturedPhones();
  }
});

// Auto-sync when customer returns to tab
document.addEventListener('visibilitychange', () => {
  if(!document.hidden){
    syncBackendData();
  }
});

// Sync from live server API if available
async function syncBackendData(){
  try {
    const sRes = await fetch('/api/settings');
    if(sRes.ok){
      const sData = await sRes.json();
      if(sData.success && sData.data && sData.data.whatsappNumber){
        WHATSAPP_NUMBER = sData.data.whatsappNumber;
      }
    }
  } catch(e){}

  try {
    const pRes = await fetch('/api/phones');
    if(pRes.ok){
      const pData = await pRes.json();
      if(pData.success && Array.isArray(pData.data) && pData.data.length > 0){
        phones = pData.data;
        savePhones();
        renderPhones();
        renderFeaturedPhones();
      }
    }
  } catch(e){}
}

function getEffectivePlan(phone){
  if(globalPlanMode === "cash") return "cash";
  if(globalPlanMode === "mosaver"){
    return phone.plans.mosaver ? "mosaver" : (phone.plans.standard ? "standard" : "cash");
  }
  if(globalPlanMode === "mostandard"){
    return phone.plans.mostandard ? "mostandard" : (phone.plans.standard ? "standard" : "cash");
  }
  return activePlanByPhone[phone.id] || phone.defaultPlan || Object.keys(phone.plans)[0];
}

function getWaLink(phone, planKey){
  const plan = phone.plans[planKey] || Object.values(phone.plans)[0];
  const condition = displayCondition(phone);
  let msg = "";
  if(phone.onOffer && planKey === "cash"){
    msg = `Hi DRG Phones Palace, I saw the special OFFER on the renewed ${phone.model} ${phone.storage} (${condition}) for ${money(plan.total)}${phone.originalPrice ? ` (was ${money(phone.originalPrice)})` : ''}. Is it available?`;
  } else if(planKey === "cash"){
    msg = `Hi DRG Phones Palace, I'd like to buy the renewed ${phone.model} ${phone.storage} (${condition}) in Cash for ${money(plan.total)}. Is it available?`;
  } else if(planKey === "mosaver"){
    msg = `Hi DRG Phones Palace, I'm interested in the renewed ${phone.model} ${phone.storage} on MoSaver (6 Months). Deposit: ${money(plan.deposit)}, Weekly: ${money(plan.weekly)}, Total: ${money(plan.total)}. Is it in stock?`;
  } else if(planKey === "mostandard"){
    msg = `Hi DRG Phones Palace, I'm interested in the renewed ${phone.model} ${phone.storage} on MoStandard (12 Months). Deposit: ${money(plan.deposit)}, Weekly: ${money(plan.weekly)}, Total: ${money(plan.total)}. Is it in stock?`;
  } else {
    msg = `Hi DRG Phones Palace, I'm interested in the renewed ${phone.model} ${phone.storage} (${condition}) on the ${plan.label} plan. Deposit: ${money(plan.deposit)}, Weekly: ${money(plan.weekly)} x ${plan.weeks} wks (Total: ${money(plan.total)}). Is it available?`;
  }
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

function renderPlanBox(phone, activeKey){
  const plan = phone.plans[activeKey] || Object.values(phone.plans)[0];
  const isCash = activeKey === "cash";

  let detailsHtml = "";
  if(isCash){
    const priceText = (phone.onOffer && phone.originalPrice)
      ? `<span style="color:#e63946;">${money(plan.total)}</span> <del style="font-size:11px;color:var(--ink-faint);font-weight:400;margin-left:4px;">${money(phone.originalPrice)}</del>`
      : money(plan.total);
    const feeText = (phone.onOffer && phone.originalPrice && phone.originalPrice > phone.cashPrice)
      ? `<span style="color:var(--accent2);font-weight:700;">Save ${money(phone.originalPrice - phone.cashPrice)}</span>`
      : `0% (KES 0)`;
    detailsHtml = `
      <div class="phone-plan-breakdown cash-layout" id="plan-details-${phone.id}">
        <div class="plan-col"><span>Cash Price</span><strong>${priceText}</strong></div>
        <div class="plan-col"><span>${phone.onOffer ? 'Special Offer' : 'Financing Fee'}</span><strong>${feeText}</strong></div>
      </div>
    `;
  } else {
    detailsHtml = `
      <div class="phone-plan-breakdown" id="plan-details-${phone.id}">
        <div class="plan-col"><span>Deposit</span><strong>${money(plan.deposit)}</strong></div>
        <div class="plan-col"><span>Weekly ×${plan.weeks}</span><strong>${money(plan.weekly)}</strong></div>
        <div class="plan-col"><span>Total Cost</span><strong>${money(plan.total)}</strong></div>
      </div>
    `;
  }

  const planKeys = Object.keys(phone.plans);
  const tabsHtml = `
    <div class="card-plan-tabs" role="tablist">
      ${planKeys.map(k => `
        <button class="card-plan-tab ${k === activeKey ? 'active' : ''}"
                data-phone="${phone.id}"
                data-plan="${k}">
          ${phone.plans[k].label}
        </button>
      `).join("")}
    </div>
  `;

  return `
    <div class="card-plan-box" id="plan-box-${phone.id}">
      ${tabsHtml}
      ${detailsHtml}
      <div class="plan-hint-text" id="plan-hint-${phone.id}">${plan.hint || ""}</div>
    </div>
  `;
}

function updateCardPlanView(phoneId, newPlanKey){
  const phone = phones.find(p => p.id === phoneId);
  if(!phone || !phone.plans[newPlanKey]) return;

  activePlanByPhone[phoneId] = newPlanKey;
  const card = document.getElementById(`phone-card-${phoneId}`);
  if(!card) return;

  card.querySelectorAll('.card-plan-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.plan === newPlanKey);
  });

  const plan = phone.plans[newPlanKey];
  const detailsContainer = card.querySelector(`#plan-details-${phoneId}`);
  if(detailsContainer){
    if(newPlanKey === "cash"){
      const priceText = (phone.onOffer && phone.originalPrice)
        ? `<span style="color:#e63946;">${money(plan.total)}</span> <del style="font-size:11px;color:var(--ink-faint);font-weight:400;margin-left:4px;">${money(phone.originalPrice)}</del>`
        : money(plan.total);
      const feeText = (phone.onOffer && phone.originalPrice && phone.originalPrice > phone.cashPrice)
        ? `<span style="color:var(--accent2);font-weight:700;">Save ${money(phone.originalPrice - phone.cashPrice)}</span>`
        : `0% (KES 0)`;
      detailsContainer.className = "phone-plan-breakdown cash-layout";
      detailsContainer.innerHTML = `
        <div class="plan-col"><span>Cash Price</span><strong>${priceText}</strong></div>
        <div class="plan-col"><span>${phone.onOffer ? 'Special Offer' : 'Financing Fee'}</span><strong>${feeText}</strong></div>
      `;
    } else {
      detailsContainer.className = "phone-plan-breakdown";
      detailsContainer.innerHTML = `
        <div class="plan-col"><span>Deposit</span><strong>${money(plan.deposit)}</strong></div>
        <div class="plan-col"><span>Weekly ×${plan.weeks}</span><strong>${money(plan.weekly)}</strong></div>
        <div class="plan-col"><span>Total Cost</span><strong>${money(plan.total)}</strong></div>
      `;
    }
  }

  const hintEl = card.querySelector(`#plan-hint-${phoneId}`);
  if(hintEl) hintEl.textContent = plan.hint || "";

  const ctaBtn = card.querySelector('.card-action-btn');
  if(ctaBtn){
    ctaBtn.href = getWaLink(phone, newPlanKey);
  }
}

let customerSearchQuery = "";
let customerBudget = null;

function renderFeaturedPhones(){
  const rail = document.getElementById('featuredPhoneRail');
  if(!rail) return;
  rail.innerHTML = phones.slice(0, 3).map((phone, index) => {
    const image = (phone.image && String(phone.image).trim()) || (Array.isArray(phone.images) && phone.images.length ? String(phone.images[0]).trim() : '') || 'images/phones-bg.jpg';
    return `<article class="featured-phone" data-featured-phone="${phone.id}">
      <img src="${image}" alt="${phone.model} ${phone.storage}" loading="lazy" onerror="this.onerror=null;this.src='images/phones-bg.jpg';">
      <div class="featured-phone-content"><small>0${index + 1} · ${displayCondition(phone)}</small><h3>${phone.model}</h3><a href="#phones" class="featured-phone-link" data-featured-action="${phone.id}">View Details</a></div>
    </article>`;
  }).join('');
}

document.getElementById('featuredPhoneRail').addEventListener('click', e => {
  const action = e.target.closest('[data-featured-action]');
  if(!action) return;
  e.preventDefault();
  openPhoneDetails(phones.find(phone => phone.id === action.dataset.featuredAction));
});

const processSteps = [
  {image:'images/phones-bg.jpg', label:'01 / 03 · PHONE MATCHING', titleKey:'process1Title', descKey:'process1Desc'},
  {image:'images/phones-ambient-lively.jpg', label:'02 / 03 · DEVICE CHECK', titleKey:'process2Title', descKey:'process2Desc'},
  {image:'images/phones-waves-lively.jpg', label:'03 / 03 · DELIVERY', titleKey:'process3Title', descKey:'process3Desc'}
];
let processStepIndex = 0;
function renderProcessStep(){
  const step = processSteps[processStepIndex];
  const copy = languageCopy[localStorage.getItem('drg_language') || 'en'];
  document.getElementById('processVisualImage').src = step.image;
  document.getElementById('processVisualLabel').textContent = step.label;
  document.getElementById('processStepIndex').textContent = `0${processStepIndex + 1}`;
  document.getElementById('processStepTitle').textContent = copy[step.titleKey];
  document.getElementById('processStepDescription').textContent = copy[step.descKey];
  document.getElementById('processStepCount').textContent = `0${processStepIndex + 1} / 03`;
}
function moveProcessStep(direction){
  processStepIndex = (processStepIndex + direction + processSteps.length) % processSteps.length;
  renderProcessStep();
}
document.getElementById('processPrevious').addEventListener('click', () => moveProcessStep(-1));
document.getElementById('processNext').addEventListener('click', () => moveProcessStep(1));
window.processReady = true;
renderProcessStep();

function getBudgetCandidates(){
  let candidates = phones;
  if(currentCategory !== "all") candidates = candidates.filter(phone => phone.category === currentCategory);
  if(customerSearchQuery){
    const query = customerSearchQuery.toLowerCase();
    candidates = candidates.filter(phone => {
      const text = `${phone.model} ${phone.storage} ${phone.category} ${phone.categoryLabel || ''} ${phone.condition || ''} ${(phone.specs || []).join(' ')} ${phone.cashPrice}`.toLowerCase();
      return text.includes(query);
    });
  }
  return candidates;
}

function renderBudgetRecommendation(){
  const recommendation = document.getElementById('budgetRecommendation');
  const copy = document.getElementById('budgetRecommendationCopy');
  if(!recommendation || !copy) return;
  if(!customerBudget){
    recommendation.classList.remove('visible');
    return;
  }
  const candidates = getBudgetCandidates();
  const affordable = candidates.filter(phone => Number(phone.cashPrice) <= customerBudget).sort((a,b) => Number(b.cashPrice) - Number(a.cashPrice));
  const bestMatch = affordable[0] || candidates.slice().sort((a,b) => Number(a.cashPrice) - Number(b.cashPrice))[0];
  if(!bestMatch){
    recommendation.classList.remove('visible');
    return;
  }
  const isWithinBudget = Number(bestMatch.cashPrice) <= customerBudget;
  budgetViewDetails.dataset.phoneId = bestMatch.id;
  copy.innerHTML = isWithinBudget
    ? `Best match for ${money(customerBudget)} budget:<strong>${bestMatch.model} · ${money(bestMatch.cashPrice)}</strong><span>${displayCondition(bestMatch)} · ${bestMatch.storage}</span>`
    : `Closest match to ${money(customerBudget)} budget:<strong>${bestMatch.model} · ${money(bestMatch.cashPrice)}</strong><span>Consider increasing your budget or ask us about weekly plans.</span>`;
  recommendation.classList.add('visible');
}

function renderPhones(){
  const grid = document.getElementById('phoneGrid');
  grid.innerHTML = "";

  let list = phones;
  if(currentCategory !== "all"){
    list = list.filter(p => p.category === currentCategory);
  }

  if(customerSearchQuery){
    const q = customerSearchQuery.toLowerCase();
    list = list.filter(p => {
      const text = `${p.model} ${p.storage} ${p.category} ${p.categoryLabel || ''} ${p.condition || ''} ${(p.specs || []).join(' ')} ${p.cashPrice}`.toLowerCase();
      return text.includes(q);
    });

    const sBar = document.getElementById('searchStatusBar');
    const sText = document.getElementById('searchStatusText');
    if(sBar && sText){
      sBar.style.display = 'flex';
      sText.textContent = `Found ${list.length} renewed phone${list.length === 1 ? '' : 's'} matching "${customerSearchQuery}"`;
    }
  } else {
    const sBar = document.getElementById('searchStatusBar');
    if(sBar) sBar.style.display = 'none';
  }

  if(customerBudget){
    list = list.filter(phone => Number(phone.cashPrice) <= customerBudget);
  }
  renderBudgetRecommendation();

  if(list.length === 0){
    if(customerSearchQuery){
      grid.innerHTML = `
        <div class="catalogue-empty">
          <div style="font-size:32px;margin-bottom:12px;">🔍</div>
          <h3>No renewed phones found matching "${customerSearchQuery}"</h3>
          <p>Try searching for a different brand, model, or specification, or clear the search to see all devices.</p>
          <button type="button" class="btn btn-gold" onclick="clearSearch()">Clear Search</button>
        </div>
      `;
    } else {
      grid.innerHTML = `
        <div class="catalogue-empty">
          <div style="font-size:32px;margin-bottom:12px;">📱</div>
          <h3>No renewed phones found in this category</h3>
          <p>Check back soon for newly verified devices or chat with our team directly.</p>
          <a class="btn btn-gold" href="https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20DRG%20Phones%20Palace%2C%20do%20you%20have%20any%20renewed%20phones%20in%20stock%3F" target="_blank" rel="noopener">Inquire on WhatsApp</a>
        </div>
      `;
    }
    return;
  }

  list.forEach(phone => {
    const activeKey = getEffectivePlan(phone);
    const condition = displayCondition(phone);
    const isOffer = Boolean(phone.onOffer);
    const offerBadgeHtml = isOffer
      ? `<span class="offer-card-badge">${phone.offerTag || 'OFFER'}</span>`
      : '';
    const card = document.createElement('article');
    card.className = 'phone-card';
    card.id = `phone-card-${phone.id}`;
    card.tabIndex = 0;
    card.setAttribute('aria-label', `View details for ${phone.model}`);

    const primaryImg = (phone.image && String(phone.image).trim()) || (Array.isArray(phone.images) && phone.images.length ? String(phone.images[0]).trim() : '');
    const hasValidImage = Boolean(primaryImg);
    const mediaHtml = hasValidImage ? `
      <div class="phone-media ${isOffer ? 'has-offer' : ''}">
        ${offerBadgeHtml}
        <img src="${primaryImg}" alt="${phone.model} ${phone.storage}" loading="lazy" onerror="this.onerror=null;this.parentElement.classList.add('phone-media-placeholder');this.parentElement.innerHTML='<div class=\\'placeholder-content\\'><span class=\\'placeholder-icon\\'>📱</span><span class=\\'placeholder-title\\'>${phone.model}</span><span class=\\'placeholder-subtitle\\'>Verified Renewed Device</span></div><span class=\\'phone-condition-badge\\'>${condition}</span>';">
        <span class="phone-condition-badge">${condition}</span>
      </div>
    ` : `
      <div class="phone-media phone-media-placeholder ${isOffer ? 'has-offer' : ''}">
        ${offerBadgeHtml}
        <div class="placeholder-content">
          <span class="placeholder-icon">📱</span>
          <span class="placeholder-title">${phone.model}</span>
          <span class="placeholder-subtitle">Verified Renewed Device</span>
        </div>
        <span class="phone-condition-badge">${condition}</span>
      </div>
    `;

    card.innerHTML = `
      ${mediaHtml}
      <div class="phone-card-body">
        <div class="phone-card-header">
          <div>
            <h3 class="phone-card-title">${phone.model}</h3>
            <span class="phone-card-brand">${phone.categoryLabel || phone.category}</span>
          </div>
          <span class="phone-card-storage">${phone.storage}</span>
        </div>
        ${isOffer ? `
          <div class="phone-card-offer-row">
            <div class="offer-price-stack">
              <span class="offer-current-price">KSh ${Number(phone.cashPrice).toLocaleString('en-KE')}</span>
              ${phone.originalPrice ? `<del class="offer-original-price">KSh ${Number(phone.originalPrice).toLocaleString('en-KE')}</del>` : ''}
            </div>
            ${(phone.originalPrice && phone.originalPrice > phone.cashPrice) ? `
              <span class="offer-discount-badge">-${Math.round(((phone.originalPrice - phone.cashPrice) / phone.originalPrice) * 100)}%</span>
            ` : ''}
          </div>
        ` : ''}
        <div class="phone-specs-list">
          ${phone.specs.map(s => `<span class="phone-spec-item">${s}</span>`).join("")}
        </div>
        ${renderPlanBox(phone, activeKey)}
        <a class="btn btn-gold card-action-btn" href="${getWaLink(phone, activeKey)}" onclick="recordInquiry('${phone.id}', '${activeKey}')" target="_blank" rel="noopener">
          Get This Renewed Phone
        </a>
      </div>
    `;
    grid.appendChild(card);
  });
}

function recordInquiry(phoneId, planKey){
  const phone = phones.find(p => p.id === phoneId);
  if(!phone) return;
  const plan = phone.plans[planKey] || Object.values(phone.plans)[0];
  try {
    fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phoneId: phone.id, model: phone.model, storage: phone.storage,
        planKey: planKey, planLabel: plan ? plan.label : planKey, cashPrice: phone.cashPrice
      })
    }).catch(()=>{});
  } catch(e){}
}

// Category filter buttons
document.getElementById('filterRow').addEventListener('click', (e) => {
  const btn = e.target.closest('.filter-pill');
  if(!btn) return;
  document.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentCategory = btn.dataset.cat;
  renderPhones();
});

// Global plan switcher
document.querySelectorAll('.plan-pill').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.plan-pill').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    globalPlanMode = btn.dataset.plan;
    renderPhones();
  });
});

// Card plan tabs click delegation
document.getElementById('phoneGrid').addEventListener('click', (e) => {
  const tab = e.target.closest('.card-plan-tab');
  if(!tab) return;
  updateCardPlanView(tab.dataset.phone, tab.dataset.plan);
});

// Phone details view
const phoneDetailsModal = document.getElementById('phoneDetailsModal');
const phoneDetailsVisual = document.getElementById('phoneDetailsVisual');
const phoneDetailsContent = document.getElementById('phoneDetailsContent');
const closePhoneDetailsButton = document.getElementById('closePhoneDetails');

function closePhoneDetails(){
  phoneDetailsModal.classList.remove('open');
  document.body.style.overflow = '';
}

function openPhoneDetails(phone){
  if(!phone) return;
  const activeKey = getEffectivePlan(phone);
  const activePlan = phone.plans[activeKey] || Object.values(phone.plans)[0];
  const condition = displayCondition(phone);
  const isOffer = Boolean(phone.onOffer);
  const images = Array.isArray(phone.images) && phone.images.length
    ? phone.images.filter(Boolean)
    : (phone.image && String(phone.image).trim() ? [phone.image] : []);
  const image = images[0];
  phoneDetailsVisual.innerHTML = image
    ? `${isOffer ? `<span class="offer-card-badge" style="top:1.2rem;left:1.2rem;">${phone.offerTag || 'OFFER'}</span>` : ''}<img id="phoneDetailsMainImage" src="${image}" alt="${phone.model} ${phone.storage}"><div class="phone-details-gallery">${images.map((galleryImage, index) => `<button type="button" class="${index === 0 ? 'active' : ''}" data-gallery-image="${galleryImage}" aria-label="View image ${index + 1}"><img src="${galleryImage}" alt="${phone.model} image ${index + 1}"></button>`).join('')}</div><span class="phone-details-visual-label">${condition}</span>`
    : `${isOffer ? `<span class="offer-card-badge" style="top:1.2rem;left:1.2rem;">${phone.offerTag || 'OFFER'}</span>` : ''}<div class="placeholder-content"><span class="placeholder-icon">📱</span><span class="placeholder-title">${phone.model}</span><span class="placeholder-subtitle">Verified Renewed Device</span></div><span class="phone-details-visual-label">${condition}</span>`;
  phoneDetailsVisual.querySelectorAll('[data-gallery-image]').forEach(button => button.addEventListener('click', () => {
    phoneDetailsVisual.querySelector('#phoneDetailsMainImage').src = button.dataset.galleryImage;
    phoneDetailsVisual.querySelectorAll('[data-gallery-image]').forEach(item => item.classList.toggle('active', item === button));
  }));

  const priceDetailsHtml = (isOffer && activeKey === 'cash' && phone.originalPrice)
    ? `${activePlan.label}<strong><span style="color:#e63946;">${money(activePlan.total)}</span><del style="font-size:1.05rem;color:var(--ink-faint);margin-left:8px;font-weight:400;">${money(phone.originalPrice)}</del></strong>`
    : `${activePlan.label}<strong>${activeKey === 'cash' ? money(activePlan.total) : `${money(activePlan.weekly)} / week`}</strong>`;

  phoneDetailsContent.innerHTML = `
    <p class="phone-details-kicker">${phone.categoryLabel || phone.category} / ${phone.storage}</p>
    <h2 class="phone-details-title" id="phoneDetailsTitle">${phone.model}</h2>
    ${isOffer ? `
      <div style="display:flex;align-items:center;gap:10px;margin:2px 0 6px;">
        <span class="offer-card-badge" style="position:static;padding:3px 10px;font-size:10.5px;">${phone.offerTag || 'OFFER'}</span>
        ${phone.originalPrice && phone.originalPrice > phone.cashPrice ? `<span style="font-family:var(--mono);font-size:11.5px;font-weight:700;color:#e63946;">SAVE ${money(phone.originalPrice - phone.cashPrice)} (-${Math.round(((phone.originalPrice - phone.cashPrice) / phone.originalPrice) * 100)}%)</span>` : ''}
      </div>
    ` : ''}
    <p class="phone-details-meta">${condition} · Available for delivery in Nairobi</p>
    <div class="phone-details-specs">
      ${(phone.specs || []).map(spec => `<span class="phone-details-spec">${spec}</span>`).join('')}
    </div>
    <p class="phone-details-price">${priceDetailsHtml}</p>
    <div class="phone-details-actions">
      <a class="btn btn-gold" href="${getWaLink(phone, activeKey)}" onclick="recordInquiry('${phone.id}', '${activeKey}')" target="_blank" rel="noopener">Ask About This Phone</a>
      <button type="button" class="btn btn-outline" id="modalContinueBrowsing">Continue Browsing</button>
    </div>
  `;
  phoneDetailsModal.classList.add('open');
  document.body.style.overflow = 'hidden';
  closePhoneDetailsButton.focus();
  document.getElementById('modalContinueBrowsing').addEventListener('click', closePhoneDetails);
}

document.getElementById('phoneGrid').addEventListener('click', (e) => {
  if(e.target.closest('a,button,input,select,textarea')) return;
  const card = e.target.closest('.phone-card');
  if(!card) return;
  const phone = phones.find(item => `phone-card-${item.id}` === card.id);
  openPhoneDetails(phone);
});
document.getElementById('phoneGrid').addEventListener('keydown', (e) => {
  if(e.key !== 'Enter' && e.key !== ' ') return;
  const card = e.target.closest('.phone-card');
  if(!card) return;
  e.preventDefault();
  const phone = phones.find(item => `phone-card-${item.id}` === card.id);
  openPhoneDetails(phone);
});
closePhoneDetailsButton.addEventListener('click', closePhoneDetails);
phoneDetailsModal.addEventListener('click', e => {
  if(e.target === phoneDetailsModal) closePhoneDetails();
});
document.addEventListener('keydown', e => {
  if(e.key === 'Escape' && phoneDetailsModal.classList.contains('open')) closePhoneDetails();
});


// Customer Search Event Listeners
const searchInput = document.getElementById('customerSearchInput');
const searchBtn = document.getElementById('searchSubmitBtn');
const clearSearchBtn = document.getElementById('clearSearchBtn');
const resetSearchFilterBtn = document.getElementById('resetSearchFilterBtn');
const budgetInput = document.getElementById('budgetInput');
const budgetSubmitBtn = document.getElementById('budgetSubmitBtn');
const clearBudgetBtn = document.getElementById('clearBudgetBtn');
const budgetViewDetails = document.getElementById('budgetViewDetails');

function executeBudgetFilter(){
  if(!budgetInput) return;
  const value = Number(budgetInput.value);
  customerBudget = Number.isFinite(value) && value > 0 ? value : null;
  renderPhones();
}

function clearBudgetFilter(){
  customerBudget = null;
  if(budgetInput) budgetInput.value = '';
  renderPhones();
}

function executeSearch(){
  if(!searchInput) return;
  customerSearchQuery = searchInput.value.trim();
  if(clearSearchBtn){
    clearSearchBtn.style.display = customerSearchQuery ? 'block' : 'none';
  }
  renderPhones();
}

window.clearSearch = function(){
  if(!searchInput) return;
  searchInput.value = "";
  customerSearchQuery = "";
  if(clearSearchBtn) clearSearchBtn.style.display = 'none';
  const sBar = document.getElementById('searchStatusBar');
  if(sBar) sBar.style.display = 'none';
  renderPhones();
  searchInput.focus();
};

if(searchBtn) searchBtn.addEventListener('click', executeSearch);
if(budgetSubmitBtn) budgetSubmitBtn.addEventListener('click', executeBudgetFilter);
if(clearBudgetBtn) clearBudgetBtn.addEventListener('click', clearBudgetFilter);
if(budgetViewDetails) budgetViewDetails.addEventListener('click', () => {
  const phone = phones.find(item => item.id === budgetViewDetails.dataset.phoneId);
  openPhoneDetails(phone);
});
if(budgetInput) budgetInput.addEventListener('keydown', e => {
  if(e.key === 'Enter'){
    e.preventDefault();
    executeBudgetFilter();
  }
});
if(searchInput){
  searchInput.addEventListener('keydown', (e) => {
    if(e.key === 'Enter'){
      e.preventDefault();
      executeSearch();
    }
  });
  searchInput.addEventListener('input', () => {
    if(searchInput.value.trim() === ""){
      customerSearchQuery = "";
      if(clearSearchBtn) clearSearchBtn.style.display = 'none';
      const sBar = document.getElementById('searchStatusBar');
      if(sBar) sBar.style.display = 'none';
      renderPhones();
    } else {
      if(clearSearchBtn) clearSearchBtn.style.display = 'block';
    }
  });
}
if(clearSearchBtn) clearSearchBtn.addEventListener('click', window.clearSearch);
if(resetSearchFilterBtn) resetSearchFilterBtn.addEventListener('click', window.clearSearch);

// Phone request form
const phoneRequestForm = document.getElementById('phoneRequestForm');
if(phoneRequestForm){
  phoneRequestForm.addEventListener('submit', e => {
    e.preventDefault();
    const formData = new FormData(phoneRequestForm);
    const message = [
      `Hi DRG Phones Palace, my name is ${formData.get('name')}.`,
      `My phone number is ${formData.get('phone')}.`,
      `Preferred brand: ${formData.get('brand')}.`,
      `Budget: ${formData.get('budget') || 'To be discussed'}.`,
      `Phone request: ${formData.get('request')}`
    ].join(' ');
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
  });
}

// Catalogue-aware customer help assistant
const helpAgent = document.getElementById('helpAgent');
const helpAgentToggle = document.getElementById('helpAgentToggle');
const helpAgentClose = document.getElementById('helpAgentClose');
const helpAgentForm = document.getElementById('helpAgentForm');
const helpAgentInput = document.getElementById('helpAgentInput');
const helpAgentMessages = document.getElementById('helpAgentMessages');
function addHelpMessage(text, type){
  const message = document.createElement('div');
  message.className = `help-agent-message ${type}`;
  message.textContent = text;
  helpAgentMessages.appendChild(message);
  helpAgentMessages.scrollTop = helpAgentMessages.scrollHeight;
}
function getHelpReply(question){
  const query = question.toLowerCase();
  const model = phones.find(phone => query.includes(phone.model.toLowerCase()) || query.includes(phone.category));
  if(model) return `${model.model} is ${displayCondition(model)} at ${money(model.cashPrice)}. Available plans include ${Object.values(model.plans).map(plan => plan.label).join(', ')}.`;
  const budgetMatch = query.match(/(?:kes|ksh|budget|under)\s*([0-9][0-9,]*)/i);
  if(budgetMatch){
    const budget = Number(budgetMatch[1].replace(/,/g, ''));
    const matches = phones.filter(phone => Number(phone.cashPrice) <= budget).sort((a,b) => Number(b.cashPrice) - Number(a.cashPrice));
    if(matches.length) return `For a KES ${budget.toLocaleString()} budget, I recommend ${matches[0].model} at ${money(matches[0].cashPrice)}. Open Inventory and select the phone to see details.`;
    return `I could not find a phone under KES ${budget.toLocaleString()} in the current catalogue. Try a higher budget or ask us on WhatsApp about weekly plans.`;
  }
  if(/warranty|repair|guarantee/.test(query)) return 'Every renewed phone includes a one-year warranty. Eligible repairs receive a 90% discount, subject to the warranty terms.';
  if(/delivery|location|where|address/.test(query)) return 'We offer free countrywide delivery. Our store is at Pioneer House, 5th Floor, Kimathi Street, Nairobi.';
  if(/pay|plan|weekly|installment|deposit/.test(query)) return 'Payment options depend on the phone and include cash, standard weekly plans, MoSaver, and MoStandard.';
  if(/return|change|mind/.test(query)) return 'You have 48 hours to change your mind. Contact the team promptly so we can guide you through the return process.';
  return 'I can help with a phone model, budget, payment plan, warranty, repairs, delivery, or returns. Try “phone under KES 30,000”.';
}
helpAgentToggle.addEventListener('click', () => { helpAgent.classList.toggle('open'); if(helpAgent.classList.contains('open')) helpAgentInput.focus(); });
helpAgentClose.addEventListener('click', () => helpAgent.classList.remove('open'));
helpAgentForm.addEventListener('submit', event => { event.preventDefault(); const question = helpAgentInput.value.trim(); if(!question) return; addHelpMessage(question, 'user'); addHelpMessage(getHelpReply(question), 'bot'); helpAgentInput.value = ''; });

// Initial load & backend sync
renderPhones();
renderFeaturedPhones();
syncBackendData();
setInterval(syncBackendData, 20000);


/**
 * Default Seed Catalogue Data for DRG Phones Palace
 */
const DEFAULT_PHONES = [
  {
    id: "s25-ultra-256",
    category: "samsung",
    categoryLabel: "Samsung",
    model: "Galaxy S25 Ultra",
    storage: "256GB",
    condition: "Renewed · Grade A+",
    image: "images/galaxy-s25-ultra.jpg",
    specs: [
      "Snapdragon 8 Elite, 5G ready",
      "200MP Quad Camera, 100x Space Zoom",
      "Built-in S-Pen, Titanium Armor Frame"
    ],
    cashPrice: 115999,
    plans: {
      cash: { label: "Cash", deposit: 0, weekly: 0, weeks: 0, total: 115999, hint: "One-time payment · 0% financing fee" },
      mosaver: { label: "MoSaver (6M)", deposit: 52199, weekly: 4410, weeks: 26, total: 166859, hint: "⚡ 6 Months · Save KES 45,340 vs 12M" },
      mostandard: { label: "MoStandard (12M)", deposit: 40599, weekly: 3300, weeks: 52, total: 212199, hint: "Low deposit (35%) · 52 easy weekly payments" }
    },
    defaultPlan: "mostandard"
  },
  {
    id: "s24-ultra-256",
    category: "samsung",
    categoryLabel: "Samsung",
    model: "Galaxy S24 Ultra",
    storage: "256GB",
    condition: "Renewed · Grade A+",
    image: "images/galaxy-s24-ultra.jpg",
    specs: [
      "Galaxy AI built-in, 5G flagship",
      "200MP Quad Pro-visual camera",
      "Flat 120Hz display, S-Pen included"
    ],
    cashPrice: 94999,
    plans: {
      cash: { label: "Cash", deposit: 0, weekly: 0, weeks: 0, total: 94999, hint: "One-time payment · 0% financing fee" },
      mosaver: { label: "MoSaver (6M)", deposit: 42699, weekly: 3610, weeks: 26, total: 136559, hint: "⚡ 6 Months · Save KES 37,040 vs 12M" },
      mostandard: { label: "MoStandard (12M)", deposit: 33199, weekly: 2700, weeks: 52, total: 173599, hint: "Low deposit (35%) · 52 easy weekly payments" }
    },
    defaultPlan: "mostandard"
  },
  {
    id: "s23-ultra-256",
    category: "samsung",
    categoryLabel: "Samsung",
    model: "Galaxy S23 Ultra",
    storage: "256GB",
    condition: "Renewed · Grade A+",
    image: "images/galaxy-s23-ultra.jpg",
    specs: [
      "200MP camera, 100x Space Zoom",
      "6.8\" Dynamic AMOLED 2X 120Hz",
      "Built-in S-Pen, 5,000mAh battery"
    ],
    cashPrice: 76999,
    plans: {
      cash: { label: "Cash", deposit: 0, weekly: 0, weeks: 0, total: 76999, hint: "One-time payment · 0% financing fee" },
      mosaver: { label: "MoSaver (6M)", deposit: 34599, weekly: 2930, weeks: 26, total: 110779, hint: "⚡ 6 Months · Save KES 30,000 vs 12M" },
      mostandard: { label: "MoStandard (12M)", deposit: 26899, weekly: 2190, weeks: 52, total: 140779, hint: "Low deposit (35%) · 52 easy weekly payments" }
    },
    defaultPlan: "mostandard"
  },
  {
    id: "s22-ultra-256",
    category: "samsung",
    categoryLabel: "Samsung",
    model: "Galaxy S22 Ultra",
    storage: "256GB",
    condition: "Renewed · Grade A+",
    image: "images/galaxy-s22-ultra.jpg",
    specs: [
      "108MP Quad camera, 100x zoom",
      "Dynamic AMOLED 120Hz display",
      "Integrated S-Pen, 45W fast charge"
    ],
    cashPrice: 66999,
    plans: {
      cash: { label: "Cash", deposit: 0, weekly: 0, weeks: 0, total: 66999, hint: "One-time payment · 0% financing fee" },
      mosaver: { label: "MoSaver (6M)", deposit: 30099, weekly: 2550, weeks: 26, total: 96399, hint: "⚡ 6 Months · Save KES 25,800 vs 12M" },
      mostandard: { label: "MoStandard (12M)", deposit: 23399, weekly: 1900, weeks: 52, total: 122199, hint: "Low deposit (35%) · 52 easy weekly payments" }
    },
    defaultPlan: "mostandard"
  },
  {
    id: "s21-ultra-128",
    category: "samsung",
    categoryLabel: "Samsung",
    model: "Galaxy S21 Ultra 5G",
    storage: "128GB",
    condition: "Renewed · Grade A+",
    image: "images/galaxy-s21-ultra.jpg",
    specs: [
      "108MP Pro Grade Camera, 8K video",
      "6.8\" Quad HD+ 120Hz display",
      "S-Pen support, 5,000mAh battery"
    ],
    cashPrice: 45999,
    plans: {
      cash: { label: "Cash", deposit: 0, weekly: 0, weeks: 0, total: 45999, hint: "One-time payment · 0% financing fee" },
      mosaver: { label: "MoSaver (6M)", deposit: 20699, weekly: 1750, weeks: 26, total: 66199, hint: "⚡ 6 Months · Save KES 22,780 vs 12M" },
      mostandard: { label: "MoStandard (12M)", deposit: 11499, weekly: 1490, weeks: 52, total: 88979, hint: "Entry deposit (25%) · KES 1,490/week" }
    },
    defaultPlan: "mostandard"
  },
  {
    id: "s21-plus-256",
    category: "samsung",
    categoryLabel: "Samsung",
    model: "Galaxy S21+ 5G",
    storage: "256GB",
    condition: "Renewed · Grade A+",
    image: "images/galaxy-s21-plus.jpg",
    specs: [
      "256GB storage, 6.7\" AMOLED 120Hz",
      "64MP telephoto camera, 30x zoom",
      "4,800mAh battery, 5G ready"
    ],
    cashPrice: 43999,
    plans: {
      cash: { label: "Cash", deposit: 0, weekly: 0, weeks: 0, total: 43999, hint: "One-time payment · 0% financing fee" },
      mosaver: { label: "MoSaver (6M)", deposit: 19799, weekly: 1670, weeks: 26, total: 63219, hint: "⚡ 6 Months · Save KES 21,620 vs 12M" },
      mostandard: { label: "MoStandard (12M)", deposit: 10999, weekly: 1420, weeks: 52, total: 84839, hint: "Entry deposit (25%) · KES 1,420/week" }
    },
    defaultPlan: "mostandard"
  },
  {
    id: "s22-plus-128",
    category: "samsung",
    categoryLabel: "Samsung",
    model: "Galaxy S22+",
    storage: "128GB",
    condition: "Renewed · Grade A+",
    image: "images/galaxy-s22-plus.jpg",
    specs: [
      "Bright 6.6\" AMOLED 120Hz display",
      "50MP Nightography triple camera",
      "Armor Aluminum frame, 5G ready"
    ],
    cashPrice: 37999,
    plans: {
      cash: { label: "Cash", deposit: 0, weekly: 0, weeks: 0, total: 37999, hint: "One-time payment · 0% financing fee" },
      mosaver: { label: "MoSaver (6M)", deposit: 17099, weekly: 1440, weeks: 26, total: 54539, hint: "⚡ 6 Months · Save KES 18,920 vs 12M" },
      mostandard: { label: "MoStandard (12M)", deposit: 9499, weekly: 1230, weeks: 52, total: 73459, hint: "Entry deposit (25%) · KES 1,230/week" }
    },
    defaultPlan: "mostandard"
  },
  {
    id: "s20-ultra-128",
    category: "samsung",
    categoryLabel: "Samsung",
    model: "Galaxy S20 Ultra 5G",
    storage: "128GB",
    condition: "Renewed · Grade A+",
    image: "images/galaxy-s20-ultra.jpg",
    specs: [
      "108MP camera, 100x Space Zoom",
      "Massive 6.9\" Dynamic AMOLED 120Hz",
      "5,000mAh battery, 5G ready"
    ],
    cashPrice: 37999,
    plans: {
      cash: { label: "Cash", deposit: 0, weekly: 0, weeks: 0, total: 37999, hint: "One-time payment · 0% financing fee" },
      mosaver: { label: "MoSaver (6M)", deposit: 17099, weekly: 1440, weeks: 26, total: 54539, hint: "⚡ 6 Months · Save KES 18,920 vs 12M" },
      mostandard: { label: "MoStandard (12M)", deposit: 9499, weekly: 1230, weeks: 52, total: 73459, hint: "Entry deposit (25%) · KES 1,230/week" }
    },
    defaultPlan: "mostandard"
  },
  {
    id: "note-20-128",
    category: "samsung",
    categoryLabel: "Samsung",
    model: "Galaxy Note 20 5G",
    storage: "128GB",
    condition: "Renewed · Grade A+",
    image: "images/galaxy-note-20.jpg",
    specs: [
      "Signature S-Pen stylus with air gestures",
      "6.7\" Super AMOLED Plus display",
      "64MP triple camera, 5G ready"
    ],
    cashPrice: 35999,
    plans: {
      cash: { label: "Cash", deposit: 0, weekly: 0, weeks: 0, total: 35999, hint: "One-time payment · 0% financing fee" },
      mosaver: { label: "MoSaver (6M)", deposit: 16199, weekly: 1370, weeks: 26, total: 51819, hint: "⚡ 6 Months · Save KES 17,500 vs 12M" },
      mostandard: { label: "MoStandard (12M)", deposit: 8999, weekly: 1160, weeks: 52, total: 69319, hint: "Entry deposit (25%) · KES 1,160/week" }
    },
    defaultPlan: "mostandard"
  },
  {
    id: "s21-plus-128",
    category: "samsung",
    categoryLabel: "Samsung",
    model: "Galaxy S21+ 5G",
    storage: "128GB",
    condition: "Renewed · Grade A+",
    image: "images/galaxy-s21-plus.jpg",
    specs: [
      "6.7\" Dynamic AMOLED 120Hz display",
      "64MP telephoto camera, 30x zoom",
      "4,800mAh battery, 5G ready"
    ],
    cashPrice: 34199,
    plans: {
      cash: { label: "Cash", deposit: 0, weekly: 0, weeks: 0, total: 34199, hint: "One-time payment · 0% financing fee" },
      mosaver: { label: "MoSaver (6M)", deposit: 15399, weekly: 1300, weeks: 26, total: 49199, hint: "⚡ 6 Months · Save KES 17,020 vs 12M" },
      mostandard: { label: "MoStandard (12M)", deposit: 8499, weekly: 1110, weeks: 52, total: 66219, hint: "Lowest deposit (KES 8,499) · KES 1,110/week" }
    },
    defaultPlan: "mostandard"
  },
  {
    id: "iphone-11",
    category: "iphone",
    categoryLabel: "iPhone",
    model: "iPhone 11",
    storage: "64GB",
    condition: "Renewed · Grade A",
    image: "images/iphone-11.jpg",
    specs: [
      "6.1\" Liquid Retina display",
      "12MP dual camera, Face ID",
      "89% battery health"
    ],
    cashPrice: 16000,
    plans: {
      cash: { label: "Cash", deposit: 0, weekly: 0, weeks: 0, total: 16000, hint: "One-time cash payment" },
      standard: { label: "Weekly (8 Wks)", deposit: 4000, weekly: 1500, weeks: 8, total: 16000, hint: "8 Weeks Lipa Mdogo Mdogo" }
    },
    defaultPlan: "standard"
  },
  {
    id: "iphone-xr",
    category: "iphone",
    categoryLabel: "iPhone",
    model: "iPhone XR",
    storage: "128GB",
    condition: "Renewed · Grade A",
    image: "images/iphone-xr.jpg",
    specs: [
      "6.1\" Liquid Retina display",
      "12MP camera, Face ID",
      "Clean IMEI, tested"
    ],
    cashPrice: 13900,
    plans: {
      cash: { label: "Cash", deposit: 0, weekly: 0, weeks: 0, total: 13900, hint: "One-time cash payment" },
      standard: { label: "Weekly (8 Wks)", deposit: 3500, weekly: 1300, weeks: 8, total: 13900, hint: "8 Weeks Lipa Mdogo Mdogo" }
    },
    defaultPlan: "standard"
  },
  {
    id: "iphone-12",
    category: "iphone",
    categoryLabel: "iPhone",
    model: "iPhone 12",
    storage: "128GB",
    condition: "Renewed · Grade A",
    image: "images/iphone-12.jpg",
    specs: [
      "5G ready flagship",
      "12MP dual camera, Night mode",
      "Face ID, Ceramic Shield"
    ],
    cashPrice: 23000,
    plans: {
      cash: { label: "Cash", deposit: 0, weekly: 0, weeks: 0, total: 23000, hint: "One-time cash payment" },
      standard: { label: "Weekly (10 Wks)", deposit: 5000, weekly: 1800, weeks: 10, total: 23000, hint: "10 Weeks Lipa Mdogo Mdogo" }
    },
    defaultPlan: "standard"
  },
  {
    id: "galaxy-a14",
    category: "samsung",
    categoryLabel: "Samsung",
    model: "Galaxy A14",
    storage: "128GB",
    condition: "Renewed · Like New",
    image: "images/galaxy-a14.jpg",
    specs: [
      "6.6\" 90Hz display",
      "50MP triple camera",
      "5,000mAh battery"
    ],
    cashPrice: 9700,
    plans: {
      cash: { label: "Cash", deposit: 0, weekly: 0, weeks: 0, total: 9700, hint: "One-time cash payment" },
      standard: { label: "Weekly (8 Wks)", deposit: 2500, weekly: 900, weeks: 8, total: 9700, hint: "8 Weeks Lipa Mdogo Mdogo" }
    },
    defaultPlan: "standard"
  },
  {
    id: "moto-g54",
    category: "motorola",
    categoryLabel: "Motorola",
    model: "Moto G54",
    storage: "256GB",
    condition: "Renewed · Like New",
    image: "images/moto-g54.jpg",
    specs: [
      "5G, 6.5\" 120Hz display",
      "50MP OIS camera",
      "6,000mAh massive battery"
    ],
    cashPrice: 10400,
    plans: {
      cash: { label: "Cash", deposit: 0, weekly: 0, weeks: 0, total: 10400, hint: "One-time cash payment" },
      standard: { label: "Weekly (8 Wks)", deposit: 2800, weekly: 950, weeks: 8, total: 10400, hint: "8 Weeks Lipa Mdogo Mdogo" }
    },
    defaultPlan: "standard"
  },
  {
    id: "moto-edge-40",
    category: "motorola",
    categoryLabel: "Motorola",
    model: "Moto Edge 40",
    storage: "256GB",
    condition: "Renewed · Like New",
    image: "images/moto-edge-40.jpg",
    specs: [
      "Curved pOLED 144Hz display",
      "50MP camera, OIS",
      "68W fast charging"
    ],
    cashPrice: 15950,
    plans: {
      cash: { label: "Cash", deposit: 0, weekly: 0, weeks: 0, total: 15950, hint: "One-time cash payment" },
      standard: { label: "Weekly (9 Wks)", deposit: 3800, weekly: 1350, weeks: 9, total: 15950, hint: "9 Weeks Lipa Mdogo Mdogo" }
    },
    defaultPlan: "standard"
  },
  {
    id: "moto-g17",
    category: "motorola",
    categoryLabel: "Motorola",
    model: "Motorola Moto G17 4G",
    storage: "128GB",
    condition: "Renewed · Like New",
    image: "images/moto-g54.jpg",
    specs: [
      "Smooth 90Hz HD+ display",
      "50MP Quad Pixel camera system",
      "5,000mAh long battery life",
      "Dolby Atmos stereo speakers"
    ],
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

module.exports = { DEFAULT_PHONES };

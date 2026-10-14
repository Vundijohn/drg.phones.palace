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
    image: "images/S25/001-galaxy-s25ultra-titaniumsilverblue-device-spen-front.jpg",
    images: [
      "images/S25/001-galaxy-s25ultra-titaniumsilverblue-device-spen-front.jpg",
      "images/S25/002-galaxy-s25ultra-titaniumsilverblue-device-front.jpg",
      "images/S25/015-galaxy-s25ultra-titaniumsilverblue-device-r-side.jpg",
      "images/S25/019-galaxy-s25ultra-titaniumblack-device-spen-front.jpg",
      "images/S25/037-galaxy-s25ultra-titaniumgray-device-spen-front.jpg"
    ],
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
    image: "images/S24/PjcrUoXq7t-gWOXbHcUZ6dyAHayUCUMtNY73yUx15fwW2NqWoVgaxubB1ydEsLu7Kj8zGt-7fqqZ-Jc_qeNf5qMD-pl9ATSEQB8y5COp_cfql4T2OYKIIlfpTwMwNxUgCdgDwY7gRM-wyml4oiowupRcE9cmlifx9nfEeNUNbrjznOTlLw-gBm9bAyCqhLcH.jpg",
    images: [
      "images/S24/PjcrUoXq7t-gWOXbHcUZ6dyAHayUCUMtNY73yUx15fwW2NqWoVgaxubB1ydEsLu7Kj8zGt-7fqqZ-Jc_qeNf5qMD-pl9ATSEQB8y5COp_cfql4T2OYKIIlfpTwMwNxUgCdgDwY7gRM-wyml4oiowupRcE9cmlifx9nfEeNUNbrjznOTlLw-gBm9bAyCqhLcH.jpg",
      "images/S24/YJAsunXELN07996THEjRn8E5yfu-n2882SncG7sb2oDaluBZtEzLj69_T9AiQvt4JM8ODET3CDp-5761KvGGT_nFd32CrE4PIQVmtdQ8jha3In3VzcePypEr-7sneezD4uM5PU1c0dTIemKsbj6DxrVOwI7PnV-p0XM1gjWGPegOWYiEIHmBXSJ5hhkAtR7H.jpg",
      "images/S24/aS6JiPt_9AGcxdrzSZpoTdf1IdV8MfnHIy8ya_JzJdTnk3Jp_ynKy3CM3CLM2e45lyPO3SptseuGDokciADvwxDrIetBz0lxVq5r7Bi06ycU8AY-6dUEqrvDF3fgF7q2iHyZcHFSetmz11CUq56ikWn2gnwHoEpeYczwgmht-UDwniBntbt7mI_DTUKo1zJW.jpg",
      "images/S24/kx18rKVykzFAWMDoIeHdmoSEjgdUP9V62RcFSSMtzX6M7J6yL1OTMlBpPJgAsr-XIIehv6P8u4QY5vjyC0hKTQ_gaOPWxNFv1G8RjbLIYqfTruGkh-9fOawo-tpdV4Jts2Hcpj8KubQmW8IZ8FY2N0y8nmUYM1JBxEy4n_YNYrm70lgxd16hZP5VukFr6iwF.jpg"
    ],
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
    image: "images/S23/3zeKlm7xkWo-XXJGyyEycHGUX8mekIVlvBtwiqUz--MnNWABkToLeEfZE-CJahimKhCwaoO3t6V82DIq1Z3-WqUeCba4xARqb2gRLS0dS2W4rNY2wZ9AwDHubJVCR9sAssD3148HF8pdB5mK2apQz-cmIpqCxVt1FpT7zg7DSfM_NqQ4zKpwJI22H6BMgHna.jpg",
    images: [
      "images/S23/3zeKlm7xkWo-XXJGyyEycHGUX8mekIVlvBtwiqUz--MnNWABkToLeEfZE-CJahimKhCwaoO3t6V82DIq1Z3-WqUeCba4xARqb2gRLS0dS2W4rNY2wZ9AwDHubJVCR9sAssD3148HF8pdB5mK2apQz-cmIpqCxVt1FpT7zg7DSfM_NqQ4zKpwJI22H6BMgHna.jpg",
      "images/S23/Y0gK5FoIedKhuoyXtp_Es6owIijavGO8OoTIfK-9BHFe18h6ZoENITtJWnzyS3ncq0_AsnrYLgCKYyACrBmOK3sA_4b__mDxNVk0cErdInmB6SmKnrx-xesi0e-FttGICJrF30lWsPZGjwI9qYsLUuI1BMujNaSqfnBHaDou1sJGIGKlwfnMqctUmU-YquuQ.jpg",
      "images/S23/Zocerd5Tw0n4gFOScEYVaxPJXrZbGjOYXSMbYzHrD0KxSTG1MbMQHRgV0eeDoxXxecEYvwy3pkrMLIvxWjJtU7UAwsi9ClSdJusSg4aEa_w5yi6xBtpul4YMxjKcXUVxTXS8XlEGwVmIKKv0cXWvQ05q9FyioUza25nDRdsfT5WUejUS5YlmBUcXNqyU9rnd.jpg",
      "images/S23/fC8V5QjxwKWZmagPuZtiVtV-2u7pPzaqmppB0TAy2feUMxoynBdSv8IeXqOfYIKQrolVVGxK9ujlx16FUnZlZ9zQZU0vFWb0ZS0wMdqWBGhQux8nxwtuXa7Z1_UMsdnWmUnhGypGlAnMw3IrGjBdl7C6SBoyp3OeDcz3aXCBYvieNCEdunRn3bb7OSLX0eTl.jpg"
    ],
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
    image: "images/s22 ultra/073_galaxys22ultra_front_graphite.jpg",
    images: [
      "images/s22 ultra/073_galaxys22ultra_front_graphite.jpg",
      "images/s22 ultra/075_galaxys22ultra_device_pen_front_-graphite.jpg",
      "images/s22 ultra/077_galaxys22ultra_device_pen_back_-graphite.jpg",
      "images/s22 ultra/086_galaxys22ultra_l_side_-graphite.jpg",
      "images/s22 ultra/091_galaxys22ultra_front_red-1.jpg",
      "images/s22 ultra/109_galaxys22ultra_front_skyblue.jpg"
    ],
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
    image: "images/S21/001_galaxys21_ultra_phantom_black_front.jpg",
    images: [
      "images/S21/001_galaxys21_ultra_phantom_black_front.jpg",
      "images/S21/001_galaxys21_ultra_s_pen_front_black.jpg",
      "images/S21/002_galaxys21_ultra_phantom_black_back.jpg",
      "images/S21/002_galaxys21_ultra_phantom_brown_back.jpg",
      "images/S21/002_galaxys21_ultra_phantom_silver_back.jpg",
      "images/S21/002_galaxys21_ultra_phantom_titanium_back.jpg"
    ],
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
    image: "images/S20/002_galaxys20ultra_cosmic_gray_front-3.jpg",
    images: [
      "images/S20/002_galaxys20ultra_cosmic_gray_front-3.jpg",
      "images/S20/001_galaxys20ultra_cosmic_gray_back-3.jpg",
      "images/S20/004_galaxys20ultra_cosmic_gray_l_side-1.jpg",
      "images/S20/007_galaxys20ultra_cosmic_black_back-1.jpg"
    ],
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
    image: "images/12 plain/Ami2cOQVE-9pT41G3KFS_xLhnwYDEKT_Y8iH4JW6Q6Mk1W07jxfa3efGg_xWm8HYY-AuM7CVCdxTT1BIih_Q32RK8yx71AcHyB00Zlc2G5XGEbM5TdVHp7Zr-XmGuPmigfYhkuw4hdswWRE4yQFEeFtaA7OV-CFapr2U4xqO_Qn4KT-b4s8DUDwXrEIXV46L.jpg",
    images: [
      "images/12 plain/Ami2cOQVE-9pT41G3KFS_xLhnwYDEKT_Y8iH4JW6Q6Mk1W07jxfa3efGg_xWm8HYY-AuM7CVCdxTT1BIih_Q32RK8yx71AcHyB00Zlc2G5XGEbM5TdVHp7Zr-XmGuPmigfYhkuw4hdswWRE4yQFEeFtaA7OV-CFapr2U4xqO_Qn4KT-b4s8DUDwXrEIXV46L.jpg",
      "images/12 plain/BUwHAL2CwxhHXOMItmx4MgTGsl9lMb2rpsbeHT7urzm8u8qtzRZ8Ne-LZXhdh588Tg8aoj1qE6hup8RGftYiyWZYlXyd4uGv9cyj_sS96bIyyWHtUdvOvKiv49lJMPuYrQ9ZKhC-5bpa2Iv4umwLn9oC-aR9SGcNLlh_KXoN6c6_-Jxm3aBgX3Kgd23wdlzk.jpg",
      "images/12 plain/iLK0Um7exV0vvJ__YNbTY3CpqedeDNmEaEP0WEzS9UBSwSIeAY5wQFppfp4RhbfU3SsvssnsT13EZ5FfZyTpp9ODl33J2XttE8H4s3aclBDGPR9KFO-tYPK5FtVq-V_1rKUGnkMqMO-FovVKy6_UMJY3EqHIbVKMT3-McXKL6oVNmuo0MUzmhwoygnXniI2I.jpg",
      "images/12 plain/jwlT6efi-w8ileEcGp0UOAVk0dZjRL0QEAnMMQ9p4hvYbZPOm7RT_ac1yhagDl8mi7I4V28KOsLdYf36QpbBCuPyhtPIN8tRDXBubZOsy8MjYF7EBwxXlbKujD4YzcgS9No9evv39CyDgt2cdMTHMn3hDJis4o_gUwogXLremGFiCSeVUm-t0kDB7quUGsEt.jpg",
      "images/12 plain/nMMvzhCO5T24FSF4voCKEe9Aa878XXuGS4Mwl1-nApgAcbEkFAru2uQGzgk-CNrO1gi8f8LVqBv4DDamUFDXAm5yXEqaDmyFnM2TNYyMMLF81EKXeJUj0nxGmpHJ5KVfbUrGkTkcnFZPqqKfhXPqvIi4yIM4GqCAfS1MAdRvSCSMFi_8zNied-cZjRtGJh3Z.jpg",
      "images/12 plain/rkbdffzryVSjtBZPS0rnjvTmEH1tbfwptfTd6ZClnIaD9_HjEAwZMn_kfjnPmeIuA925YZAz2qtjm0uSfpo7NEh_9WKLISibyVetXILUFD5i7v85fWOhrTObnH29GogCx6BtSGxMCRgSIvkUZYv2WA51CLEQCLATkYrW408RIva9FFTGMccw1hfdq49aM9A5.jpg"
    ],
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
      cash: { label: "Cash", deposit: 0, weekly: 0, weeks: 0, total: 27500, hint: "One-time payment · 0% financing fee" },
      standard: { label: "Weekly (10 Wks)", deposit: 6500, weekly: 2100, weeks: 10, total: 27500, hint: "10 Weeks Lipa Mdogo Mdogo · Special Financing Offer" }
    },
    defaultPlan: "standard"
  },
];

module.exports = { DEFAULT_PHONES };

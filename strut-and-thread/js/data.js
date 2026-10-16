/* ==========================================================
   Strut & Thread - product catalogue
   Every page loads this file first. It exposes:
     PRODUCTS      array of product objects
   ========================================================== */

// p(id, name, division, category, shape, price, colorName, colorHex, options)
function p(id, name, division, category, shape, price, colorName, colorHex, o = {}) {
  return {
    id, name, division, category, shape, price,
    color: colorName, hex: colorHex,
    isNew: !!o.isNew,
    salePct: o.sale || 0,
    favorite: !!o.fav,
    sizes: o.sizes || (division === 'accessories' ? ['One size'] : ['XS', 'S', 'M', 'L', 'XL']),
    desc: o.desc || ''
  };
}

const PRODUCTS = [
  /* ---------- Women ---------- */
  p(1,  'Linen Wrap Dress',        'women', 'Dresses',          'dress',    2495, 'Sand',       '#c9a27e', { isNew: true, fav: true, desc: 'A breathable wrap dress in washed linen with a self-tie waist and a relaxed midi hem.' }),
  p(2,  'Floral Midi Dress',       'women', 'Dresses',          'dress',    2895, 'Rosewood',   '#b5656b', { sale: 30, desc: 'Soft viscose midi dress with a small-scale floral print and flutter sleeves.' }),
  p(3,  'Ribbed Knit Sweater',     'women', 'Sweaters',         'sweater',  1795, 'Oat',        '#d8c3a5', { isNew: true, fav: true, desc: 'A cosy ribbed sweater with a slightly cropped body, made for cooler evenings.' }),
  p(4,  'Oversized Cardigan',      'women', 'Cardigans',        'cardigan', 2195, 'Cocoa',      '#8b5a3c', { fav: true, desc: 'Chunky button-front cardigan with deep pockets and dropped shoulders.' }),
  p(5,  'Satin Blouse',            'women', 'Tops',             'top',      1495, 'Ivory',      '#efe3d0', { isNew: true, desc: 'Fluid satin blouse with a concealed placket and a gentle drape.' }),
  p(6,  'Everyday Cotton Tee',     'women', 'T-Shirts',         'tee',       695, 'Cream',      '#eadfce', { sale: 20, fav: true, desc: 'Our softest crew-neck tee in combed cotton. Pairs with everything.' }),
  p(7,  'High-Rise Mom Jeans',     'women', 'Jeans & Pants',    'jeans',    2195, 'Mid Indigo', '#4a6a8a', { fav: true, desc: 'High-rise, tapered-leg jeans in rigid denim that softens with wear.' }),
  p(8,  'Pleated Midi Skirt',      'women', 'Skirts',           'skirt',    1695, 'Chestnut',   '#6b4a3a', { isNew: true, desc: 'Knife-pleated midi skirt with an elastic back waistband.' }),
  p(9,  'Denim Shorts',            'women', 'Shorts & Skorts',  'shorts',   1195, 'Light Wash', '#5d7fa0', { sale: 25, desc: 'Mid-rise denim shorts with a clean raw hem.' }),
  p(10, 'Everyday Leggings',       'women', 'Leggings & Tights','leggings',  995, 'Espresso',   '#2b2220', { desc: 'Stretch leggings with a smooth, squat-proof feel and a hidden waist pocket.' }),
  p(11, 'Checked Blazer',          'women', 'Outerwear',        'blazer',   3495, 'Caramel',    '#9c6b45', { isNew: true, fav: true, desc: 'Tailored single-breasted blazer in a warm autumn check.' }),
  p(12, 'Wide-Leg Trousers',       'women', 'Jeans & Pants',    'pants',    1895, 'Stone',      '#d9c7ad', { sale: 35, desc: 'Pleated wide-leg trousers with a high waist and a full-length drape.' }),

  /* ---------- Men ---------- */
  p(13, 'Oxford Button-Down',      'men', 'Tops',          'shirt',   1695, 'Sky',       '#cfe0ea', { fav: true, desc: 'Classic oxford cloth shirt with a soft collar roll and a relaxed fit.' }),
  p(14, 'Heavyweight Tee',         'men', 'T-Shirts',      'tee',      795, 'Umber',     '#3a2a24', { sale: 20, desc: 'Boxy 220gsm cotton tee that keeps its shape wash after wash.' }),
  p(15, 'Merino Crew Sweater',     'men', 'Sweaters',      'sweater', 2395, 'Mushroom',  '#6b5b4b', { isNew: true, fav: true, desc: 'Fine-gauge merino crew neck. Warm without the bulk.' }),
  p(16, 'Chino Trousers',          'men', 'Jeans & Pants', 'pants',   1895, 'Khaki',     '#b79b73', { desc: 'Slim-straight chinos in stretch twill with a clean, flat front.' }),
  p(17, 'Straight Cut Jeans',      'men', 'Jeans & Pants', 'jeans',   2095, 'Dark Wash', '#3f5878', { fav: true, desc: 'Mid-rise straight jeans in 12oz selvedge-style denim.' }),
  p(18, 'Linen Shorts',            'men', 'Shorts & Skorts','shorts', 1095, 'Dune',      '#d6c3a1', { isNew: true, sale: 30, desc: 'Drawstring linen shorts for hot, humid days.' }),
  p(19, 'Wool-Blend Overcoat',     'men', 'Outerwear',     'blazer',  4295, 'Walnut',    '#4a3a32', { desc: 'Long wool-blend overcoat with a notch lapel and a clean back vent.' }),
  p(20, 'Zip Cardigan',            'men', 'Cardigans',     'cardigan',1995, 'Bark',      '#5c4a40', { desc: 'Full-zip knit cardigan with ribbed cuffs and hem.' }),
  p(21, 'Pinstripe Blazer',        'men', 'Outerwear',     'blazer',  3695, 'Tan',       '#c8a47e', { isNew: true, desc: 'Unstructured pinstripe blazer, easy to wear open or buttoned.' }),
  p(22, 'Jogger Pants',            'men', 'Jeans & Pants', 'pants',   1295, 'Ash',       '#7a7570', { sale: 40, desc: 'Brushed-back fleece joggers with a tapered leg.' }),

  /* ---------- Girls & Boys ---------- */
  p(23, 'Ruffle Play Dress',       'girls', 'Dresses',   'dress',   1295, 'Blush',    '#e9b8a8', { isNew: true, sizes: ['2Y', '4Y', '6Y', '8Y', '10Y'], desc: 'Twirl-ready cotton dress with tiered ruffles.' }),
  p(24, 'Pastel Cardigan',         'girls', 'Cardigans', 'cardigan', 995, 'Lilac',    '#d9c2d8', { sizes: ['2Y', '4Y', '6Y', '8Y', '10Y'], desc: 'Soft knit button cardigan in a gentle pastel.' }),
  p(25, 'Play Skirt',              'girls', 'Skirts',    'skirt',    695, 'Honey',    '#f0d58f', { sale: 25, sizes: ['2Y', '4Y', '6Y', '8Y', '10Y'], desc: 'Pull-on skirt with built-in shorts for easy movement.' }),
  p(26, 'Graphic Tee',             'girls', 'T-Shirts',  'tee',      495, 'Cream',    '#f6e6d0', { sale: 20, sizes: ['2Y', '4Y', '6Y', '8Y', '10Y'], desc: 'Organic cotton tee with a hand-drawn print.' }),
  p(27, 'Dino Tee',                'boys',  'T-Shirts',  'tee',      495, 'Sage',     '#a8c4a0', { sizes: ['2Y', '4Y', '6Y', '8Y', '10Y'], desc: 'Soft cotton tee with a playful dinosaur print.' }),
  p(28, 'Cargo Shorts',            'boys',  'Shorts & Skorts', 'shorts', 795, 'Camel', '#b49a74', { sale: 30, sizes: ['2Y', '4Y', '6Y', '8Y', '10Y'], desc: 'Roomy cargo shorts with an adjustable waist.' }),
  p(29, 'Pullover Sweater',        'boys',  'Sweaters',  'sweater', 1095, 'Slate',    '#7d8aa6', { isNew: true, sizes: ['2Y', '4Y', '6Y', '8Y', '10Y'], desc: 'Warm knit pullover with a reinforced elbow patch.' }),
  p(30, 'Denim Jeans',             'boys',  'Jeans & Pants', 'jeans', 1195, 'Blue',    '#4d6b8c', { sizes: ['2Y', '4Y', '6Y', '8Y', '10Y'], desc: 'Durable stretch denim with an adjustable inner waist.' }),

  /* ---------- Accessories ---------- */
  p(31, 'Leather Tote Bag',        'accessories', 'Bags',     'bag',        3295, 'Saddle',    '#8b5a3c', { isNew: true, fav: true, desc: 'Full-grain leather tote with a zip top and an inner pocket.' }),
  p(32, 'Mini Crossbody',          'accessories', 'Bags',     'bag',        1995, 'Espresso',  '#2b2220', { desc: 'A small crossbody with an adjustable strap and magnetic flap.' }),
  p(33, 'Canvas Weekender',        'accessories', 'Bags',     'bag',        1795, 'Natural',   '#c9b08a', { sale: 25, desc: 'Roomy waxed canvas weekender with leather handles.' }),
  p(34, 'Wide Brim Felt Hat',      'accessories', 'Hats',     'hat',        1495, 'Chestnut',  '#7a4f35', { isNew: true, fav: true, desc: 'Wool felt hat with a grosgrain band and a wide brim.' }),
  p(35, 'Straw Sun Hat',           'accessories', 'Hats',     'hat',         895, 'Wheat',     '#e0c88f', { sale: 30, desc: 'Hand-woven straw hat with UV protection.' }),
  p(36, 'White Leather Sneakers',  'accessories', 'Shoes',    'sneaker',    2995, 'Off White', '#f2ede6', { sale: 20, fav: true, sizes: ['36', '37', '38', '39', '40', '41', '42'], desc: 'Minimal leather sneakers with a cushioned insole.' }),
  p(37, 'Suede Ankle Boots',       'accessories', 'Shoes',    'boot',       3495, 'Tobacco',   '#8a5a3a', { isNew: true, sale: 35, sizes: ['36', '37', '38', '39', '40', '41', '42'], desc: 'Soft suede ankle boots with a stacked heel.' }),
  p(38, 'Woven Leather Belt',      'accessories', 'Belts',    'belt',        895, 'Mocha',     '#5b3a2c', { desc: 'Hand-woven leather belt with a brushed brass buckle.' }),
  p(39, 'Tortoise Sunglasses',     'accessories', 'Eyewear',  'sunglasses', 1295, 'Tortoise',  '#5b3a2c', { fav: true, desc: 'Acetate frames with UV400 lenses.' }),
  p(40, 'Minimalist Watch',        'accessories', 'Watches',  'watch',      3995, 'Brass',     '#b8a07a', { isNew: true, desc: 'Slim 36mm watch with a sapphire-coated face and a leather strap.' }),
  p(41, 'Gold Pendant Necklace',   'accessories', 'Jewelry',  'necklace',   1495, 'Gold',      '#c8a24a', { sale: 25, desc: 'Gold-plated pendant on a fine 45cm chain.' }),
  p(42, 'Wool Scarf',              'accessories', 'Scarves',  'scarf',      1195, 'Rust',      '#a0522d', { isNew: true, desc: 'Brushed wool scarf with a fringed edge.' })
];

/* ---------- derived values ---------- */
function salePrice(item) {
  return item.salePct ? Math.round(item.price * (1 - item.salePct / 100)) : item.price;
}

/* Hand-picked collection groupings used by the home page cards */
const COLLECTIONS = {
  favorites:  { label: "Buyer's Favorite", test: item => item.favorite },
  fall:       { label: 'Fall Collection',  test: item => ['Sweaters', 'Cardigans', 'Outerwear', 'Scarves', 'Hats'].includes(item.category) || item.shape === 'boot' },
  essentials: { label: 'Essentials',       test: item => ['T-Shirts', 'Jeans & Pants', 'Leggings & Tights', 'Belts'].includes(item.category) }
};

/* ---------- illustrations ----------
   Each shape is drawn in a 200 x 240 box. Fill comes from the
   product colour; a darker stroke and light highlight give depth. */
function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const f = v => Math.max(0, Math.min(255, Math.round(v + amt)));
  const r = f(n >> 16), g = f((n >> 8) & 255), b = f(n & 255);
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

const SHAPES = {
  tee:      c => `<path d="M62 38 L86 26 Q100 42 114 26 L138 38 L178 78 L154 98 L140 86 L140 204 L60 204 L60 86 L46 98 L22 78 Z" fill="${c}"/>`,
  top:      c => `<path d="M66 34 L84 28 Q100 50 116 28 L134 34 L170 70 L150 92 L138 80 L142 204 L58 204 L62 80 L50 92 L30 70 Z" fill="${c}"/><path d="M100 50 L100 204" stroke="rgba(0,0,0,.12)" stroke-width="2"/>`,
  shirt:    c => `<path d="M62 36 L84 26 L100 44 L116 26 L138 36 L180 92 L158 104 L142 88 L142 206 L58 206 L58 88 L42 104 L20 92 Z" fill="${c}"/><path d="M84 26 L100 60 L116 26 M100 60 L100 206" stroke="rgba(0,0,0,.18)" stroke-width="2" fill="none"/><g fill="rgba(0,0,0,.2)"><circle cx="100" cy="86" r="2"/><circle cx="100" cy="118" r="2"/><circle cx="100" cy="150" r="2"/></g>`,
  sweater:  c => `<path d="M64 36 L88 26 Q100 38 112 26 L136 36 L180 160 L156 168 L138 100 L138 208 L62 208 L62 100 L44 168 L20 160 Z" fill="${c}"/><path d="M62 196 H138 M20 160 L44 168 M180 160 L156 168" stroke="rgba(0,0,0,.18)" stroke-width="3"/><path d="M80 60 V190 M100 60 V190 M120 60 V190" stroke="rgba(0,0,0,.07)" stroke-width="2"/>`,
  cardigan: c => `<path d="M62 36 L86 26 L100 56 L114 26 L138 36 L180 160 L156 168 L138 100 L138 208 L62 208 L62 100 L44 168 L20 160 Z" fill="${c}"/><path d="M100 56 V208" stroke="rgba(0,0,0,.25)" stroke-width="3"/><g fill="rgba(0,0,0,.28)"><circle cx="106" cy="84" r="3"/><circle cx="106" cy="118" r="3"/><circle cx="106" cy="152" r="3"/><circle cx="106" cy="186" r="3"/></g>`,
  blazer:   c => `<path d="M60 34 L86 24 L100 70 L114 24 L140 34 L182 168 L156 176 L140 104 L140 214 L60 214 L60 104 L44 176 L18 168 Z" fill="${c}"/><path d="M86 24 L100 70 L114 24 M100 70 L100 214 M70 150 H88 M112 150 H130" stroke="rgba(0,0,0,.28)" stroke-width="2.5" fill="none"/><circle cx="104" cy="108" r="3" fill="rgba(0,0,0,.3)"/>`,
  dress:    c => `<path d="M76 28 L90 22 Q100 36 110 22 L124 28 L132 92 L126 104 L170 214 Q100 232 30 214 L74 104 L68 92 Z" fill="${c}"/><path d="M74 104 H126" stroke="rgba(0,0,0,.2)" stroke-width="3"/><path d="M90 110 L72 216 M110 110 L128 216" stroke="rgba(0,0,0,.08)" stroke-width="2"/>`,
  skirt:    c => `<path d="M68 40 H132 L170 196 Q100 214 30 196 Z" fill="${c}"/><path d="M68 40 H132" stroke="rgba(0,0,0,.25)" stroke-width="6"/><path d="M84 46 L62 202 M100 46 V208 M116 46 L138 202" stroke="rgba(0,0,0,.1)" stroke-width="2"/>`,
  jeans:    c => `<path d="M60 30 H140 L148 214 H108 L100 94 L92 214 H52 Z" fill="${c}"/><path d="M60 30 H140 V44 H60 Z" fill="rgba(0,0,0,.18)"/><path d="M100 44 V94 M72 60 Q82 70 90 62" stroke="rgba(255,255,255,.3)" stroke-width="2" fill="none"/>`,
  pants:    c => `<path d="M60 30 H140 L152 216 H108 L100 90 L92 216 H48 Z" fill="${c}"/><path d="M60 30 H140 V42 H60 Z" fill="rgba(0,0,0,.15)"/><path d="M80 44 L72 214 M120 44 L128 214" stroke="rgba(0,0,0,.1)" stroke-width="2"/>`,
  leggings: c => `<path d="M64 30 H136 L140 216 H108 L100 84 L92 216 H60 Z" fill="${c}"/><path d="M64 30 H136 V42 H64 Z" fill="rgba(255,255,255,.14)"/>`,
  shorts:   c => `<path d="M58 40 H142 L154 138 H108 L100 92 L92 138 H46 Z" fill="${c}"/><path d="M58 40 H142 V52 H58 Z" fill="rgba(0,0,0,.18)"/><path d="M100 52 V92" stroke="rgba(0,0,0,.18)" stroke-width="2"/>`,
  bag:      c => `<path d="M72 96 Q72 40 100 40 Q128 40 128 96" fill="none" stroke="${shade(c, -35)}" stroke-width="7" stroke-linecap="round"/><path d="M42 94 H158 L170 208 H30 Z" fill="${c}"/><path d="M42 94 H158" stroke="rgba(0,0,0,.2)" stroke-width="4"/><rect x="90" y="108" width="20" height="14" rx="3" fill="rgba(255,255,255,.35)"/>`,
  hat:      c => `<path d="M52 140 Q50 78 100 76 Q150 78 148 140 Z" fill="${c}"/><path d="M52 132 Q100 146 148 132 V144 Q100 158 52 144 Z" fill="rgba(0,0,0,.28)"/><path d="M14 150 Q100 132 186 150 Q100 176 14 150 Z" fill="${shade(c, -14)}"/>`,
  sneaker:  c => `<path d="M24 158 Q58 156 82 124 L116 140 Q150 146 178 168 L180 186 H24 Z" fill="${c}"/><path d="M24 178 H180 V190 H24 Z" fill="rgba(0,0,0,.28)"/><path d="M92 132 L96 146 M104 138 L108 150 M116 142 L120 154" stroke="rgba(0,0,0,.25)" stroke-width="2.5"/>`,
  boot:     c => `<path d="M64 52 H108 L112 128 Q150 136 178 164 L180 188 H58 L66 128 Z" fill="${c}"/><path d="M58 176 H180 V192 H58 Z" fill="rgba(0,0,0,.3)"/><path d="M64 72 H108" stroke="rgba(0,0,0,.2)" stroke-width="3"/>`,
  belt:     c => `<rect x="12" y="104" width="176" height="28" rx="6" fill="${c}"/><rect x="82" y="96" width="36" height="44" rx="5" fill="none" stroke="#d4b25a" stroke-width="6"/><circle cx="48" cy="118" r="2.5" fill="rgba(255,255,255,.4)"/><circle cx="148" cy="118" r="2.5" fill="rgba(255,255,255,.4)"/>`,
  sunglasses: c => `<path d="M24 100 Q24 88 36 88 H84 Q96 88 96 100 V118 Q96 140 66 140 Q24 140 24 118 Z" fill="${c}"/><path d="M104 100 Q104 88 116 88 H164 Q176 88 176 100 V118 Q176 140 146 140 Q104 140 104 118 Z" fill="${c}"/><path d="M96 100 Q100 94 104 100" stroke="${c}" stroke-width="5" fill="none"/><path d="M24 100 L10 92 M176 100 L190 92" stroke="${c}" stroke-width="5" stroke-linecap="round"/>`,
  watch:    c => `<rect x="82" y="22" width="36" height="52" rx="6" fill="${shade(c, -45)}"/><rect x="82" y="166" width="36" height="52" rx="6" fill="${shade(c, -45)}"/><circle cx="100" cy="120" r="48" fill="${c}"/><circle cx="100" cy="120" r="38" fill="#f6efe4"/><path d="M100 120 V94 M100 120 L118 130" stroke="#2b2220" stroke-width="3" stroke-linecap="round"/>`,
  necklace: c => `<path d="M42 40 Q100 190 158 40" fill="none" stroke="${c}" stroke-width="4" stroke-linecap="round"/><circle cx="100" cy="148" r="16" fill="${c}"/><circle cx="100" cy="148" r="8" fill="rgba(255,255,255,.4)"/>`,
  scarf:    c => `<path d="M48 40 Q100 76 152 40 L160 84 Q100 120 40 84 Z" fill="${c}"/><path d="M62 96 L98 98 L96 212 L56 212 Z" fill="${shade(c, -14)}"/><path d="M56 212 v10 M64 212 v10 M72 212 v10 M80 212 v10 M88 212 v10" stroke="${c}" stroke-width="2.5"/>`
};

function garmentSVG(item) {
  const draw = SHAPES[item.shape] || SHAPES.tee;
  const body = draw(item.hex);
  return `<svg viewBox="0 0 200 240" role="img" aria-label="${item.name} in ${item.color}" xmlns="http://www.w3.org/2000/svg">
    <g stroke="rgba(0,0,0,.22)" stroke-width="1.5" stroke-linejoin="round">${body}</g>
  </svg>`;
}

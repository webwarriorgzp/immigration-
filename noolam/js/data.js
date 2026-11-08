// All content lives here. Photos are from cult91.com (assets/), with real
// product names, prices and links. Any item without an `img` falls back to the
// procedural placeholder art in placeholders.js.

const A = (f) => `assets/${f}`;
const SHOP = (handle) => `https://cult91.com/products/${handle}`;

// Colour stories: used for accents, dots, story backdrops and the 3D ribbons.
export const SILKS = {
  maroon:  { name: 'Maroon',       base: '#6d0f22', border: '#c9a24a', motif: '#e2bf6a' },
  magenta: { name: 'Rani Pink',    base: '#b3125f', border: '#e7c35a', motif: '#ffd6e8' },
  teal:    { name: 'Teal',         base: '#0f5c63', border: '#d4ad52', motif: '#9ee0d8' },
  sindoor: { name: 'Sindoor',      base: '#d1301f', border: '#f0c75e', motif: '#ffe1a8' },
  koorai:  { name: 'Koorai Check', base: '#a8323e', border: '#2c6b3a', motif: '#f3d58a', check: true },
  mango:   { name: 'Mustard Gold', base: '#e2a417', border: '#7a1426', motif: '#7a1426' },
  peacock: { name: 'Royal Blue',   base: '#173d8c', border: '#d8b24f', motif: '#6fd0c4' },
  ivory:   { name: 'Tussar Beige', base: '#d8c3a0', border: '#a3122f', motif: '#c9a24a' },
  parrot:  { name: 'Olive',        base: '#6b8a1a', border: '#c2185b', motif: '#f2d06b' },
  noir:    { name: 'Black & Gold', base: '#1f1a17', border: '#c9a24a', motif: '#e2bf6a' },
  violet:  { name: 'Violet',       base: '#3b2a8c', border: '#c2185b', motif: '#e2bf6a' },
  grey:    { name: 'Grey',         base: '#5d6066', border: '#b0457a', motif: '#e2bf6a' },
  orange:  { name: 'Tussar Orange',base: '#c4482a', border: '#e7c35a', motif: '#ffe1a8' },
};

// Hero: starts zoomed into the fabric at `focus`, pulls back to the full photo.
export const HERO = { img: A('women-silk-handloom-saree-black-1.jpg'), focus: '52% 66%' };

export const LOOKS = [
  { name: 'Black & Gold Silk', silk: 'noir',   img: A('women-silk-handloom-saree-black-1.jpg'),  thumb: A('women-silk-handloom-saree-black-2.jpg'),  url: SHOP('women-silk-handloom-saree-black'),  pieces: [['Women silk handloom saree, black', 7999]] },
  { name: 'Violet Silk',       silk: 'violet', img: A('women-silk-handloom-saree-voilet-1.jpg'), thumb: A('women-silk-handloom-saree-voilet-2.jpg'), url: SHOP('women-silk-handloom-saree-voilet'), pieces: [['Women silk handloom saree, violet', 4480]] },
  { name: 'Olive Silk',        silk: 'parrot', img: A('women-silk-handloom-saree-olive-1.jpg'),  thumb: A('women-silk-handloom-saree-olive-2.jpg'),  url: SHOP('women-silk-handloom-saree-olive'),  pieces: [['Women silk handloom saree, olive', 3999]] },
  { name: 'Beige Tussar',      silk: 'ivory',  img: A('beige-handwoven-tussar-silk-saree-1.jpg'), thumb: A('beige-handwoven-tussar-silk-saree-2.jpg'), url: SHOP('beige-handwoven-tussar-silk-saree'), pieces: [['Beige handwoven tussar silk saree', 5599]] },
  { name: 'Orange Tussar',     silk: 'orange', img: A('orange-tussar-handloom-saree-1.jpg'),     thumb: A('orange-tussar-handloom-saree-2.jpg'),     url: SHOP('orange-tussar-handloom-saree'),     pieces: [['Orange tussar handloom saree', 7199]] },
  { name: 'Grey Tussar',       silk: 'grey',   img: A('grey-tussar-handloom-saree-1.jpg'),       thumb: A('grey-tussar-handloom-saree-2.jpg'),       url: SHOP('grey-tussar-handloom-saree'),       pieces: [['Grey tussar handloom saree', 7199]] },
  { name: 'Teal Tussar',       silk: 'teal',   img: A('teal-tussar-handloom-saree-1.jpg'),       thumb: A('teal-tussar-handloom-saree-2.jpg'),       url: SHOP('teal-tussar-handloom-saree'),       pieces: [['Teal tussar handloom saree', 7199]] },
  { name: 'Ivory Tussar',      silk: 'ivory',  img: A('beige-tussar-handloom-saree-1.jpg'),      thumb: A('beige-tussar-handloom-saree-2.jpg'),      url: SHOP('beige-tussar-handloom-saree'),      pieces: [['Beige tussar handloom saree', 7199]] },
];

export const CARDS = [
  { silk: 'magenta', word: 'RANI',    title: 'Rani Pink Mirror Work Kurta Set', price: 7999, bg: '#f7c3dc', img: A('rani-pink-mirror-work-kurta-with-zari-pr-1.jpg') },
  { silk: 'maroon',  word: 'RED',     title: 'Red Silk Suit, Gold Floral',      price: 6599, bg: '#f3c6cf', img: A('red-silk-suit-with-gold-floral-embroider-1.jpg') },
  { silk: 'teal',    word: 'TEAL',    title: 'Teal Blue Kurta Pant Set',        price: 2799, bg: '#bfe6e2', img: A('teal-blue-embroidered-kurta-pant-set-wit-1.jpg') },
  { silk: 'sindoor', word: 'ORANGE',  title: 'Orange Shaded Sequin Suit',       price: 5999, bg: '#ffd2b8', img: A('orange-shaded-suit-with-sequin-embellish-1.jpg') },
  { silk: 'magenta', word: 'SHIBORI', title: 'Pink Shibori Mirror Kurta',       price: 5999, bg: '#f9d0e4', img: A('pink-shibori-tie-dye-kurta-with-heavy-mi-1.jpg') },
  { silk: 'peacock', word: 'ROYAL',   title: 'Royal Blue Mirror Work Suit',     price: 6599, bg: '#c7d3f4', img: A('royal-blue-traditional-suit-with-mirror--1.jpg') },
];

export const RACK_FILTERS = [
  ['all', 'All pieces'], ['saree', 'Sarees'], ['suit', 'Suit Sets'],
  ['anarkali', 'Anarkali'], ['kaftan', 'Kaftans'], ['festive', 'Co-ords & Lehenga'],
];

export const RACK = [
  { cat: 'saree',    silk: 'violet',  name: 'Violet Silk Handloom Saree', price: 4480,  img: A('women-silk-handloom-saree-voilet-1.jpg') },
  { cat: 'suit',     silk: 'peacock', name: 'Navy Shibori Kurta Set',     price: 6999,  img: A('navy-blue-embroidered-kurta-set-with-shi-1.jpg') },
  { cat: 'anarkali', silk: 'ivory',   name: 'Ivory Sequin Anarkali',      price: 5599,  img: A('ivory-sequin-embroidered-anarkali-suit-s-1.jpg') },
  { cat: 'kaftan',   silk: 'ivory',   name: 'Gold Striped Rabari Kaftan', price: 6999,  img: A('beige-gold-striped-kaftan-with-rabari-mi-1.jpg') },
  { cat: 'saree',    silk: 'orange',  name: 'Orange Tussar Saree',        price: 7199,  img: A('orange-tussar-handloom-saree-1.jpg') },
  { cat: 'festive',  silk: 'mango',   name: 'Shimmer Gold Co-ord Set',    price: 7999,  img: A('shimmer-gold-co-ord-set-with-zari-embroi-1.jpg') },
  { cat: 'suit',     silk: 'maroon',  name: 'Red Silk Floral Suit',       price: 6599,  img: A('red-silk-suit-with-gold-floral-embroider-1.jpg') },
  { cat: 'anarkali', silk: 'peacock', name: 'Blue Layered Anarkali',      price: 5599,  img: A('blue-layered-anarkali-set-with-gota-patt-1.jpg') },
  { cat: 'kaftan',   silk: 'peacock', name: 'Royal Blue Zardozi Kaftan',  price: 5599,  img: A('royal-blue-satin-kaftan-with-gold-zardoz-1.jpg') },
  { cat: 'saree',    silk: 'grey',    name: 'Grey Tussar Saree',          price: 7199,  img: A('grey-tussar-handloom-saree-1.jpg') },
  { cat: 'festive',  silk: 'orange',  name: 'Orange Mirror Lehenga Set',  price: 11999, img: A('orange-mirror-embellished-lehenga-set-1.jpg') },
  { cat: 'suit',     silk: 'teal',    name: 'Teal Blue Kurta Pant Set',   price: 2799,  img: A('teal-blue-embroidered-kurta-pant-set-wit-1.jpg') },
];

// Feel the drape: eight side tiles and a crossfading centre "clip".
// Swap the centre for a real video by setting DRAPE.video.
export const DRAPE = {
  tiles: [
    A('teal-tussar-handloom-saree-2.jpg'), A('orange-embroidered-blouse-with-draped-sk-2.jpg'),
    A('beige-tussar-handloom-saree-2.jpg'), A('lilac-v-neck-kurta-set-with-pearl-lace-d-1.jpg'),
    A('women-silk-handloom-saree-voilet-2.jpg'), A('women-silk-handloom-saree-olive-2.jpg'),
    A('grey-tussar-handloom-saree-2.jpg'), A('beige-handwoven-tussar-silk-saree-1.jpg'),
  ],
  slides: [
    A('orange-tussar-handloom-saree-1.jpg'), A('orange-tussar-handloom-saree-2.jpg'),
    A('beige-handwoven-tussar-silk-saree-2.jpg'), A('women-silk-handloom-saree-black-2.jpg'),
  ],
  video: null,
};

export const REELS = [
  { title: 'Orange tussar, in the light', silk: 'orange',  tint: '#6e2412', img: A('orange-tussar-handloom-saree-1.jpg') },
  { title: 'Grey and wine pallu',         silk: 'grey',    tint: '#2b2d33', img: A('grey-tussar-handloom-saree-1.jpg') },
  { title: 'Navy shibori, festive edit',  silk: 'peacock', tint: '#0e2557', img: A('navy-blue-embroidered-kurta-set-with-shi-1.jpg') },
  { title: 'Peach satin and mirror work', silk: 'orange',  tint: '#7a3a22', img: A('peach-satin-kurta-with-mirror-work-embro-1.jpg') },
  { title: 'White lotus print',           silk: 'ivory',   tint: '#3c4a3a', img: A('white-lotus-print-kurta-with-printed-pal-1.jpg') },
  { title: 'The mirror lehenga',          silk: 'sindoor', tint: '#6b1d0e', img: A('orange-mirror-embellished-lehenga-set-1.jpg') },
];

export const BRIDAL = [
  { name: 'Mirror Lehenga',   silk: 'sindoor', img: A('orange-mirror-embellished-lehenga-set-1.jpg') },
  { name: 'Draped Saree Set', silk: 'orange',  img: A('orange-embroidered-blouse-with-draped-sk-1.jpg') },
  { name: 'Black & Gold',     silk: 'noir',    img: A('women-silk-handloom-saree-black-2.jpg') },
  { name: 'Red Silk Floral',  silk: 'maroon',  img: A('red-silk-suit-with-gold-floral-embroider-1.jpg') },
  { name: 'Ivory Anarkali',   silk: 'ivory',   img: A('ivory-sequin-embroidered-anarkali-suit-s-1.jpg') },
];

export const WEAVE = ['maroon', 'magenta', 'mango'];

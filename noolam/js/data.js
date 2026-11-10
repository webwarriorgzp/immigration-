// NOOLAM content. Photography and products are from cult91.com: real names,
// prices and product links. Cut-outs (assets/cut) were made from the same photos.

const A = (f) => `assets/${f}`;
const CUT = (f) => `assets/cut/${f}.webp`;
const SHOP = (handle) => `https://cult91.com/products/${handle}`;

export const TICKER = [
  ['THE LOOMS', 'Handwoven in Kanchipuram, one saree at a time'],
  ['TRY THE LOOK', 'Eight looks, styled head to toe'],
  ['PURE ZARI', 'Silver-core zari woven into every temple border'],
  ['THE RACK', 'Browse the full rail of silks'],
  ['BRIDAL', 'Heirloom bridal silks for the day that matters'],
];

export const HERO = {
  silk: A('hero-silk.jpg'),
  showroom: A('hero-showroom.jpg'),
  heritage: A('hero-heritage.jpg'),
};

export const BAND = ['KANJIVARAM', 'PURE ZARI', 'HANDWOVEN', 'TEMPLE BORDERS', 'BRIDAL SILK', 'KANCHIPURAM'];

// Six Moods: jharokha arches with cut-outs on pastel grounds.
export const MOODS = [
  { name: 'Handloom Edit',   img: CUT('look-beige'),  bg: ['#f6dcd6', '#e9b8ae'] },
  { name: 'Festive Suits',   img: CUT('card-rani'),   bg: ['#d9ecd8', '#a9cfa6'] },
  { name: 'Anarkali Hour',   img: CUT('mood-ivory'),  bg: ['#efe1f3', '#cfb3dc'] },
  { name: 'Kaftan Sunset',   img: CUT('mood-kaftan'), bg: ['#fde4c8', '#f2bf8a'] },
  { name: 'Shibori Days',    img: CUT('mood-navy'),   bg: ['#dbe7f5', '#a9c3e4'] },
  { name: 'Lotus & Lace',    img: CUT('mood-lotus'),  bg: ['#f9efc9', '#ecd58b'] },
];

// Try the Look. Hotspots are % positions on the cut-out.
// Only the saree is priced: blouse piece and pallu are part of it.
const piecesFor = (title, price) => [
  { name: title, price },
  { name: 'Blouse piece', note: 'Included with the saree' },
  { name: 'Zari border & pallu', note: 'Woven into the saree' },
];
export const LOOKS = [
  { name: 'Noir Zari',      title: 'Women silk handloom saree, black', price: 7999, img: CUT('look-black'),   thumb: A('women-silk-handloom-saree-black-2.jpg'),  url: SHOP('women-silk-handloom-saree-black'),  spots: [[50, 62], [30, 24], [70, 44]] },
  { name: 'Midnight Violet', title: 'Women silk handloom saree, violet', price: 4480, img: CUT('look-violet'),  thumb: A('women-silk-handloom-saree-voilet-2.jpg'), url: SHOP('women-silk-handloom-saree-voilet'), spots: [[40, 62], [44, 24], [70, 70]] },
  { name: 'Olive Grove',     title: 'Women silk handloom saree, olive', price: 3999, img: CUT('look-olive'),   thumb: A('women-silk-handloom-saree-olive-2.jpg'),  url: SHOP('women-silk-handloom-saree-olive'),  spots: [[42, 66], [30, 26], [68, 66]] },
  { name: 'Tussar Dawn',     title: 'Beige handwoven tussar silk saree', price: 5599, img: CUT('look-beige'),   thumb: A('beige-handwoven-tussar-silk-saree-2.jpg'), url: SHOP('beige-handwoven-tussar-silk-saree'), spots: [[40, 64], [28, 22], [62, 50]] },
  { name: 'Sindoor Tussar',  title: 'Orange tussar handloom saree', price: 7199, img: CUT('look-orange'),  thumb: A('orange-tussar-handloom-saree-2.jpg'),     url: SHOP('orange-tussar-handloom-saree'),     spots: [[34, 66], [26, 22], [70, 70]] },
  { name: 'Grey Monsoon',    title: 'Grey tussar handloom saree', price: 7199, img: CUT('look-grey'),    thumb: A('grey-tussar-handloom-saree-2.jpg'),       url: SHOP('grey-tussar-handloom-saree'),       spots: [[52, 66], [56, 24], [72, 56]] },
  { name: 'Rust Drape',      title: 'Orange embroidered blouse with draped skirt saree set', price: 6599, img: CUT('look-draped'), thumb: A('orange-embroidered-blouse-with-draped-sk-2.jpg'), url: SHOP('rust-embroidered-kurta-pant-set-with-dupatta-copy'), spots: [[46, 66], [46, 20], [74, 40]] },
  { name: 'Mirror Lehenga',  title: 'Orange mirror embellished lehenga set', price: 11999, img: CUT('look-lehenga'), thumb: A('orange-mirror-embellished-lehenga-set-1.jpg'), url: SHOP('orange-mirror-embellished-lehenga-set'), spots: [[50, 70], [52, 22], [30, 30]], pieces: [
    { name: 'Orange mirror embellished lehenga set', price: 11999 },
    { name: 'Mirror-work blouse', note: 'Part of the set' },
    { name: 'Flared lehenga skirt', note: 'Part of the set' },
  ] },
].map((l) => ({ ...l, pieces: l.pieces || piecesFor(l.title, l.price) }));

// Pick a Silk: vivid cards with condensed titles.
export const CARDS = [
  { t: ['RANI', 'MIRROR'],    color: '#e0177d', img: CUT('card-rani'),         title: 'Rani Pink Mirror Work Kurta Set',      price: 7999, url: SHOP('red-silk-suit-with-gold-floral-embroidery-dupatta-copy') },
  { t: ['MUSTARD', 'GOLD'],   color: '#f2b705', img: CUT('card-mustard'),      title: 'Mustard Yellow Straight Kurta Set',    price: 2799, url: SHOP('peacock-green-v-neck-kurta-palazzo-set-with-dupatta-copy') },
  { t: ['PEACOCK', 'GREEN'],  color: '#17b04b', img: CUT('card-peacock'),      title: 'Peacock Green V-Neck Palazzo Set',     price: 2799, url: SHOP('light-beige-v-neck-kurta-set-with-sheer-dupatta-copy') },
  { t: ['SINDOOR', 'RED'],    color: '#e3201b', img: CUT('card-red'),          title: 'Red Silk Suit, Gold Floral',           price: 6599, url: SHOP('shimmer-gold-sharara-suit-with-zari-embroidery-copy') },
  { t: ['ROYAL', 'MIRROR'],   color: '#1c6ef2', img: CUT('card-royal'),        title: 'Royal Blue Mirror Work Suit',          price: 6599, url: SHOP('white-lotus-print-kurta-with-printed-palazzo-dupatta-copy') },
  { t: ['SAFFRON', 'SEQUIN'], color: '#ff8a00', img: CUT('card-orange'),       title: 'Orange Shaded Sequin Suit',            price: 5999, url: SHOP('lime-green-shaded-suit-with-sequin-embellished-neckline-copy') },
  { t: ['VIOLET', 'HANDWORK'],color: '#7b2ff2', img: CUT('card-violet'),       title: 'Violet 3-Piece Hand Work Set',         price: 5999, url: SHOP('pink-3-piece-set-with-hand-work-copy') },
  { t: ['SHIBORI', 'PINK'],   color: '#ff3d7f', img: CUT('card-shibori'),      title: 'Pink Shibori Mirror Work Kurta',       price: 5999, url: SHOP('rani-pink-mirror-work-kurta-with-zari-printed-pants-copy') },
  { t: ['TEAL', 'THREAD'],    color: '#00a3a3', img: CUT('card-teal'),         title: 'Teal Blue Embroidered Kurta Set',      price: 2799, url: SHOP('red-embroidered-kurta-pant-set-with-mirror-border-dupatta-copy') },
  { t: ['GOTA', 'BLUE'],      color: '#3a4fd9', img: CUT('card-blueanarkali'), title: 'Blue Layered Anarkali, Gota Patti',    price: 5599, url: SHOP('ivory-sequin-embroidered-anarkali-suit-set-with-dupatta-copy') },
  { t: ['SHIMMER', 'GOLD'],   color: '#c9a227', img: CUT('card-gold'),         title: 'Shimmer Gold Co-ord, Zari',            price: 7999, url: SHOP('green-embroidered-kaftan-kurta-with-side-slits-copy') },
  { t: ['HALDI', 'ANARKALI'], color: '#ffc21a', img: CUT('card-yellow'),       title: 'Yellow 3-Piece Anarkali Set',          price: 2999, url: SHOP('peach-3-piece-suit-set-with-heavy-work-on-front-copy') },
];

// The Rack.
export const RACK_FILTERS = [
  ['all', 'All pieces'], ['saree', 'Silk Sarees'], ['suit', 'Suit Sets'],
  ['anarkali', 'Anarkali'], ['kaftan', 'Kaftans'], ['festive', 'Co-ords & Lehenga'],
];
export const RACK = [
  ...LOOKS.filter((l) => !/lehenga/i.test(l.title)).map((l) => ({ cat: 'saree', name: l.title, price: l.price, img: l.img, url: l.url })),
  { cat: 'suit', name: 'Rani Pink Mirror Work Kurta Set', price: 7999, img: CUT('card-rani'), url: CARDS[0].url },
  { cat: 'suit', name: 'Red Silk Suit, Gold Floral', price: 6599, img: CUT('card-red'), url: CARDS[3].url },
  { cat: 'suit', name: 'Royal Blue Mirror Work Suit', price: 6599, img: CUT('card-royal'), url: CARDS[4].url },
  { cat: 'suit', name: 'Teal Blue Embroidered Kurta Set', price: 2799, img: CUT('card-teal'), url: CARDS[8].url },
  { cat: 'suit', name: 'Navy Shibori Kurta Set', price: 6999, img: CUT('mood-navy'), url: SHOP('peach-satin-kurta-set-with-purple-shibori-tie-dye-dupatta-copy') },
  { cat: 'suit', name: 'Peach Satin Mirror Work Kurta', price: 6299, img: CUT('mood-peach'), url: SHOP('pink-shibori-tie-dye-kurta-with-heavy-mirror-work-copy-1') },
  { cat: 'suit', name: 'White Lotus Print Kurta Set', price: 6599, img: CUT('mood-lotus'), url: SHOP('beige-embroidered-kurta-with-red-bandhani-palazzo-copy') },
  { cat: 'anarkali', name: 'Ivory Sequin Anarkali Set', price: 5599, img: CUT('mood-ivory'), url: SHOP('beige-gota-patti-mirror-work-kurta-pant-set-with-dupatta-copy') },
  { cat: 'anarkali', name: 'Blue Layered Anarkali Set', price: 5599, img: CUT('card-blueanarkali'), url: CARDS[9].url },
  { cat: 'anarkali', name: 'Yellow 3-Piece Anarkali Set', price: 2999, img: CUT('card-yellow'), url: CARDS[11].url },
  { cat: 'kaftan', name: 'Gold Striped Rabari Kaftan', price: 6999, img: CUT('mood-kaftan'), url: SHOP('royal-blue-satin-kaftan-with-gold-zardozi-embroidery-copy') },
  { cat: 'kaftan', name: 'Royal Blue Zardozi Kaftan', price: 5599, img: CUT('mood-bluekaftan'), url: SHOP('orange-shaded-suit-with-sequin-embellished-neckline-copy') },
  { cat: 'festive', name: 'Shimmer Gold Co-ord Set', price: 7999, img: CUT('card-gold'), url: CARDS[10].url },
  { cat: 'festive', name: 'Orange Mirror Lehenga Set', price: 11999, img: CUT('look-lehenga'), url: SHOP('orange-mirror-embellished-lehenga-set') },
  { cat: 'suit', name: 'Mustard Yellow Kurta Set', price: 2799, img: CUT('card-mustard'), url: CARDS[1].url },
  { cat: 'suit', name: 'Peacock Green Palazzo Set', price: 2799, img: CUT('card-peacock'), url: CARDS[2].url },
  { cat: 'suit', name: 'Orange Shaded Sequin Suit', price: 5999, img: CUT('card-orange'), url: CARDS[5].url },
  { cat: 'suit', name: 'Violet 3-Piece Hand Work Set', price: 5999, img: CUT('card-violet'), url: CARDS[6].url },
];

// Draped in devotion: ten product cards.
export const MUSE = [
  { name: 'Noir Zari',        kind: 'Silk handloom',   desc: 'Black body, antique-gold zari checks.',  price: 7999,  img: A('women-silk-handloom-saree-black-1.jpg'),  url: SHOP('women-silk-handloom-saree-black') },
  { name: 'Midnight Violet',  kind: 'Silk handloom',   desc: 'Violet body with a magenta pallu.',     price: 4480,  img: A('women-silk-handloom-saree-voilet-1.jpg'), url: SHOP('women-silk-handloom-saree-voilet') },
  { name: 'Olive Grove',      kind: 'Silk handloom',   desc: 'Olive green with a woven zari pallu.',   price: 3999,  img: A('women-silk-handloom-saree-olive-1.jpg'),  url: SHOP('women-silk-handloom-saree-olive') },
  { name: 'Sindoor Tussar',   kind: 'Tussar handloom', desc: 'Orange tussar, striped red pallu.',      price: 7199,  img: A('orange-tussar-handloom-saree-1.jpg'),     url: SHOP('orange-tussar-handloom-saree') },
  { name: 'Teal Tussar',      kind: 'Tussar handloom', desc: 'Teal tussar for evening light.',         price: 7199,  img: A('teal-tussar-handloom-saree-1.jpg'),       url: SHOP('teal-tussar-handloom-saree') },
  { name: 'Grey Monsoon',     kind: 'Tussar handloom', desc: 'Grey body with a wine pallu.',           price: 7199,  img: A('grey-tussar-handloom-saree-1.jpg'),       url: SHOP('grey-tussar-handloom-saree') },
  { name: 'Tussar Dawn',      kind: 'Handwoven tussar',desc: 'Beige tussar with red stripes.',         price: 5599,  img: A('beige-handwoven-tussar-silk-saree-1.jpg'), url: SHOP('beige-handwoven-tussar-silk-saree') },
  { name: 'Ivory Tussar',     kind: 'Tussar handloom', desc: 'Soft beige tussar, easy drape.',         price: 7199,  img: A('beige-tussar-handloom-saree-1.jpg'),      url: SHOP('beige-tussar-handloom-saree') },
  { name: 'Red Silk Floral',  kind: 'Silk suit',       desc: 'Gold floral embroidery and dupatta.',    price: 6599,  img: A('red-silk-suit-with-gold-floral-embroider-1.jpg'), url: CARDS[3].url },
  { name: 'Mirror Lehenga',   kind: 'Lehenga set',     desc: 'Orange flare with mirror work.',         price: 11999, img: A('orange-mirror-embellished-lehenga-set-1.jpg'), url: SHOP('orange-mirror-embellished-lehenga-set') },
];

// Feel the drape.
export const DRAPE = {
  left: [A('orange-embroidered-blouse-with-draped-sk-2.jpg'), A('women-silk-handloom-saree-olive-1.jpg'), A('teal-tussar-handloom-saree-2.jpg')],
  right: [A('women-silk-handloom-saree-black-2.jpg'), A('grey-tussar-handloom-saree-1.jpg'), A('women-silk-handloom-saree-voilet-2.jpg'), A('beige-tussar-handloom-saree-2.jpg')],
  slides: [
    { src: A('drape-handloom.jpg'), pos: '40% 40%' },
    { src: A('hero-showroom.jpg'), pos: '50% 60%' },
    { src: A('drape-chikankari.jpg'), pos: '45% 40%' },
    { src: A('hero-heritage.jpg'), pos: '40% 50%' },
  ],
  // The NOOLAM "One Thread" film (made in ../noolam-film). Set to null to fall back to the slideshow.
  video: A('noolam-film.mp4'),
  poster: A('noolam-film-poster.jpg'),
};

// Silk, in motion.
export const REELS = [
  { no: '01', title: 'Noir Zari',       sub: 'Antique gold, after dark',   place: 'Lamp room, Kanchipuram', kind: 'SILK HANDLOOM',   price: 7999, img: A('women-silk-handloom-saree-black-1.jpg'), tint: '#2a1d14', url: SHOP('women-silk-handloom-saree-black') },
  { no: '02', title: 'Sindoor Tussar',  sub: 'Striped pallu in daylight',  place: 'The courtyard',         kind: 'TUSSAR HANDLOOM', price: 7199, img: A('orange-tussar-handloom-saree-1.jpg'),    tint: '#6e2412', url: SHOP('orange-tussar-handloom-saree') },
  { no: '03', title: 'Grey Monsoon',    sub: 'Wine pallu, piano room',     place: 'Music room',            kind: 'TUSSAR HANDLOOM', price: 7199, img: A('grey-tussar-handloom-saree-1.jpg'),      tint: '#2b2d33', url: SHOP('grey-tussar-handloom-saree') },
  { no: '04', title: 'Midnight Violet', sub: 'Magenta pallu, temple door', place: 'Temple door',           kind: 'SILK HANDLOOM',   price: 4480, img: A('women-silk-handloom-saree-voilet-1.jpg'), tint: '#24154f', url: SHOP('women-silk-handloom-saree-voilet') },
  { no: '05', title: 'Teal Tussar',     sub: 'An easy evening drape',      place: 'Music room',            kind: 'TUSSAR HANDLOOM', price: 7199, img: A('teal-tussar-handloom-saree-1.jpg'),      tint: '#0b3c41', url: SHOP('teal-tussar-handloom-saree') },
  { no: '06', title: 'Olive Grove',     sub: 'Green silk, gold pallu',     place: 'Temple door',           kind: 'SILK HANDLOOM',   price: 3999, img: A('women-silk-handloom-saree-olive-1.jpg'), tint: '#2f3a10', url: SHOP('women-silk-handloom-saree-olive') },
  { no: '07', title: 'Mirror Lehenga',  sub: 'The flare, in motion',       place: 'The haveli',            kind: 'LEHENGA SET',     price: 11999, img: A('orange-mirror-embellished-lehenga-set-1.jpg'), tint: '#6b1d0e', url: SHOP('orange-mirror-embellished-lehenga-set') },
  { no: '08', title: 'Navy Shibori',    sub: 'Festive edit',               place: 'Marigold market',       kind: 'SUIT SET',        price: 6999, img: A('navy-blue-embroidered-kurta-set-with-shi-1.jpg'), tint: '#0e2557', url: SHOP('peach-satin-kurta-set-with-purple-shibori-tie-dye-dupatta-copy') },
];

// The Bridal Collection.
export const BRIDAL = [
  { name: 'Mirror Lehenga',   sub: 'Orange flare, mirror work',     price: 11999, img: A('orange-mirror-embellished-lehenga-set-1.jpg'), url: SHOP('orange-mirror-embellished-lehenga-set') },
  { name: 'Rust Drape',       sub: 'Embroidered blouse, draped skirt', price: 6599, img: A('orange-embroidered-blouse-with-draped-sk-1.jpg'), url: SHOP('rust-embroidered-kurta-pant-set-with-dupatta-copy') },
  { name: 'Red Silk Floral',  sub: 'Gold floral embroidery',        price: 6599,  img: A('red-silk-suit-with-gold-floral-embroider-1.jpg'), url: CARDS[3].url },
  { name: 'Noir Zari',        sub: 'Black and antique gold',        price: 7999,  img: A('women-silk-handloom-saree-black-2.jpg'), url: SHOP('women-silk-handloom-saree-black') },
  { name: 'Ivory Anarkali',   sub: 'Sequin embroidery, dupatta',    price: 5599,  img: A('ivory-sequin-embroidered-anarkali-suit-s-1.jpg'), url: SHOP('beige-gota-patti-mirror-work-kurta-pant-set-with-dupatta-copy') },
  { name: 'Rani Mirror',      sub: 'Mirror work, zari pants',       price: 7999,  img: A('rani-pink-mirror-work-kurta-with-zari-pr-1.jpg'), url: CARDS[0].url },
  { name: 'Shimmer Gold',     sub: 'Zari co-ord set',               price: 7999,  img: A('shimmer-gold-co-ord-set-with-zari-embroi-1.jpg'), url: CARDS[10].url },
];

// Three silks, one weave.
export const WEAVE = [
  { name: 'Noir Zari Silk',   tex: A('fabric-black-gold.jpg'), sw: A('swatch-black-gold.jpg'), price: 7999 },
  { name: 'Sindoor Tussar',   tex: A('fabric-orange.jpg'),     sw: A('swatch-orange.jpg'),     price: 7199 },
  { name: 'Midnight Violet',  tex: A('fabric-violet.jpg'),     sw: A('swatch-violet.jpg'),     price: 4480 },
  { name: 'Olive Grove',      tex: A('fabric-olive.jpg'),      sw: A('swatch-olive.jpg'),      price: 3999 },
  { name: 'Tussar Dawn',      tex: A('fabric-beige.jpg'),      sw: A('swatch-beige.jpg'),      price: 5599 },
  { name: 'Grey Monsoon',     tex: A('fabric-grey.jpg'),       sw: A('swatch-grey.jpg'),       price: 7199 },
  { name: 'Rani Mirror',      tex: A('fabric-rani.jpg'),       sw: A('swatch-rani.jpg'),       price: 7999 },
  { name: 'Mustard Gold',     tex: A('fabric-mustard.jpg'),    sw: A('swatch-mustard.jpg'),    price: 2799 },
  { name: 'Royal Mirror',     tex: A('fabric-royal.jpg'),      sw: A('swatch-royal.jpg'),      price: 6599 },
  { name: 'Teal Thread',      tex: A('fabric-teal.jpg'),       sw: A('swatch-teal.jpg'),       price: 2799 },
];
export const WEAVE_DISCOUNT = 0.1;

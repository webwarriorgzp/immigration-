// All content lives here. To use real assets, add an `img` (transparent PNG
// cut-out) or `video` path to any item; placeholders are drawn only when
// those fields are missing.

export const SILKS = {
  maroon:  { name: 'Murshidabad Maroon', base: '#6d0f22', border: '#c9a24a', motif: '#e2bf6a' },
  magenta: { name: 'Magenta Shot Silk',  base: '#b3125f', border: '#e7c35a', motif: '#ffd6e8' },
  teal:    { name: 'Monsoon Teal',       base: '#0f5c63', border: '#d4ad52', motif: '#9ee0d8' },
  sindoor: { name: 'Sindoor',            base: '#d1301f', border: '#f0c75e', motif: '#ffe1a8' },
  koorai:  { name: 'Koorai Check',       base: '#a8323e', border: '#2c6b3a', motif: '#f3d58a', check: true },
  mango:   { name: 'Mango Yellow',       base: '#e2a417', border: '#7a1426', motif: '#7a1426' },
  peacock: { name: 'Peacock Blue',       base: '#173d8c', border: '#d8b24f', motif: '#6fd0c4' },
  ivory:   { name: 'Temple Ivory',       base: '#efe3c8', border: '#a3122f', motif: '#c9a24a' },
  parrot:  { name: 'Parrot Green',       base: '#3d8a2a', border: '#c2185b', motif: '#f2d06b' },
};

export const LOOKS = [
  { id: 'meera',   name: 'Meera',   silk: 'maroon',  pieces: [['Murshidabad Maroon saree', 18400], ['Zari-edge blouse', 3200], ['Temple jhumkas', 2600]] },
  { id: 'kaveri',  name: 'Kaveri',  silk: 'teal',    pieces: [['Monsoon Teal saree', 21500], ['Elbow-sleeve blouse', 3600], ['Kemp choker', 4800]] },
  { id: 'tara',    name: 'Tara',    silk: 'magenta', pieces: [['Magenta Shot Silk saree', 16900], ['Contrast gold blouse', 2900]] },
  { id: 'anjali',  name: 'Anjali',  silk: 'mango',   pieces: [['Mango Yellow half saree', 12800], ['Pattu pavadai', 6400], ['Kasu mala', 5200]] },
  { id: 'devi',    name: 'Devi',    silk: 'sindoor', pieces: [['Sindoor bridal saree', 46000], ['Full-sleeve blouse', 4900], ['Vaddanam belt', 7800]] },
  { id: 'nila',    name: 'Nila',    silk: 'peacock', pieces: [['Peacock Blue saree', 23900], ['Boat-neck blouse', 3400]] },
  { id: 'gowri',   name: 'Gowri',   silk: 'ivory',   pieces: [['Temple Ivory saree', 19800], ['Maroon blouse', 3100], ['Jasmine veni', 300]] },
  { id: 'lakshmi', name: 'Lakshmi', silk: 'koorai',  pieces: [['Koorai Check saree', 27500], ['Green contrast blouse', 3300]] },
];

export const CARDS = [
  { silk: 'koorai',  word: 'KOORAI',  price: 27500, bg: '#f6d9c4' },
  { silk: 'maroon',  word: 'MAROON',  price: 18400, bg: '#f3c6cf' },
  { silk: 'teal',    word: 'MONSOON', price: 21500, bg: '#bfe6e2' },
  { silk: 'sindoor', word: 'SINDOOR', price: 24200, bg: '#ffd2b8' },
  { silk: 'magenta', word: 'SHOT',    price: 16900, bg: '#f7c3dc' },
  { silk: 'peacock', word: 'PEACOCK', price: 23900, bg: '#c7d3f4' },
];

export const RACK_FILTERS = [
  ['all', 'All pieces'], ['saree', 'Silk Sarees'], ['half', 'Half Sarees'],
  ['blouse', 'Full-Sleeve Blouses'], ['dupatta', 'Dupattas'],
];

export const RACK = [
  { cat: 'saree',   silk: 'maroon',  name: 'Maroon Korvai',      price: 18400 },
  { cat: 'saree',   silk: 'teal',    name: 'Monsoon Teal',       price: 21500 },
  { cat: 'half',    silk: 'mango',   name: 'Mango Half Saree',   price: 12800 },
  { cat: 'blouse',  silk: 'magenta', name: 'Magenta Blouse',     price: 3600 },
  { cat: 'saree',   silk: 'peacock', name: 'Peacock Butta',      price: 23900 },
  { cat: 'dupatta', silk: 'ivory',   name: 'Ivory Dupatta',      price: 5400 },
  { cat: 'half',    silk: 'parrot',  name: 'Parrot Half Saree',  price: 11900 },
  { cat: 'blouse',  silk: 'sindoor', name: 'Sindoor Blouse',     price: 3900 },
  { cat: 'saree',   silk: 'koorai',  name: 'Koorai Check',       price: 27500 },
  { cat: 'dupatta', silk: 'magenta', name: 'Rani Dupatta',       price: 4800 },
  { cat: 'blouse',  silk: 'teal',    name: 'Teal Brocade Blouse',price: 4200 },
  { cat: 'half',    silk: 'sindoor', name: 'Sindoor Half Saree', price: 13600 },
];

export const REELS = [
  { title: 'The pallu reveal',     silk: 'magenta', tint: '#7a0d3f' },
  { title: 'Loom to light',        silk: 'maroon',  tint: '#4a0a17' },
  { title: 'Monsoon drape',        silk: 'teal',    tint: '#0b3c41' },
  { title: 'Bride, 6am',           silk: 'sindoor', tint: '#7d1a10' },
  { title: 'Checks, two ways',     silk: 'koorai',  tint: '#5a1a20' },
  { title: 'Peacock in the temple',silk: 'peacock', tint: '#0e2557' },
];

export const BRIDAL = [
  { name: 'Muhurtham Red',  silk: 'sindoor' },
  { name: 'Kalyana Maroon', silk: 'maroon' },
  { name: 'Mangalam Gold',  silk: 'mango' },
  { name: 'Ivory Temple',   silk: 'ivory' },
  { name: 'Rani Pink',      silk: 'magenta' },
];

export const WEAVE = ['maroon', 'magenta', 'mango'];

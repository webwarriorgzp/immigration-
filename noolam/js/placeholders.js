// Procedural stand-ins for the AI assets: silk textures, model cut-outs and
// garments on hangers. Each returns something that can be replaced 1:1 by a
// real image (a data URL / SVG string in the same slot).
import { SILKS } from './data.js';

const cache = new Map();

/** Seamless-ish silk texture: body colour, sheen, butta motifs, zari border. */
export function silkTexture(key, { w = 512, h = 512, border = true } = {}) {
  const id = `${key}:${w}:${h}:${border}`;
  if (cache.has(id)) return cache.get(id);
  const s = SILKS[key];
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const g = c.getContext('2d');

  g.fillStyle = s.base;
  g.fillRect(0, 0, w, h);

  if (s.check) {
    g.strokeStyle = s.border; g.globalAlpha = 0.55;
    for (let x = 0; x < w; x += 48) { g.lineWidth = 6; g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
    for (let y = 0; y < h; y += 48) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
    g.globalAlpha = 1;
  }

  // Silk sheen: soft diagonal light bands.
  const sheen = g.createLinearGradient(0, 0, w, h);
  sheen.addColorStop(0, 'rgba(255,255,255,0)');
  sheen.addColorStop(0.35, 'rgba(255,255,255,0.18)');
  sheen.addColorStop(0.5, 'rgba(0,0,0,0.12)');
  sheen.addColorStop(0.7, 'rgba(255,255,255,0.14)');
  sheen.addColorStop(1, 'rgba(0,0,0,0.1)');
  g.fillStyle = sheen; g.fillRect(0, 0, w, h);

  // Butta motifs (small paisley-ish dots).
  g.fillStyle = s.motif;
  for (let y = 24; y < h; y += 44) {
    for (let x = (y / 44) % 2 ? 46 : 24; x < w; x += 44) {
      g.globalAlpha = 0.75;
      g.beginPath(); g.ellipse(x, y, 3.5, 6, 0.6, 0, Math.PI * 2); g.fill();
      g.beginPath(); g.arc(x + 3, y - 5, 2, 0, Math.PI * 2); g.fill();
    }
  }
  g.globalAlpha = 1;

  if (border) {
    const bh = Math.round(h * 0.16);
    for (const y0 of [0, h - bh]) {
      g.fillStyle = s.border; g.fillRect(0, y0, w, bh);
      g.fillStyle = 'rgba(0,0,0,0.18)';
      g.fillRect(0, y0 + bh * 0.12, w, 2); g.fillRect(0, y0 + bh * 0.86, w, 2);
      // Temple-tower (gopuram) triangles, the classic Kanchi border.
      g.fillStyle = s.base;
      const tri = bh * 0.5, top = y0 === 0;
      for (let x = 0; x < w; x += tri) {
        g.beginPath();
        const yb = top ? y0 + bh : y0, yt = top ? y0 + bh - tri * 0.9 : y0 + tri * 0.9;
        g.moveTo(x, yb); g.lineTo(x + tri / 2, yt); g.lineTo(x + tri, yb); g.fill();
      }
    }
  }
  cache.set(id, c);
  return c;
}

export const silkURL = (key, opts) => silkTexture(key, opts).toDataURL('image/jpeg', 0.85);

/** Model silhouette in a draped saree, as an inline SVG string. */
export function modelSVG(key, seed = 0) {
  const s = SILKS[key];
  const skin = ['#8a5a3c', '#a46d47', '#7a4c31', '#b57e55'][seed % 4];
  const hair = '#1d1310';
  const tilt = [-3, 2, -1, 3, 0, -2, 1, -3][seed % 8];
  const uid = `m${seed}${key}`;
  return `<svg viewBox="0 0 200 520" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Model in ${s.name} saree">
  <defs>
    <linearGradient id="${uid}" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="${s.base}"/><stop offset=".45" stop-color="${shade(s.base, 30)}"/><stop offset="1" stop-color="${shade(s.base, -30)}"/>
    </linearGradient>
  </defs>
  <g transform="rotate(${tilt} 100 260)">
    <ellipse cx="100" cy="512" rx="62" ry="7" fill="rgba(0,0,0,.12)"/>
    <path d="M86 40 q14 -26 30 -4 q8 14 -2 30 q16 8 10 26 q-24 6 -44 -4 q-8 -24 6 -48z" fill="${hair}"/>
    <ellipse cx="100" cy="58" rx="19" ry="23" fill="${skin}"/>
    <circle cx="100" cy="50" r="2.2" fill="#b3121f"/>
    <rect x="93" y="78" width="14" height="14" fill="${skin}"/>
    <path d="M66 98 q34 -14 68 0 l6 46 q-40 10 -80 0z" fill="${shade(s.border, -10)}"/>
    <path d="M60 104 q-12 60 -6 110 l12 0 q2 -50 12 -100z" fill="${skin}"/>
    <path d="M140 104 q14 50 10 108 l-12 0 q-2 -48 -12 -96z" fill="${skin}"/>
    <path d="M62 140 q38 14 76 0 l18 360 q-56 14 -112 0z" fill="url(#${uid})"/>
    <path d="M58 96 q50 10 84 64 l22 340 l-30 4 q-10 -200 -76 -408z" fill="${shade(s.base, 18)}" opacity=".9"/>
    <path d="M44 494 q56 14 112 0 l2 10 q-58 14 -116 0z" fill="${s.border}"/>
    <path d="M134 500 l-24 -340 l8 -2 l26 342z" fill="${s.border}"/>
    <path d="M78 118 q22 6 40 2" stroke="${s.motif}" stroke-width="3" fill="none"/>
  </g>
</svg>`;
}

/** Garment on a hanger (saree fold, half saree, blouse or dupatta). */
export function garmentSVG(cat, key) {
  const s = SILKS[key];
  const hook = `<path d="M100 4 q12 0 12 12 q0 10 -12 14 l0 10" stroke="#8c7b6a" stroke-width="3" fill="none"/>
    <path d="M40 58 L100 40 L160 58" stroke="#8c7b6a" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  const fill = `url(#g${cat}${key})`;
  let body;
  if (cat === 'blouse') {
    body = `<path d="M62 56 l38 -8 l38 8 l40 26 l-6 92 l-22 -2 l-4 -60 l-6 70 l-80 0 l-6 -70 l-4 60 l-22 2 l-6 -92z" fill="${fill}"/>
      <path d="M86 50 q14 18 28 0" stroke="${s.border}" stroke-width="5" fill="none"/>
      <rect x="54" y="168" width="22" height="7" fill="${s.border}"/><rect x="124" y="168" width="22" height="7" fill="${s.border}"/>`;
  } else if (cat === 'dupatta') {
    body = `<path d="M70 56 l60 0 l8 230 l-76 0z" fill="${fill}"/>
      <rect x="62" y="270" width="76" height="16" fill="${s.border}"/>
      <path d="M62 286 l0 14 M72 286 l0 14 M82 286 l0 14 M92 286 l0 14 M102 286 l0 14 M112 286 l0 14 M122 286 l0 14 M132 286 l0 14" stroke="${s.border}" stroke-width="2"/>`;
  } else if (cat === 'half') {
    body = `<path d="M60 56 l80 0 l4 70 l-88 0z" fill="${shade(s.border, -20)}"/>
      <path d="M50 126 l100 0 l24 170 l-148 0z" fill="${fill}"/>
      <rect x="26" y="280" width="148" height="16" fill="${s.border}"/>`;
  } else {
    body = `<path d="M46 58 l108 0 l-2 236 l-104 0z" fill="${fill}"/>
      <rect x="48" y="58" width="12" height="236" fill="${s.border}"/><rect x="140" y="58" width="12" height="236" fill="${s.border}"/>
      <path d="M46 250 l108 0 l-2 44 l-104 0z" fill="${shade(s.base, -18)}"/>`;
  }
  return `<svg viewBox="0 0 200 ${cat === 'blouse' ? 190 : 310}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs><linearGradient id="g${cat}${key}" x1="0" x2="1"><stop offset="0" stop-color="${shade(s.base, -18)}"/><stop offset=".5" stop-color="${shade(s.base, 22)}"/><stop offset="1" stop-color="${shade(s.base, -24)}"/></linearGradient></defs>
  ${body}${hook}</svg>`;
}

export function shade(hex, pct) {
  const n = parseInt(hex.slice(1), 16);
  const f = (v) => Math.max(0, Math.min(255, Math.round(v + (pct / 100) * (pct > 0 ? 255 - v : v))));
  const r = f(n >> 16), g = f((n >> 8) & 255), b = f(n & 255);
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

export const inr = (n) => '₹ ' + n.toLocaleString('en-IN');

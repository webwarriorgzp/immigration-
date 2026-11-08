import { SILKS, HERO, LOOKS, CARDS, RACK, RACK_FILTERS, DRAPE, REELS, BRIDAL, WEAVE } from './data.js';
import { silkTexture, silkURL, modelSVG, garmentSVG, shade, inr } from './placeholders.js';
import { initWeave } from './weave.js';

const { gsap, ScrollTrigger, Lenis } = window;
gsap.registerPlugin(ScrollTrigger);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s, el = document) => el.querySelector(s);
const h = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };

// Real asset if provided, otherwise the procedural placeholder.
const figure = (item, seed) => item.img ? `<img src="${item.img}" alt="${item.name || ''}" loading="lazy">` : modelSVG(item.silk, seed);

/* ---------------- Smooth scroll (Lenis -> ScrollTrigger) ---------------- */
let lenis = null;
if (!reduced && Lenis) {
  lenis = new Lenis({ lerp: 0.1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  document.querySelectorAll('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target, { offset: 0 });
  }));
}

/* ---------------- Nav ---------------- */
const nav = $('#nav');
$('.nav-toggle').addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  $('.nav-toggle').setAttribute('aria-expanded', open);
});
nav.querySelectorAll('.nav-links a').forEach((a) => a.addEventListener('click', () => nav.classList.remove('open')));
function setActive(id) {
  nav.querySelectorAll('[data-nav]').forEach((a) => a.classList.toggle('active', a.dataset.nav === id));
}
setActive('home');

/* ---------------- 1. Hero ---------------- */
(function hero() {
  const heroEl = $('.hero');
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: '.hero', start: 'top top', end: '+=140%', scrub: 0.6, pin: true, invalidateOnRefresh: true },
  });

  if (HERO.img) {
    // Photo mode: start inside the fabric, pull back until the full look sits in an arch.
    heroEl.classList.add('has-photo');
    const photo = h(`<figure class="hero-photo"><img src="${HERO.img}" alt="Model in a handloom silk saree"></figure>`);
    const img = photo.querySelector('img');
    img.style.objectPosition = HERO.focus;
    img.style.transformOrigin = HERO.focus;
    $('.hero-stage').insertBefore(photo, $('.hero-copy'));
    const desktop = matchMedia('(min-width: 801px)').matches;
    tl.fromTo(img, { scale: 2.8 }, { scale: 1, duration: 1 }, 0);
    if (desktop) {
      const vw = (n) => () => innerWidth * n / 100, vh = (n) => () => innerHeight * n / 100;
      tl.fromTo(photo,
        { top: 0, right: 0, bottom: 0, width: () => innerWidth, borderRadius: '0px 0px 0px 0px' },
        { top: vh(12), right: vw(6), bottom: vh(6), width: () => Math.min(innerWidth * 0.38, innerHeight * 0.52), borderRadius: '999px 999px 24px 24px', duration: 0.9, ease: 'power1.inOut' }, 0);
    } else {
      tl.fromTo(photo, { '--shade': 0 }, { '--shade': 1, duration: 0.6 }, 0.4);
    }
    tl.fromTo('.hero-showroom', { scale: 1.3 }, { scale: 1, duration: 1 }, 0)
      .from('.hero-copy > *', { y: 40, opacity: 0, stagger: 0.06, duration: 0.3 }, 0.6)
      .to('.scroll-hint', { opacity: 0, duration: 0.15 }, 0);
    return;
  }

  const shelves = $('.showroom-shelves');
  const keys = Object.keys(SILKS);
  const cols = innerWidth < 700 ? 8 : 14;
  shelves.style.setProperty('--cols', cols);
  for (let i = 0; i < cols; i++) {
    const k = keys[(i * 5) % keys.length];
    const el = document.createElement('i');
    el.style.setProperty('--h', `${48 + ((i * 37) % 30)}%`);
    el.style.backgroundImage = `url(${silkURL(k, { w: 128, h: 256 })})`;
    shelves.appendChild(el);
  }
  const silk = $('.hero-silk');
  silk.style.backgroundImage = `url(${silkURL('maroon', { w: 512, h: 512 })})`;
  tl.fromTo(silk, { clipPath: 'inset(0% 0% 0% 0% round 0px)', backgroundSize: '1100px' },
               { clipPath: 'inset(24% 43% 12% 43% round 18px)', backgroundSize: '160px', duration: 1 }, 0)
    .to(silk, { opacity: 0, duration: 0.3 }, 0.5)
    .fromTo('.hero-showroom', { scale: 1.45 }, { scale: 1, duration: 1 }, 0)
    .from('.hero-copy > *', { y: 40, opacity: 0, stagger: 0.06, duration: 0.3 }, 0.62)
    .to('.scroll-hint', { opacity: 0, duration: 0.15 }, 0);
})();

/* ---------------- 2. Try the Look ---------------- */
(function look() {
  const lineup = $('#lineup');
  const panel = $('#look-panel');
  LOOKS.forEach((l, i) => {
    const el = h(`<button class="model" role="option" aria-selected="false" data-i="${i}" aria-label="${l.name}, ${SILKS[l.silk].name}">
      ${figure(l, i)}<span class="model-name">${l.name}</span></button>`);
    lineup.appendChild(el);
  });
  const models = [...lineup.children];
  const photoMode = LOOKS.every((l) => l.img);
  // Photo mode: an accordion of tall slices; the chosen look opens to full width.
  if (photoMode) lineup.classList.add('photo');

  function show(i) {
    models.forEach((m, j) => { m.classList.toggle('active', i === j); m.setAttribute('aria-selected', i === j); });
    lineup.classList.add('has-focus');
    const l = LOOKS[i], s = SILKS[l.silk];
    const total = l.pieces.reduce((a, [, p]) => a + p, 0);
    panel.innerHTML = `${l.thumb ? `<img class="look-thumb" src="${l.thumb}" alt="${l.name}, detail">` : ''}
      <p class="eyebrow">Look ${String(i + 1).padStart(2, '0')}</p>
      <h3>${l.name}</h3>
      <p class="silk-tag"><span class="dot" style="background:${s.base}"></span>${s.name}</p>
      <ul>${l.pieces.map(([n, p]) => `<li><span>${n}</span><b>${inr(p)}</b></li>`).join('')}</ul>
      ${l.pieces.length > 1 ? `<p class="total"><span>Complete look</span><span>${inr(total)}</span></p>` : ''}
      <a href="${l.url || '#footer'}" class="btn" ${l.url ? 'target="_blank" rel="noopener"' : ''}>Shop the look</a>`;
    gsap.fromTo(panel.children, { y: 12, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.04, duration: 0.35, overwrite: true });
  }
  panel.innerHTML = `<p class="eyebrow">Shop the look</p><h3>Pick a muse</h3><p class="hint">Hover or tap any model to see every piece she's wearing, with prices.</p>`;
  if (photoMode) show(0), lineup.classList.remove('has-focus');

  models.forEach((m, i) => {
    m.addEventListener('mouseenter', () => show(i));
    m.addEventListener('focus', () => show(i));
    m.addEventListener('click', () => show(i));
  });
  // On pointer devices, releasing the lineup un-blurs everyone (panel keeps the last look).
  lineup.addEventListener('mouseleave', () => lineup.classList.remove('has-focus'));

  gsap.from(models.map((m) => m.firstElementChild), { y: 80, opacity: 0, stagger: 0.05, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: lineup, start: 'top 80%' } });
})();

/* ---------------- 3. Pick a Silk ---------------- */
(function silks() {
  const track = $('#silk-track');
  CARDS.forEach((c, i) => {
    const s = SILKS[c.silk];
    track.appendChild(h(`<article class="silk-card" style="background:${c.bg}">
      <div class="word" style="color:${shade(s.base, -10)}">${c.word}</div>
      <div class="figure${c.img ? ' photo' : ''}">${figure({ ...c, name: c.title }, i + 2)}</div>
      <div class="meta"><div><small>${c.title || s.name}</small><strong>${inr(c.price)}</strong></div>
      <button class="plus" aria-label="Add ${s.name} to bag">+</button></div></article>`));
  });
  track.addEventListener('click', (e) => { const b = e.target.closest('.plus'); if (b) b.classList.toggle('added'); });

  const cards = [...track.children];
  const distance = () => Math.max(0, track.scrollWidth - innerWidth);
  const tween = gsap.to(track, {
    x: () => -distance(), ease: 'none',
    scrollTrigger: { trigger: '.silks', start: 'top top', end: () => '+=' + distance(), scrub: 0.6, pin: '.silks-pin', invalidateOnRefresh: true },
  });
  // Per-card tilt + bob while the track moves.
  cards.forEach((card, i) => {
    gsap.fromTo(card, { rotate: i % 2 ? 4 : -4, y: i % 2 ? 30 : -10 }, {
      rotate: i % 2 ? -3 : 3, y: i % 2 ? -10 : 20, ease: 'none',
      scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true },
    });
  });
})();

/* ---------------- 4. The Rack ---------------- */
const HANGER = `<svg class="hanger" viewBox="0 0 200 60" aria-hidden="true"><path d="M100 4 q12 0 12 12 q0 10 -12 14 l0 10" stroke="#8c7b6a" stroke-width="3" fill="none"/><path d="M30 58 L100 38 L170 58" stroke="#8c7b6a" stroke-width="4" fill="none" stroke-linecap="round"/></svg>`;
(function rack() {
  const chips = $('#chips');
  const list = $('#rail-items');
  let current = 'all', busy = false;

  RACK_FILTERS.forEach(([id, label]) => chips.appendChild(
    h(`<button class="chip" role="tab" data-f="${id}" aria-selected="${id === 'all'}">${label}</button>`)));

  const render = (f) => {
    list.innerHTML = '';
    RACK.filter((r) => f === 'all' || r.cat === f).forEach((r, i) => {
      const li = h(`<li class="garment${r.img ? ' photo' : ''}">${r.img ? `${HANGER}<img src="${r.img}" alt="${r.name}" loading="lazy">` : garmentSVG(r.cat, r.silk)}
        <p class="tag">${r.name}<b>${inr(r.price)}</b></p></li>`);
      list.appendChild(li);
      if (reduced) return;
      li.animate([{ opacity: 0, transform: 'translateX(60px) rotate(10deg)', filter: 'blur(8px)' },
                  { opacity: 1, transform: 'translateX(0) rotate(0)', filter: 'blur(0)' }],
                 { duration: 520, delay: i * 60, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'backwards' })
        .finished.then(() => { li.classList.add('swing'); li.addEventListener('animationend', () => li.classList.remove('swing'), { once: true }); });
    });
  };

  chips.addEventListener('click', async (e) => {
    const b = e.target.closest('.chip');
    if (!b || b.dataset.f === current || busy) return;
    busy = true;
    current = b.dataset.f;
    chips.querySelectorAll('.chip').forEach((c) => c.setAttribute('aria-selected', c === b));
    if (!reduced) {
      await Promise.all([...list.children].map((li, i) => li.animate(
        [{ opacity: 1, filter: 'blur(0)', transform: 'none' }, { opacity: 0, filter: 'blur(10px)', transform: 'translateY(16px) scale(.96)' }],
        { duration: 280, delay: i * 25, fill: 'forwards', easing: 'ease-in' }).finished));
    }
    render(current);
    busy = false;
    ScrollTrigger.refresh();
  });

  render('all');
})();

/* ---------------- 5. Feel the drape ---------------- */
(function drape() {
  const keys = ['teal', 'magenta', 'ivory', 'sindoor', 'peacock', 'mango', 'koorai', 'maroon'];
  document.querySelectorAll('.tile').forEach((t) => {
    const photo = DRAPE.tiles?.[+t.dataset.tile];
    if (photo) { t.style.backgroundImage = `url(${photo})`; return; }
    const k = keys[+t.dataset.tile];
    t.style.backgroundImage = `url(${silkURL(k, { w: 320, h: 420 })})`;
  });
  if (!reduced) {
    document.querySelectorAll('.drape-col').forEach((col) => {
      const sp = +col.dataset.speed;
      gsap.fromTo(col, { y: -sp }, { y: sp, ease: 'none', scrollTrigger: { trigger: '.drape-grid', start: 'top bottom', end: 'bottom top', scrub: true } });
    });
  }

  // Placeholder "draping" clip: cloth bands rippling down from the shoulder.
  const centre = $('.drape-center');
  if (DRAPE.video) {
    $('#drape-canvas').replaceWith(h(`<video src="${DRAPE.video}" autoplay muted loop playsinline></video>`));
    return;
  }
  if (DRAPE.slides?.length) {
    // Crossfading slideshow with a slow push-in, standing in for the draping clip.
    $('#drape-canvas').replaceWith(h(`<div class="drape-slides">${DRAPE.slides.map((src, i) => `<img src="${src}" alt="" class="${i ? '' : 'on'}" loading="lazy">`).join('')}</div>`));
    const slides = [...centre.querySelectorAll('.drape-slides img')];
    let cur = 0;
    if (!reduced) setInterval(() => { slides[cur].classList.remove('on'); cur = (cur + 1) % slides.length; slides[cur].classList.add('on'); }, 3200);
    return;
  }
  const cv = $('#drape-canvas');
  const g = cv.getContext('2d');
  const tex = silkTexture('magenta', { w: 256, h: 256 });
  let pat, running = false, w = 0, hgt = 0;
  const size = () => {
    const r = cv.getBoundingClientRect(), d = Math.min(devicePixelRatio, 2);
    w = cv.width = Math.round(r.width * d); hgt = cv.height = Math.round(r.height * d);
    pat = g.createPattern(tex, 'repeat');
  };
  const draw = (t) => {
    if (!running) return;
    t /= 1000;
    g.fillStyle = '#f6ebe2'; g.fillRect(0, 0, w, hgt);
    const bands = 7;
    for (let b = 0; b < bands; b++) {
      const x0 = w * (0.18 + b * 0.09);
      g.beginPath();
      g.moveTo(x0, 0);
      for (let y = 0; y <= hgt; y += 8) {
        const k = y / hgt;
        g.lineTo(x0 + Math.sin(k * 6 + t * 1.6 + b * 0.7) * 18 * k * (w / 400) + k * k * w * 0.12 * Math.sin(t * 0.5 + b), y);
      }
      const x1 = x0 + w * 0.11;
      for (let y = hgt; y >= 0; y -= 8) {
        const k = y / hgt;
        g.lineTo(x1 + Math.sin(k * 6 + t * 1.6 + b * 0.7 + 0.5) * 18 * k * (w / 400) + k * k * w * 0.12 * Math.sin(t * 0.5 + b), y);
      }
      g.closePath();
      g.save();
      g.translate(0, (t * 30) % 256);
      g.fillStyle = pat; g.fill();
      g.restore();
      const shadeG = g.createLinearGradient(x0, 0, x1, 0);
      shadeG.addColorStop(0, 'rgba(0,0,0,.28)'); shadeG.addColorStop(0.5, 'rgba(255,255,255,.12)'); shadeG.addColorStop(1, 'rgba(0,0,0,.2)');
      g.fillStyle = shadeG; g.fill();
    }
    requestAnimationFrame(draw);
  };
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !running) { size(); running = true; requestAnimationFrame(draw); }
    else if (!e.isIntersecting) running = false;
  }).observe(cv);
  addEventListener('resize', () => running && size());
})();

/* ---------------- 6. Reels + story viewer ---------------- */
(function reels() {
  const row = $('#reel-row');
  const story = $('#story'), track = $('#story-track'), bg = $('#story-bg');
  const bgFor = (r) => r.img ? `url(${r.img});background-size:auto 112%;background-position:50% 0%` : `url(${silkURL(r.silk, { w: 360, h: 640, border: true })})`;
  REELS.forEach((r, i) => row.appendChild(h(`<button class="reel" data-i="${i}" style="background-image:${bgFor(r)}" aria-label="Play reel: ${r.title}">
    <span class="play">▶</span><span>${r.title}</span></button>`)));

  // Story cards (one per reel). Drop real clips in by adding <video> inside .story-card.
  REELS.forEach((r) => track.appendChild(h(`<div class="story-card" style="background-image:${bgFor(r)}">
    <div class="bar"><i></i></div>
    <div class="head"><span class="avatar">N</span>noolam.silks<button class="mute" aria-label="Mute">🔇</button></div>
    <p class="caption">${r.title}</p></div>`)));
  const cards = [...track.children];
  let idx = 0, lastFocus = null;

  function layout() {
    cards.forEach((c, i) => {
      const d = i - idx, ad = Math.abs(d);
      c.classList.toggle('current', d === 0);
      c.style.zIndex = 10 - ad;
      c.style.opacity = ad > 1 ? 0 : d === 0 ? 1 : 0.55;
      c.style.filter = d === 0 ? 'none' : 'brightness(.7)';
      c.style.pointerEvents = ad > 1 ? 'none' : 'auto';
      c.style.transform = `translateX(${d * 78}%) translateZ(${-ad * 220}px) rotateY(${-d * 28}deg) scale(${d === 0 ? 1 : 0.86})`;
      // restart progress bar
      const bar = c.querySelector('.bar i'); bar.style.animation = 'none'; void bar.offsetWidth; bar.style.animation = '';
      c.getAnimations().forEach((an) => an.cancel());
    });
    bg.style.backgroundColor = REELS[idx].tint;
    cards[idx].animate([{ backgroundPosition: '50% 0%' }, { backgroundPosition: '50% 100%' }], { duration: 6000, fill: 'forwards' });
  }
  const go = (i) => { idx = (i + cards.length) % cards.length; layout(); };
  function open(i) {
    lastFocus = document.activeElement;
    story.hidden = false; lenis?.stop(); document.body.style.overflow = 'hidden';
    go(i);
    gsap.fromTo(track, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: 'power3.out' });
    $('#story-close').focus();
  }
  function close() {
    story.hidden = true; lenis?.start(); document.body.style.overflow = '';
    lastFocus?.focus();
  }
  row.addEventListener('click', (e) => { const r = e.target.closest('.reel'); if (r) open(+r.dataset.i); });
  cards.forEach((c, i) => {
    c.addEventListener('click', (e) => { if (e.target.closest('.mute')) { e.target.textContent = e.target.textContent === '🔇' ? '🔊' : '🔇'; return; } if (i !== idx) go(i); });
    c.querySelector('.bar i').addEventListener('animationend', () => { if (i === idx && !story.hidden) go(idx + 1); });
  });
  $('#story-close').addEventListener('click', close);
  $('#story-prev').addEventListener('click', () => go(idx - 1));
  $('#story-next').addEventListener('click', () => go(idx + 1));
  addEventListener('keydown', (e) => {
    if (story.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') go(idx + 1);
    if (e.key === 'ArrowLeft') go(idx - 1);
  });
  let sx = null;
  track.addEventListener('pointerdown', (e) => { sx = e.clientX; });
  track.addEventListener('pointerup', (e) => { if (sx !== null && Math.abs(e.clientX - sx) > 40) go(idx + (e.clientX < sx ? 1 : -1)); sx = null; });

  gsap.from('.reel', { y: 60, opacity: 0, stagger: 0.07, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: row, start: 'top 85%' } });
})();

/* ---------------- 7. Bridal arches ---------------- */
(function bridal() {
  const wrap = $('#arches');
  BRIDAL.forEach((b, i) => wrap.appendChild(h(b.img
    ? `<figure class="arch photo" style="background-image:url(${b.img})"><span>${b.name}</span></figure>`
    : `<figure class="arch" style="background-image:url(${silkURL(b.silk, { w: 300, h: 460 })})">
    <div class="figure">${figure(b, i + 4)}</div><span>${b.name}</span></figure>`)));
  const arches = [...wrap.children];
  const mid = (arches.length - 1) / 2;
  const spread = () => Math.min(innerWidth * 0.17, 210);
  arches.forEach((a, i) => {
    const d = i - mid;
    a.style.zIndex = 10 - Math.abs(d);
    gsap.fromTo(a, { x: 0, rotate: d * 2, y: 0 }, {
      x: () => d * spread(), rotate: d * 9, y: Math.abs(d) * 26, ease: 'power2.out',
      scrollTrigger: { trigger: wrap, start: 'top 85%', end: 'center 55%', scrub: 0.8, invalidateOnRefresh: true },
    });
  });
})();

/* ---------------- 8. The weave ---------------- */
(function weave() {
  $('#swatches').innerHTML = WEAVE.map((k) => `<i style="background-image:url(${silkURL(k, { w: 128, h: 128 })})" title="${SILKS[k].name}"></i>`).join('');
  const state = { progress: 0 };
  const scene = initWeave($('#weave-canvas'), WEAVE.map((k) => silkTexture(k, { w: 1024, h: 256 })), state);
  gsap.timeline({ scrollTrigger: { trigger: '.weave', start: 'top top', end: '+=200%', scrub: 0.8, pin: '.weave-pin' } })
    .to(state, { progress: 1, ease: 'none', duration: 1 }, 0)
    .to('.weave-copy', { opacity: 0, y: -40, duration: 0.25 }, 0.55)
    .to('#weave-result', { opacity: 1, duration: 0.2 }, 0.8)
    .from('#swatches i', { scale: 0, stagger: 0.03, duration: 0.15 }, 0.8);
  ScrollTrigger.create({ trigger: '.weave', start: 'top bottom', end: 'bottom top', onToggle: (st) => scene?.setActive(st.isActive) });
})();

/* ---------------- Section reveals + nav state ---------------- */
document.querySelectorAll('.section-head').forEach((el) => {
  if (el.closest('.silks, .weave')) return;
  gsap.from(el.children, { y: 30, opacity: 0, stagger: 0.08, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%' } });
});
document.querySelectorAll('[data-section]').forEach((sec) => {
  ScrollTrigger.create({ trigger: sec, start: 'top 50%', end: 'bottom 50%', onToggle: (st) => st.isActive && setActive(sec.dataset.section) });
});
gsap.from('.footer-mark', { yPercent: 40, opacity: 0, ease: 'power2.out', scrollTrigger: { trigger: '.footer', start: 'top 80%', end: 'bottom bottom', scrub: true } });

addEventListener('load', () => ScrollTrigger.refresh());

import { TICKER, HERO, BAND, MOODS, LOOKS, CARDS, RACK, RACK_FILTERS, MUSE, DRAPE, REELS, BRIDAL, WEAVE, WEAVE_DISCOUNT } from './data.js';
import { initWeave } from './weave.js';

const { gsap, ScrollTrigger, Lenis } = window;
gsap.registerPlugin(ScrollTrigger);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const h = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
const inr = (n) => '₹' + Math.round(n).toLocaleString('en-IN');
const icon = (id) => `<svg aria-hidden="true"><use href="#${id}"/></svg>`;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const mobile = () => innerWidth <= 860;
const pad2 = (n) => String(n).padStart(2, '0');
const HANGER = `<svg class="hanger" viewBox="0 0 120 60" aria-hidden="true"><path d="M60 4c7 0 9 6 6 10-2 3-6 4-6 9v5" fill="none" stroke="#9a8a78" stroke-width="3" stroke-linecap="round"/><path d="M60 28 8 52c-4 2-3 6 1 6h102c4 0 5-4 1-6z" fill="none" stroke="#a5743f" stroke-width="5" stroke-linejoin="round"/></svg>`;

/* ---------------- Bag + toast ---------------- */
const bag = { n: 0 };
let toastTimer;
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}
function addToBag(label, qty = 1, quiet = false) {
  bag.n += qty;
  const c = $('#bag-count'); c.textContent = bag.n; c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump');
  $('#cart-count-2').textContent = bag.n;
  if (!quiet) toast(`${label} added to your bag`);
}
const bagMsg = () => toast(bag.n ? `Your bag has ${bag.n} piece${bag.n > 1 ? 's' : ''}` : 'Your bag is empty');

/* ---------------- Smooth scroll ---------------- */
// ?rec turns off Lenis so a frame-by-frame screen capture can set the scroll position exactly.
const REC = new URLSearchParams(location.search).has('rec');
let lenis = null;
if (!reduced && Lenis && !REC) {
  lenis = new Lenis({ lerp: 0.1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
const nav = $('#nav');
const scrollToEl = (el) => (lenis ? lenis.scrollTo(el, { offset: 0 }) : el.scrollIntoView({ behavior: 'smooth' }));
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a || a.closest('.story')) return;
  const id = a.getAttribute('href'); const t = id.length > 1 && document.querySelector(id);
  if (!t) return;
  e.preventDefault(); nav.classList.remove('open'); scrollToEl(t);
});

/* ---------------- Nav ---------------- */
$('.nav-toggle').addEventListener('click', () => { const o = nav.classList.toggle('open'); $('.nav-toggle').setAttribute('aria-expanded', o); });
let lastY = 0;
const onScroll = () => { const y = scrollY; if (y > lastY + 2 && y > 400 && !nav.classList.contains('open')) nav.classList.add('hide'); else if (y < lastY - 2) nav.classList.remove('hide'); lastY = y; };
lenis ? lenis.on('scroll', onScroll) : addEventListener('scroll', onScroll, { passive: true });
const setActive = (id) => $$('[data-nav]').forEach((a) => a.classList.toggle('active', a.dataset.nav === id));
setActive('home');
$('.bag').addEventListener('click', bagMsg);
$('#view-cart').addEventListener('click', bagMsg);

/* ---------------- Ticker ---------------- */
{
  const tk = TICKER.map(([b, t]) => `<span><b>${b}</b>${t} <i>◆</i></span>`).join('');
  $('#ticker-track').innerHTML = tk + tk;
}

/* ---------------- 0 + 1. Curtain and hero ---------------- */
$('#hero-silk').src = HERO.silk; $('#hero-showroom').src = HERO.showroom; $('#hero-heritage').src = HERO.heritage;
$('.curtain-silk').style.backgroundImage = `url(${HERO.silk})`;
lenis?.stop();
function liftCurtain() {
  const done = () => { $('#curtain')?.remove(); document.body.classList.remove('is-loading'); lenis?.start(); ScrollTrigger.refresh(); };
  if (reduced) return done();
  gsap.timeline({ onComplete: done })
    .from('.curtain-mark > *', { y: 24, opacity: 0, stagger: 0.12, duration: 0.7, ease: 'power2.out' })
    .to('.curtain-mark', { y: -30, opacity: 0, duration: 0.45, ease: 'power2.in' }, '+=0.45')
    .to('#curtain', { yPercent: -112, duration: 1.25, ease: 'power3.inOut' }, '<0.1')
    .fromTo('.hero-silk', { scale: 1.18 }, { scale: 1, duration: 1.8, ease: 'power2.out' }, '<0.15');
}
Promise.race([
  Promise.all(['#hero-silk', '#hero-showroom'].map((s) => $(s).decode().catch(() => {}))),
  new Promise((r) => setTimeout(r, 2600)),
]).then(liftCurtain);

gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: '.hero', start: 'top top', end: '+=260%', scrub: 0.7, pin: true, anticipatePin: 1 } })
  .fromTo('#hero-silk', { scale: 1.7 }, { scale: 0.55, duration: 0.32 }, 0)
  .to('.hero-silk', { opacity: 0, duration: 0.12 }, 0.2)
  .fromTo('#hero-showroom', { scale: 1.5 }, { scale: 1, duration: 0.34 }, 0)
  .to('.scroll-cue', { opacity: 0, duration: 0.05 }, 0.02)
  .to('.hero-shade', { opacity: 1, duration: 0.1 }, 0.22)
  .fromTo('.beat-a > *', { y: 46, opacity: 0, filter: 'blur(8px)' }, { y: 0, opacity: 1, filter: 'blur(0px)', stagger: 0.025, duration: 0.1 }, 0.26)
  .to('.beat-a', { y: -50, opacity: 0, duration: 0.08 }, 0.58)
  .to('#hero-showroom', { scale: 2.2, filter: 'blur(7px)', duration: 0.22 }, 0.56)
  .to('.hero-heritage', { opacity: 1, duration: 0.1 }, 0.7)
  .fromTo('#hero-heritage', { scale: 1.3 }, { scale: 1, duration: 0.3 }, 0.7)
  .fromTo('.beat-b', { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.1 }, 0.8)
  .to({}, { duration: 0.08 }, 0.92);

/* ---------------- 2. Band ---------------- */
{
  const words = BAND.map((w) => `<span>${w}</span><i>◆</i>`).join('');
  $('#band-track').innerHTML = words.repeat(4);
  gsap.fromTo('#band-track', { xPercent: 0 }, { xPercent: -30, ease: 'none', scrollTrigger: { trigger: '.band', start: 'top bottom', end: 'bottom top', scrub: true } });
}

/* ---------------- 3. Six Moods ---------------- */
{
  const row = $('#mood-row');
  MOODS.forEach((m) => row.appendChild(h(`<a class="mood" href="#rack">
    <div class="arch"><div class="arch-frame"></div><div class="arch-fill" style="background:linear-gradient(180deg, ${m.bg[0]}, ${m.bg[1]})"><img src="${m.img}" alt="${m.name}" loading="lazy"></div></div>
    <span class="mood-name">${m.name}</span></a>`)));
  gsap.fromTo('.arch', { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, stagger: 0.09, ease: 'power3.out', scrollTrigger: { trigger: row, start: 'top 85%' } });
  gsap.from('.mood-name', { opacity: 0, y: 10, stagger: 0.09, duration: 0.6, delay: 0.5, scrollTrigger: { trigger: row, start: 'top 85%' } });
  if (!reduced) $$('.mood').forEach((m, i) => gsap.fromTo(m, { y: i % 2 ? 40 : 0 }, { y: i % 2 ? 0 : 40, ease: 'none', scrollTrigger: { trigger: '.moods', start: 'top bottom', end: 'bottom top', scrub: true } }));
}

/* ---------------- 4. Try the Look ---------------- */
{
  const lineup = $('#lineup'), solo = $('#look-solo'), side = $('#look-side');
  const track = h('<div class="lineup-track"></div>'); lineup.appendChild(track);
  LOOKS.forEach((l, i) => track.appendChild(h(`<button class="lm" data-i="${i}" role="listitem" aria-label="Look ${i + 1}: ${l.name}"><img src="${l.img}" alt=""></button>`)));
  const models = $$('.lm', track);
  let mode = 'line', idx = 0;

  const sideList = (hl = -1) => {
    side.innerHTML = `<p class="side-label">The lookbook · ${LOOKS.length} looks</p>
      <ul class="side-list">${LOOKS.map((l, i) => `<li><button class="side-item${i === hl ? ' on' : ''}" data-i="${i}"><img src="${l.thumb}" alt=""><span>${l.name}<small>${l.pieces.length} pieces</small></span><b>${inr(l.price)}</b></button></li>`).join('')}</ul>
      <p class="side-hint">Hover a muse to preview. Tap to open the look.</p>`;
  };
  const sideLook = (i) => {
    const l = LOOKS[i];
    side.innerHTML = `<p class="side-label">Look ${pad2(i + 1)} · ${l.name}</p>
      <ul class="side-list">${l.pieces.map((p, n) => `<li><div class="side-item piece"><span class="piece-no">${n + 1}</span><span>${p.name}<small>${p.note || 'Handwoven'}</small></span><b>${p.price ? inr(p.price) : 'Included'}</b></div></li>`).join('')}</ul>
      <div class="side-total"><span>Full look</span><b>${inr(l.price)}</b></div>
      <button class="pill pill-red side-cta" data-add="${i}">Add full look to bag <span class="pill-arrow">${icon('i-arrow')}</span></button>
      <p class="side-hint"><a href="${l.url}" target="_blank" rel="noopener">View this piece on cult91.com ↗</a></p>`;
  };
  sideList();
  side.addEventListener('click', (e) => {
    const add = e.target.closest('[data-add]'); if (add) { addToBag(LOOKS[+add.dataset.add].name); return; }
    const it = e.target.closest('.side-item[data-i]'); if (it) openSolo(+it.dataset.i);
  });
  side.addEventListener('mouseover', (e) => { const it = e.target.closest('.side-item[data-i]'); if (it && mode === 'line') hover(+it.dataset.i); });
  side.addEventListener('mouseleave', () => mode === 'line' && unhover());

  function hover(i) { lineup.classList.add('hovering'); models.forEach((m, j) => m.classList.toggle('on', i === j)); }
  function unhover() { lineup.classList.remove('hovering'); models.forEach((m) => m.classList.remove('on')); }
  models.forEach((m, i) => {
    m.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') hover(i); });
    m.addEventListener('focus', () => hover(i));
    m.addEventListener('click', () => openSolo(i));
  });
  lineup.addEventListener('pointerleave', unhover);

  // Drift the lineup sideways as the section scrolls past.
  gsap.fromTo(track, { x: () => Math.min(0, (lineup.clientWidth - track.scrollWidth) * 0.1) }, {
    x: () => Math.min((lineup.clientWidth - track.scrollWidth) / 2, lineup.clientWidth - track.scrollWidth), ease: 'none',
    scrollTrigger: { trigger: '.look', start: 'top 85%', end: 'bottom 15%', scrub: 1, invalidateOnRefresh: true },
  });
  gsap.from(models.map((m) => m.firstElementChild), { y: 90, opacity: 0, stagger: 0.06, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: lineup, start: 'top 80%' } });

  const soloHTML = (i) => {
    const l = LOOKS[i];
    return `<div class="solo-fig"><img src="${l.img}" alt="${l.name}">${l.spots.map(([x, y], n) => `<button class="spot" style="left:${x}%;top:${y}%" aria-label="${l.pieces[n].name}">${n + 1}<span class="spot-tip">${l.pieces[n].name}${l.pieces[n].price ? ' · ' + inr(l.pieces[n].price) : ''}</span></button>`).join('')}</div>
      <div class="look-arrows"><button class="arrow-btn prev" aria-label="Previous look">${icon('i-arrow')}</button><button class="arrow-btn next" aria-label="Next look">${icon('i-arrow')}</button></div>`;
  };
  function showSolo(i, dir = 0) {
    idx = (i + LOOKS.length) % LOOKS.length;
    $('#look-no').textContent = `Look ${pad2(idx + 1)}`; $('#look-name').textContent = LOOKS[idx].name;
    sideLook(idx);
    solo.innerHTML = soloHTML(idx);
    gsap.fromTo('.solo-fig', { opacity: 0, x: dir * 60, scale: 0.94, filter: 'blur(12px)' }, { opacity: 1, x: 0, scale: 1, filter: 'blur(0px)', duration: 0.7, ease: 'power3.out' });
    gsap.from('.spot', { scale: 0, stagger: 0.12, delay: 0.45, duration: 0.4, ease: 'back.out(2)' });
  }
  function openSolo(i) {
    if (mode === 'solo') { showSolo(i); return; }
    mode = 'solo'; unhover();
    gsap.to(track, { opacity: 0, filter: 'blur(16px)', duration: 0.45, onComplete: () => { lineup.style.visibility = 'hidden'; } });
    $('#look-head').hidden = true; $('#look-detail-head').hidden = false; solo.hidden = false;
    gsap.from('#look-detail-head > *', { y: 14, opacity: 0, stagger: 0.06, duration: 0.4 });
    setTimeout(() => showSolo(i), 250);
  }
  function closeSolo() {
    mode = 'line';
    gsap.to('.solo-fig', { opacity: 0, filter: 'blur(12px)', duration: 0.35, onComplete: () => { solo.hidden = true; solo.innerHTML = ''; } });
    lineup.style.visibility = '';
    gsap.to(track, { opacity: 1, filter: 'blur(0px)', duration: 0.6, delay: 0.2 });
    $('#look-head').hidden = false; $('#look-detail-head').hidden = true;
    sideList();
  }
  $('#look-back').addEventListener('click', closeSolo);
  solo.addEventListener('click', (e) => {
    if (e.target.closest('.prev')) showSolo(idx - 1, -1);
    else if (e.target.closest('.next')) showSolo(idx + 1, 1);
    else { const s = e.target.closest('.spot'); if (s) { $$('.spot', solo).forEach((x) => x !== s && x.classList.remove('show')); s.classList.toggle('show'); } }
  });
}

/* ---------------- 5. Pick a Silk ---------------- */
{
  const strack = $('#silk-track'), sceneEl = $('.silk-scene');
  CARDS.forEach((c, i) => strack.appendChild(h(`<div class="scard" data-i="${i}" tabindex="0" role="button" aria-label="${c.title}, ${inr(c.price)}. Press to turn the card.">
    <div class="scard-in">
      <div class="face front" style="background:${c.color}">
        <div class="scard-title">${c.t[0]}<br>${c.t[1]}</div>
        <img class="scard-fig" src="${c.img}" alt="" loading="lazy">
        <button class="scard-heart" aria-label="Save ${c.title}">${icon('i-heart')}</button>
        <span class="scard-price">${inr(c.price)}</span>
        <button class="scard-plus" aria-label="Add ${c.title} to bag">${icon('i-plus')}</button>
      </div>
      <div class="face back">
        <div><p class="b-kicker">The collection · ${pad2(i + 1)}</p><h4>${c.title}</h4></div>
        <div class="b-swatch" style="background-color:${c.color};background-image:url(${c.img})"></div>
        <div><p class="b-price">${inr(c.price)}</p><div class="b-actions"><button class="pill pill-red small b-add">Add to bag</button><a class="pill pill-light small" href="${c.url}" target="_blank" rel="noopener">View ↗</a></div></div>
      </div>
    </div></div>`)));
  const cards = $$('.scard', strack);
  const st = cards.map(() => ({ tx: 0, ty: 0, gx: 0, gy: 0, s: 1, gs: 1 }));

  strack.addEventListener('click', (e) => {
    const card = e.target.closest('.scard'); if (!card) return;
    const c = CARDS[+card.dataset.i];
    if (e.target.closest('.scard-plus')) { const b = e.target.closest('.scard-plus'); b.classList.toggle('added'); if (b.classList.contains('added')) addToBag(c.title); return; }
    if (e.target.closest('.scard-heart')) { e.target.closest('.scard-heart').classList.toggle('on'); return; }
    if (e.target.closest('.b-add')) { addToBag(c.title); return; }
    if (e.target.closest('a')) return;
    card.classList.toggle('flipped');
  });
  strack.addEventListener('dblclick', (e) => { const card = e.target.closest('.scard'); if (!card) return; card.classList.remove('flipped', 'spin'); void card.offsetWidth; card.classList.add('spin'); });
  strack.addEventListener('keydown', (e) => { if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('scard')) { e.preventDefault(); e.target.classList.toggle('flipped'); } });
  cards.forEach((card, i) => {
    card.addEventListener('pointermove', (e) => { if (e.pointerType !== 'mouse') return; const r = card.getBoundingClientRect(); st[i].gy = ((e.clientX - r.left) / r.width - 0.5) * 26; st[i].gx = -((e.clientY - r.top) / r.height - 0.5) * 20; });
    card.addEventListener('pointerleave', () => { st[i].gx = 0; st[i].gy = 0; st[i].gs = 1; });
    card.addEventListener('pointerdown', () => { st[i].gs = 0.94; });
    card.addEventListener('pointerup', () => { st[i].gs = 1; });
  });

  const dist = () => Math.max(0, strack.scrollWidth - sceneEl.clientWidth + innerWidth * 0.08);
  gsap.to(strack, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: '.silks', start: 'top top', end: () => '+=' + Math.max(innerHeight, dist() * 1.15), pin: '.silks-pin', scrub: 0.8, invalidateOnRefresh: true } });

  // Perspective wall: cards near the left edge come forward, the rest recede to the right.
  let visible = false;
  ScrollTrigger.create({ trigger: '.silks', start: 'top bottom', end: 'bottom top', onToggle: (s) => { visible = s.isActive; } });
  gsap.ticker.add(() => {
    if (!visible) return;
    const W = sceneEl.clientWidth, x0 = gsap.getProperty(strack, 'x');
    cards.forEach((card, i) => {
      const s = st[i];
      s.tx += (s.gx - s.tx) * 0.12; s.ty += (s.gy - s.ty) * 0.12; s.s += (s.gs - s.s) * 0.2;
      const cx = card.offsetLeft + card.offsetWidth / 2 + x0;
      const t = clamp(cx / W, -0.3, 1.3);
      const z = 150 - 520 * t, rot = 24 - 6 * t;
      card.style.transform = `translateZ(${z.toFixed(1)}px) rotateY(${(rot + s.ty).toFixed(2)}deg) rotateX(${s.tx.toFixed(2)}deg) scale(${s.s.toFixed(3)})`;
      card.style.zIndex = String(100 - Math.round(t * 50));
      card.style.opacity = String(clamp((t + 0.22) / 0.2, 0, 1));
    });
  });
}

/* ---------------- 6. The Rack ---------------- */
{
  const chips = $('#chips'), list = $('#rail-items'), scroller = $('#rail-scroller'), focus = $('#rack-focus');
  const CAT = Object.fromEntries(RACK_FILTERS);
  let current = 'all', busy = false;
  RACK_FILTERS.forEach(([id, label]) => {
    const n = id === 'all' ? RACK.length : RACK.filter((r) => r.cat === id).length;
    chips.appendChild(h(`<button class="chip" role="tab" data-f="${id}" aria-selected="${id === 'all'}">${label}<span class="n">${n}</span></button>`));
  });
  function render(f, animate = true) {
    const items = RACK.filter((r) => f === 'all' || r.cat === f);
    list.innerHTML = '';
    items.forEach((r, k) => {
      const li = h(`<li class="hang" data-i="${RACK.indexOf(r)}" tabindex="0" role="button" aria-label="${r.name}, ${inr(r.price)}">${HANGER}<div class="hang-card"><img src="${r.img}" alt="" loading="lazy"></div><p class="hang-tag">${r.name}<b>${inr(r.price)}</b></p></li>`);
      list.appendChild(li);
      if (animate && !reduced) gsap.fromTo(li, { y: -160, opacity: 0, rotate: -16 }, { y: 0, opacity: 1, rotate: 0, duration: 1.4, delay: Math.min(k, 10) * 0.06, ease: 'elastic.out(1, 0.42)', clearProps: 'transform' });
    });
    $('#rack-count').textContent = `Scroll to explore · ${items.length} pieces`;
    requestAnimationFrame(() => { $('.rail-bar').style.width = list.scrollWidth + 'px'; });
  }
  chips.addEventListener('click', (e) => {
    const b = e.target.closest('.chip'); if (!b || busy || b.dataset.f === current) return;
    busy = true; current = b.dataset.f;
    $$('.chip', chips).forEach((c) => c.setAttribute('aria-selected', c === b));
    gsap.to(list.children, { y: -70, opacity: 0, filter: 'blur(8px)', duration: 0.35, stagger: 0.015, ease: 'power2.in', onComplete: () => { scroller.scrollLeft = 0; render(current); busy = false; } });
  });
  render('all', false);
  ScrollTrigger.create({ trigger: scroller, start: 'top 80%', once: true, onEnter: () => render('all') });

  $('#rail-prev').addEventListener('click', () => scroller.scrollBy({ left: -scroller.clientWidth * 0.7, behavior: 'smooth' }));
  $('#rail-next').addEventListener('click', () => scroller.scrollBy({ left: scroller.clientWidth * 0.7, behavior: 'smooth' }));
  // Drag to scroll with a mouse.
  let down = null, moved = false;
  scroller.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; down = { x: e.clientX, l: scroller.scrollLeft }; moved = false; });
  addEventListener('pointermove', (e) => { if (!down) return; const dx = e.clientX - down.x; if (Math.abs(dx) > 5) { moved = true; scroller.classList.add('dragging'); } if (moved) scroller.scrollLeft = down.l - dx; });
  addEventListener('pointerup', () => { down = null; scroller.classList.remove('dragging'); setTimeout(() => { moved = false; }, 0); });

  function openFocus(r) {
    const saree = r.cat === 'saree';
    focus.innerHTML = `<button class="arrow-btn prev focus-back" aria-label="Back to the rail">${icon('i-arrow')}</button>
      <div class="focus-fig">${HANGER}<div class="hang-card"><img src="${r.img}" alt="${r.name}"></div></div>
      <div class="focus-info"><p class="k">${CAT[r.cat]}</p><h3>${r.name}</h3><p class="p">${inr(r.price)}</p>
        <div class="sizes">${(saree ? ['Free size'] : ['XS', 'S', 'M', 'L', 'XL']).map((s, k) => `<button class="${(saree || k === 2) ? 'on' : ''}">${s}</button>`).join('')}</div>
        <div class="focus-actions"><button class="pill pill-red f-add">Add to bag <span class="pill-arrow">${icon('i-arrow')}</span></button><a href="${r.url}" target="_blank" rel="noopener">View details ↗</a></div></div>`;
    focus.hidden = false;
    gsap.fromTo(focus, { opacity: 0 }, { opacity: 1, duration: 0.3 });
    gsap.fromTo('.focus-fig', { y: -60, scale: 0.7, rotate: -10 }, { y: 0, scale: 1, rotate: 0, duration: 1.3, ease: 'elastic.out(1, 0.5)' });
    gsap.from('.focus-info > *', { x: 24, opacity: 0, stagger: 0.06, delay: 0.15, duration: 0.5 });
    focus.querySelector('.f-add').addEventListener('click', (e) => { addToBag(r.name); e.currentTarget.firstChild.textContent = 'Added to bag '; });
    focus.querySelector('.sizes').addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; $$('.sizes button', focus).forEach((x) => x.classList.toggle('on', x === b)); });
    focus.querySelector('.focus-back').addEventListener('click', closeFocus);
  }
  function closeFocus() { gsap.to(focus, { opacity: 0, duration: 0.25, onComplete: () => { focus.hidden = true; focus.innerHTML = ''; } }); }
  list.addEventListener('click', (e) => { const li = e.target.closest('.hang'); if (li && !moved) openFocus(RACK[+li.dataset.i]); });
  list.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.classList.contains('hang')) openFocus(RACK[+e.target.dataset.i]); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && !focus.hidden) closeFocus(); });
}

/* ---------------- 7. Draped in devotion ---------------- */
{
  const track = $('#muse-track');
  MUSE.forEach((m, i) => track.appendChild(h(`<article class="mcard"><img src="${m.img}" alt="${m.name}" loading="lazy"><span class="mcard-no">${pad2(i + 1)}</span>
    <div class="mcard-body"><p class="k">${m.kind}</p><h4>${m.name}</h4><p>${m.desc}</p><div class="mcard-row"><b>${inr(m.price)}</b><button class="mcard-add" data-i="${i}">ADD TO CART</button></div></div></article>`)));
  track.addEventListener('click', (e) => { const b = e.target.closest('.mcard-add'); if (!b) return; addToBag(MUSE[+b.dataset.i].name); b.classList.add('added'); b.textContent = 'IN BAG'; });
  gsap.fromTo(track, { x: () => innerWidth * 0.2 }, { x: () => -(track.scrollWidth - innerWidth * 0.75), ease: 'none', scrollTrigger: { trigger: '.muse', start: 'top bottom', end: 'bottom top', scrub: 1, invalidateOnRefresh: true } });
  const phrases = [['Ten silks.', 'Ten muses.'], ['Every thread', 'an offering.'], ['Woven by hand.', 'Worn in devotion.']];
  const line = phrases.map(([a, b]) => `<span>${a} <span class="accent">${b}</span></span><i>◆</i>`).join('');
  $('#ribbon-track').innerHTML = line.repeat(4);
  gsap.fromTo('#ribbon-track', { xPercent: -40 }, { xPercent: 0, ease: 'none', scrollTrigger: { trigger: '.muse', start: 'top bottom', end: 'bottom top', scrub: true } });
}

/* ---------------- 8. Feel the drape ---------------- */
{
  $('#drape-left').innerHTML = DRAPE.left.map((s) => `<div class="tile"><img src="${s}" alt="" loading="lazy"></div>`).join('');
  $('#drape-right').innerHTML = DRAPE.right.map((s, i) => i === 2
    ? `<div class="tile promo"><img src="${s}" alt="" loading="lazy"><span>New in<b>Handloom</b></span></div>`
    : `<div class="tile"><img src="${s}" alt="" loading="lazy"></div>`).join('');
  if (!reduced) {
    gsap.fromTo('#drape-left', { y: 90 }, { y: -90, ease: 'none', scrollTrigger: { trigger: '.drape', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.fromTo('#drape-right', { y: -60 }, { y: 140, ease: 'none', scrollTrigger: { trigger: '.drape', start: 'top bottom', end: 'bottom top', scrub: true } });
  }
  const screen = $('#drape-screen'), bar = $('#screen-bar');
  if (DRAPE.video) {
    screen.insertAdjacentHTML('afterbegin', `<video src="${DRAPE.video}"${DRAPE.poster ? ` poster="${DRAPE.poster}"` : ''} muted loop playsinline preload="metadata" aria-label="NOOLAM film: one thread, from silk to the weave"></video>`);
    const vid = $('video', screen);
    // Play only while the screen is on view; the progress bar follows the film.
    ScrollTrigger.create({ trigger: screen, start: 'top bottom', end: 'bottom top', onToggle: (s) => { if (s.isActive) vid.play().catch(() => {}); else vid.pause(); } });
    vid.addEventListener('timeupdate', () => { if (vid.duration) bar.style.width = `${(vid.currentTime / vid.duration) * 100}%`; });
  } else {
    screen.insertAdjacentHTML('afterbegin', DRAPE.slides.map((s, i) => `<img src="${s.src}" alt="" style="object-position:${s.pos}" class="${i ? '' : 'on'}" loading="lazy">`).join(''));
    const slides = $$('img', screen); let cur = 0, tw = null;
    const play = () => { tw = gsap.fromTo(bar, { width: '0%' }, { width: '100%', duration: 3.8, ease: 'none', onComplete: () => { slides[cur].classList.remove('on'); cur = (cur + 1) % slides.length; slides[cur].classList.add('on'); play(); } }); };
    ScrollTrigger.create({ trigger: screen, start: 'top bottom', end: 'bottom top', onToggle: (s) => { if (s.isActive) { tw ? tw.resume() : play(); } else tw?.pause(); } });
  }
}

/* ---------------- 9. Silk, in motion + story viewer ---------------- */
{
  const ring = $('#reel-ring');
  REELS.forEach((r, i) => ring.appendChild(h(`<button class="rcard" data-i="${i}" style="background-image:url(${r.img})" aria-label="Play reel: ${r.title}">
    <span class="rcard-top"><span>REEL ${r.no}</span><span>♥</span></span><span class="rcard-play">${icon('i-play')}</span>
    <span class="rcard-body"><span class="k">${r.kind}</span><span class="rcard-title">${r.title}</span><span class="rcard-sub">${r.sub}</span></span></button>`)));
  const cards = $$('.rcard', ring);
  function layoutRing(a) {
    const w = cards[0].offsetWidth;
    cards.forEach((c, i) => {
      const d = i - a, ad = Math.abs(d);
      const x = Math.sign(d) * w * (ad <= 1 ? ad * 0.92 : 0.92 + (ad - 1) * 0.66);
      const rot = -clamp(d, -3, 3) * 24, z = -ad * 170, s = 1 - Math.min(ad, 4) * 0.07;
      c.style.transform = `translate(-50%, -50%) translateX(${x.toFixed(1)}px) translateZ(${z.toFixed(1)}px) rotateY(${rot.toFixed(2)}deg) scale(${s.toFixed(3)})`;
      c.style.zIndex = String(100 - Math.round(ad * 10));
      c.style.opacity = String(clamp(1 - Math.max(0, ad - 3.2), 0, 1));
      c.classList.toggle('center', ad < 0.5);
    });
  }
  const n = REELS.length;
  let active = 1.5;
  layoutRing(active);
  ScrollTrigger.create({ trigger: '.reels', start: 'top top', end: '+=160%', pin: '.reels-pin', scrub: true, onUpdate: (s) => { active = 1.5 + s.progress * (n - 3); layoutRing(active); }, onRefresh: () => layoutRing(active) });
  ring.addEventListener('click', (e) => { const c = e.target.closest('.rcard'); if (c) openStory(+c.dataset.i); });
  $('#reels-open').addEventListener('click', () => openStory(Math.round(active)));

  // Story viewer
  const story = $('#story'), stage = $('#story-stage'), bg = $('#story-bg');
  REELS.forEach((r, i) => stage.appendChild(h(`<div class="scard2" data-i="${i}" style="background-image:url(${r.img})">
    <div class="kb" style="background-image:url(${r.img})"></div>
    <div class="s-ui">
      <div class="s-bars">${REELS.map(() => '<span><i></i></span>').join('')}</div>
      <div class="s-head"><span class="s-avatar">N</span><span><b>noolam</b><small>${r.place}</small></span><button class="s-mute" aria-label="Sound">${icon('i-sound')}</button></div>
      <div class="s-foot"><p class="k">${r.kind}</p><h4>${r.title}</h4><p>${r.sub}</p>
        <div class="s-row"><b>${inr(r.price)}</b><button class="pill pill-red small s-add">Add to bag</button><button class="s-heart" aria-label="Save">${icon('i-heart')}</button><a class="s-more" href="${r.url}" target="_blank" rel="noopener">More drapes</a></div></div>
    </div>
    <span class="side-label">${r.title}</span></div>`)));
  const scards = $$('.scard2', stage);
  let sIdx = 0, tween = null, kb = null, lastFocus = null;
  function place() {
    scards.forEach((c, i) => {
      let d = i - sIdx; if (d > n / 2) d -= n; if (d < -n / 2) d += n;
      const ad = Math.abs(d);
      c.classList.toggle('side', d !== 0);
      c.style.zIndex = String(10 - ad);
      c.style.opacity = ad > 1 ? '0' : d === 0 ? '1' : '0.75';
      c.style.pointerEvents = ad > 1 ? 'none' : 'auto';
      c.style.filter = d === 0 ? 'none' : 'brightness(.6)';
      c.style.transform = d === 0 ? 'none' : `translateX(${d * (mobile() ? 62 : 92)}%) translateZ(-320px) rotateY(${-d * 24}deg) scale(.6)`;
    });
    bg.style.backgroundImage = `url(${REELS[sIdx].img})`;
    bg.style.backgroundColor = REELS[sIdx].tint;
    const cur = scards[sIdx];
    $$('.s-bars span', cur).forEach((s, k) => { s.classList.toggle('done', k < sIdx); s.querySelector('i').style.width = k < sIdx ? '100%' : '0%'; });
    tween?.kill(); kb?.kill();
    kb = gsap.fromTo($('.kb', cur), { scale: 1.02, backgroundPosition: '50% 0%' }, { scale: 1.12, backgroundPosition: '50% 60%', duration: 6, ease: 'none' });
    tween = gsap.to($$('.s-bars span', cur)[sIdx].querySelector('i'), { width: '100%', duration: 6, ease: 'none', onComplete: () => go(sIdx + 1) });
  }
  const go = (i) => { sIdx = (i + n) % n; place(); };
  function openStory(i) {
    lastFocus = document.activeElement; story.hidden = false; lenis?.stop(); document.body.style.overflow = 'hidden';
    go(i);
    gsap.fromTo(stage, { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'power3.out' });
    $('#story-close').focus();
  }
  function closeStory() { tween?.kill(); kb?.kill(); story.hidden = true; lenis?.start(); document.body.style.overflow = ''; lastFocus?.focus(); }
  $('#story-close').addEventListener('click', closeStory);
  addEventListener('keydown', (e) => { if (story.hidden) return; if (e.key === 'Escape') closeStory(); if (e.key === 'ArrowRight') go(sIdx + 1); if (e.key === 'ArrowLeft') go(sIdx - 1); });
  let press = null;
  stage.addEventListener('pointerdown', (e) => {
    const c = e.target.closest('.scard2'); if (!c || c.classList.contains('side') || e.target.closest('button, a')) return;
    press = { x: e.clientX, y: e.clientY, t: Date.now(), c }; tween?.pause(); kb?.pause();
  });
  stage.addEventListener('pointerup', (e) => {
    if (!press) return;
    const p = press; press = null;
    const dy = e.clientY - p.y, dt = Date.now() - p.t, r = p.c.getBoundingClientRect();
    if (dy > 90) { closeStory(); return; }
    if (dt < 250) { const fx = (e.clientX - r.left) / r.width; if (fx < 0.33) { go(sIdx - 1); return; } if (fx > 0.67) { go(sIdx + 1); return; } }
    tween?.resume(); kb?.resume();
  });
  stage.addEventListener('click', (e) => {
    const c = e.target.closest('.scard2'); if (!c) return;
    if (c.classList.contains('side')) { go(+c.dataset.i); return; }
    if (e.target.closest('.s-add')) addToBag(REELS[sIdx].title);
    else if (e.target.closest('.s-heart')) e.target.closest('.s-heart').classList.toggle('on');
  });
}

/* ---------------- 10. Bridal ---------------- */
{
  const ring = $('#arch-ring'), info = $('#bridal-info');
  BRIDAL.forEach((b, i) => ring.appendChild(h(`<button class="bcard" data-i="${i}" style="background-image:url(${b.img})" aria-label="${b.name}"></button>`)));
  const cards = $$('.bcard', ring), n = BRIDAL.length;
  let shown = -1, st = null, blur = 0, a = 0;
  function layout() {
    const w = cards[0].offsetWidth;
    cards.forEach((c, i) => {
      const d = i - a, ad = Math.abs(d);
      const x = Math.sign(d) * w * (ad <= 1 ? ad * 0.78 : 0.78 + (ad - 1) * 0.58);
      const y = Math.min(ad, 4) ** 2 * 7, rz = clamp(d, -4, 4) * 7, ry = -clamp(d, -4, 4) * 12, z = -ad * 110, s = 1 - Math.min(ad, 4) * 0.09;
      c.style.transform = `translateX(${x.toFixed(1)}px) translateY(${y.toFixed(1)}px) translateZ(${z.toFixed(1)}px) rotateZ(${rz.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale(${s.toFixed(3)})`;
      c.style.zIndex = String(100 - Math.round(ad * 10));
      c.style.opacity = String(clamp(1 - Math.max(0, ad - 3) * 0.8, 0, 1));
      c.style.filter = blur > 0.3 ? `blur(${(blur * (ad < 0.5 ? 0.4 : 1)).toFixed(1)}px)` : 'none';
    });
    const k = clamp(Math.round(a), 0, n - 1);
    if (k !== shown) { shown = k; renderInfo(k); }
  }
  function renderInfo(k) {
    const b = BRIDAL[k];
    info.innerHTML = `<h3>${b.name}</h3><p>${b.sub}</p>
      <div class="row"><b>${inr(b.price)}</b><button class="pill pill-red small" data-add="${k}">Add to cart</button></div>
      <div class="row"><button class="arrow-btn prev" aria-label="Previous">${icon('i-arrow')}</button><div class="bridal-dots">${BRIDAL.map((_, j) => `<i class="${j === k ? 'on' : ''}"></i>`).join('')}</div><button class="arrow-btn next" aria-label="Next">${icon('i-arrow')}</button></div>`;
    gsap.from(info.querySelectorAll('h3, p'), { y: 10, opacity: 0, filter: 'blur(6px)', stagger: 0.05, duration: 0.35 });
  }
  const goTo = (k) => { if (!st) return; const kk = clamp(k, 0, n - 1); const y = st.start + (kk / (n - 1)) * (st.end - st.start); lenis ? lenis.scrollTo(y) : scrollTo({ top: y, behavior: 'smooth' }); };
  info.addEventListener('click', (e) => {
    const add = e.target.closest('[data-add]'); if (add) { addToBag(BRIDAL[+add.dataset.add].name); return; }
    if (e.target.closest('.prev')) goTo(shown - 1); else if (e.target.closest('.next')) goTo(shown + 1);
  });
  ring.addEventListener('click', (e) => { const c = e.target.closest('.bcard'); if (c) goTo(+c.dataset.i); });
  layout();
  st = ScrollTrigger.create({ trigger: '.bridal', start: 'top top', end: '+=180%', pin: '.bridal-pin', scrub: 0.6,
    snap: { snapTo: 1 / (n - 1), duration: { min: 0.2, max: 0.6 }, ease: 'power2.inOut' },
    onUpdate: (s) => { a = s.progress * (n - 1); blur = Math.min(5, Math.abs(s.getVelocity()) / 500); layout(); },
    onRefresh: () => layout() });
  gsap.ticker.add(() => { if (blur > 0.3) { blur *= 0.9; layout(); } });
}

/* ---------------- 11. Three silks, one weave ---------------- */
{
  const ws = initWeave($('#weave-canvas'));
  const slots = [null, null, null];
  const RN = ['I', 'II', 'III'];
  const sw = $('#swatches'), label = $('#weave-label');
  sw.innerHTML = WEAVE.map((w, j) => `<button class="sw" data-j="${j}" style="background-image:url(${w.sw})" aria-label="${w.name}, ${inr(w.price)}" aria-pressed="false"></button>`).join('');
  const imgCache = {};
  const load = (src) => imgCache[src] || (imgCache[src] = new Promise((res) => { const im = new Image(); im.onload = () => res(im); im.src = src; }));
  const count = () => slots.filter((s) => s !== null).length;
  const defaultLabel = () => (count() === 3 ? 'Woven as one' : 'Choose a silk to weave it in');
  function ui() {
    $('#weave-list').innerHTML = slots.map((j, k) => `<li class="${j !== null ? 'on' : ''}"><span class="rn">${RN[k]}</span><span>${j !== null ? WEAVE[j].name : 'A thread, waiting'}</span>${j !== null ? `<button data-k="${k}" aria-label="Remove ${WEAVE[j].name}">×</button>` : '<span></span>'}</li>`).join('');
    $$('.sw', sw).forEach((b) => { const k = slots.indexOf(+b.dataset.j); b.classList.toggle('on', k > -1); b.setAttribute('aria-pressed', k > -1); b.innerHTML = k > -1 ? `<span class="rn">${RN[k]}</span>` : ''; });
    const sum = slots.reduce((t, j) => t + (j !== null ? WEAVE[j].price : 0), 0), full = count() === 3;
    sw.classList.toggle('full', full);
    $('#weave-was').textContent = full ? inr(sum) : '';
    $('#weave-total').textContent = inr(full ? sum * (1 - WEAVE_DISCOUNT) : sum);
    $('#weave-add').hidden = !full; $('#weave-add-top').disabled = !full;
    if (!label.classList.contains('name')) label.textContent = defaultLabel();
    if (ws) gsap.to(ws.state, { braid: full ? 1 : 0, duration: full ? 2.4 : 1.2, delay: full ? 1.1 : 0, ease: 'power2.inOut', overwrite: 'auto' });
  }
  sw.addEventListener('pointerover', (e) => { const b = e.target.closest('.sw'); if (!b) return; label.textContent = WEAVE[+b.dataset.j].name; label.classList.add('name'); });
  sw.addEventListener('pointerout', () => { label.classList.remove('name'); label.textContent = defaultLabel(); });
  function remove(k) { if (ws) gsap.to(ws.state.strands[k], { fill: 0, duration: 0.8, ease: 'power2.in' }); slots[k] = null; ui(); }
  sw.addEventListener('click', (e) => {
    const b = e.target.closest('.sw'); if (!b) return;
    const j = +b.dataset.j, has = slots.indexOf(j);
    if (has > -1) { remove(has); return; }
    const k = slots.indexOf(null); if (k < 0) return;
    slots[k] = j; ui();
    load(WEAVE[j].tex).then((im) => { if (!ws || slots[k] !== j) return; ws.setTexture(k, im); gsap.fromTo(ws.state.strands[k], { fill: 0 }, { fill: 1, duration: 1.8, ease: 'power2.inOut' }); });
  });
  $('#weave-list').addEventListener('click', (e) => { const b = e.target.closest('button[data-k]'); if (b) remove(+b.dataset.k); });
  function addSet() {
    if (count() < 3) return;
    const sum = slots.reduce((t, j) => t + WEAVE[j].price, 0);
    addToBag('Woven set', 1, true);
    const t = $('#weave-toast'); t.textContent = `Woven and in your bag. You saved ${inr(sum * WEAVE_DISCOUNT)}`; t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3200);
    const reset = () => { slots.fill(null); if (ws) { ws.state.strands.forEach((s) => { s.fill = 0; }); ws.state.braid = 0; ws.state.scatter = 0; } ui(); };
    if (ws) { gsap.killTweensOf(ws.state); gsap.to(ws.state, { scatter: 1, duration: 1.4, ease: 'power2.in', onComplete: reset }); } else reset();
  }
  $('#weave-add').addEventListener('click', addSet);
  $('#weave-add-top').addEventListener('click', addSet);
  ui();
  ScrollTrigger.create({ trigger: '.weave', start: 'top bottom', end: 'bottom top', onToggle: (s) => ws?.setActive(s.isActive) });
}

/* ---------------- 12. Footer ---------------- */
$('#news').addEventListener('submit', (e) => { e.preventDefault(); $('#news-done').hidden = false; e.target.reset(); });
gsap.from('.footer-card', { y: 90, scale: 0.96, opacity: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: '.footer', start: 'top 92%' } });

/* ---------------- Headings blur in, nav state ---------------- */
$$('main .title').forEach((el) => {
  if (el.closest('.hero')) return;
  gsap.fromTo(el, { opacity: 0, y: 26, filter: 'blur(12px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%' } });
});
[['#home', 'home'], ['#look', 'look'], ['#silks', 'silks'], ['#rack', 'rack'], ['#muse', 'muse'], ['#drape', 'muse'], ['#reels', 'muse'], ['#bridal', 'bridal'], ['#weave', 'weave']].forEach(([sel, key]) => {
  ScrollTrigger.create({ trigger: sel, start: 'top 50%', end: 'bottom 50%', onToggle: (s) => s.isActive && setActive(key) });
});

addEventListener('load', () => ScrollTrigger.refresh());

// Frame-exact screen capture of the NOOLAM site at 1920x1080, 30 fps.
// Page time (timers, rAF, GSAP, Three.js) runs on Playwright's fake clock; CSS animations and
// transitions are paused and stepped by hand; the drape film is seeked frame by frame.
// Usage: node record.js <framesDir> [maxFrames]   (site served at http://localhost:8765/)
const { chromium } = require('playwright');
const fs = require('fs');

const OUT = process.argv[2];
const MAX = +process.argv[3] || Infinity;
const FPS = 30;
const W = 1920, H = 1080;
fs.mkdirSync(OUT, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2); // cubic in-out

(async () => {
  const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist', '--hide-scrollbars', '--autoplay-policy=no-user-gesture-required'] });
  const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  p.on('pageerror', (e) => console.error('PAGEERR', e.message));
  await p.clock.install({ time: new Date('2026-11-09T10:00:00Z') });
  await p.clock.pauseAt(new Date('2026-11-09T10:00:00Z')); // time moves only when a frame is captured
  await p.goto('http://localhost:8765/?rec', { waitUntil: 'load' });
  await p.addStyleTag({ content: 'html{scrollbar-width:none}::-webkit-scrollbar{display:none}#rec-cursor{position:fixed;left:0;top:0;z-index:2147483647;pointer-events:none;width:38px;height:50px;margin:-3px 0 0 -3px;transition:none!important}' });
  await p.evaluate(() => {
    const c = document.createElement('div');
    c.id = 'rec-cursor';
    c.innerHTML = '<svg viewBox="0 0 24 32" width="38" height="50"><path d="M2 2v23l6.2-5.8 4.3 9.6 4.2-1.9-4.3-9.4H21z" fill="#fff" stroke="#1d1b20" stroke-width="1.8" stroke-linejoin="round"/></svg>';
    c.style.opacity = '0';
    document.body.appendChild(c);
    window.__recScroll = (y) => { window.scrollTo(0, y); if (window.ScrollTrigger) window.ScrollTrigger.update(); };
    window.__recStep = (dt, mx, my, cur) => {
      for (const a of document.getAnimations()) {
        if (!a.__rec) { a.__rec = 1; try { a.pause(); } catch (e) {} }
        else { try { a.currentTime = (a.currentTime || 0) + dt; } catch (e) {} }
      }
      const el = document.getElementById('rec-cursor');
      el.style.opacity = cur; el.style.left = mx + 'px'; el.style.top = my + 'px';
      const v = document.querySelector('#drape-screen video');
      if (v) {
        if (!v.paused) v.pause();
        const r = v.getBoundingClientRect();
        if (r.bottom > 0 && r.top < innerHeight && v.readyState >= 1 && v.duration) { v.__t = ((v.__t || 0) + dt / 1000) % v.duration; v.currentTime = v.__t; }
      }
    };
  });

  const s = { y: 0, mx: 1200, my: 640, cur: 0, setY: false };
  let frame = 0, lastMouse = '';
  async function step() {
    if (frame >= MAX) throw new Error('MAX');
    if (s.setY) await p.evaluate((y) => window.__recScroll(y), s.y);
    const dt = Math.round(((frame + 1) * 1000) / FPS) - Math.round((frame * 1000) / FPS);
    await p.clock.runFor(dt);
    const mk = `${Math.round(s.mx)},${Math.round(s.my)}`;
    if (s.cur && mk !== lastMouse) { await p.mouse.move(s.mx, s.my); lastMouse = mk; }
    await p.evaluate(([dt, mx, my, cur]) => window.__recStep(dt, mx, my, cur), [dt, s.mx, s.my, s.cur]);
    for (let k = 0; k < 40; k++) { const busy = await p.evaluate(() => { const v = document.querySelector('#drape-screen video'); return !!(v && v.seeking); }); if (!busy) break; await sleep(15); }
    await p.screenshot({ path: `${OUT}/${String(frame).padStart(5, '0')}.jpg`, type: 'jpeg', quality: 90 });
    frame++;
    if (frame % 150 === 0) console.log('frame', frame, (frame / FPS).toFixed(1) + 's');
  }
  const frames = (sec) => Math.max(1, Math.round(sec * FPS));
  async function hold(sec) { s.setY = false; for (let i = 0; i < frames(sec); i++) await step(); }
  async function scrollTo(y, sec) {
    const from = await p.evaluate(() => scrollY); const n = frames(sec);
    s.setY = true;
    for (let i = 1; i <= n; i++) { s.y = from + (y - from) * ease(i / n); await step(); }
    s.setY = false;
  }
  async function move(x, y, sec) {
    const fx = s.mx, fy = s.my, n = frames(sec);
    for (let i = 1; i <= n; i++) { const e = ease(i / n); s.mx = fx + (x - fx) * e; s.my = fy + (y - fy) * e - Math.sin(Math.PI * e) * 30; s.cur = Math.min(1, s.cur + 0.2); await step(); }
  }
  async function showCursor(sec = 0.3) { const n = frames(sec); for (let i = 1; i <= n; i++) { s.cur = i / n; await step(); } }
  async function at(sel, i = 0, dx = 0.5, dy = 0.5) {
    return p.evaluate(([sel, i, dx, dy]) => { const el = document.querySelectorAll(sel)[i]; if (!el) return null; const r = el.getBoundingClientRect(); return [r.left + r.width * dx, r.top + r.height * dy]; }, [sel, i, dx, dy]);
  }
  async function moveTo(sel, i, sec, dx, dy) { const pt = await at(sel, i, dx, dy); if (pt) await move(pt[0], pt[1], sec); else console.error('missing', sel, i); return pt; }
  async function click(holdSec = 0.1) { await p.mouse.move(s.mx, s.my); await p.mouse.down(); await hold(0.06); await p.mouse.up(); await hold(holdSec); }
  async function key(k, sec) { await p.keyboard.press(k); await hold(sec); }
  const L = () => p.evaluate(() => {
    const top = (q) => document.querySelector(q).getBoundingClientRect().top + scrollY;
    const pin = (q) => { const st = ScrollTrigger.getAll().find((t) => t.trigger === document.querySelector(q) && t.pin); return st ? [st.start, st.end] : [top(q), top(q)]; };
    return { hero: pin('.hero'), moods: top('#archive'), look: top('#look'), silks: pin('.silks'), rack: top('#rack'), muse: top('#muse'), drape: top('#drape'), reels: pin('.reels'), bridal: pin('.bridal'), weave: top('#weave'), max: document.documentElement.scrollHeight - innerHeight };
  });
  const mid = (r, f) => r[0] + (r[1] - r[0]) * f;

  try {
    // 0. Silk curtain lifts.
    await hold(3.3);
    let l = await L();
    // 1. Hero: silk pulls back into the showroom, then dollies into the heritage beat.
    await scrollTo(mid(l.hero, 0.42), 3.6);
    await showCursor(0.3);
    await moveTo('.beat-a .pill-red', 0, 1.0);
    await hold(1.0);
    await scrollTo(mid(l.hero, 0.97), 3.8);
    await hold(1.2);
    // 2. Band and Six Moods.
    l = await L();
    await scrollTo(l.moods - 30, 2.6);
    await hold(0.4);
    await moveTo('.mood .arch', 2, 0.9, 0.5, 0.55); await hold(1.0);
    await moveTo('.mood .arch', 4, 0.8, 0.5, 0.55); await hold(0.9);
    // 3. Try the Look.
    l = await L();
    await scrollTo(l.look - 10, 2.2);
    await hold(0.5);
    await moveTo('.lm', 1, 0.8, 0.5, 0.45); await hold(0.8);
    await moveTo('.lm', 4, 0.8, 0.5, 0.45); await hold(0.9);
    await click(1.6);
    await moveTo('.spot', 0, 0.7); await hold(1.2);
    await moveTo('.look-arrows .next', 0, 0.7); await click(1.5);
    await moveTo('.side-cta', 0, 0.8); await click(1.4);
    await moveTo('#look-back', 0, 0.8); await click(1.0);
    // 4. Pick a Silk.
    l = await L();
    await scrollTo(l.silks[0], 2.0);
    await scrollTo(mid(l.silks, 0.4), 3.4);
    const card = await p.evaluate(() => { const cs = [...document.querySelectorAll('.scard')]; let best = 0, bd = 1e9; cs.forEach((c, i) => { const r = c.getBoundingClientRect(); const d = Math.abs(r.left + r.width / 2 - innerWidth * 0.42); if (d < bd) { bd = d; best = i; } }); return best; });
    await moveTo('.scard', card, 0.8, 0.35, 0.4); await move(s.mx + 120, s.my + 160, 1.1);
    await click(1.5);
    await click(1.1);
    await scrollTo(l.silks[1], 3.2);
    // 5. The Rack.
    l = await L();
    await scrollTo(l.rack - 20, 2.0);
    await hold(1.8);
    await moveTo('.chip[data-f="suit"]', 0, 0.8); await click(2.4);
    await moveTo('.hang', 2, 0.8, 0.5, 0.6); await hold(0.8);
    await click(1.6);
    await moveTo('.f-add', 0, 0.8); await click(1.2);
    await moveTo('.focus-back', 0, 0.7); await click(0.7);
    // 6. Draped in devotion.
    l = await L();
    await scrollTo(l.muse - 20, 2.2);
    await scrollTo(l.muse + 380, 3.0);
    await moveTo('.mcard-add', 4, 0.8); await click(1.2);
    // 7. Feel the drape: the film plays in the centre screen.
    l = await L();
    await scrollTo(l.drape + 30, 2.2);
    await move(1700, 900, 0.8);
    await hold(3.4);
    // 8. Silk, in motion and the story viewer.
    l = await L();
    await scrollTo(l.reels[0], 2.0);
    await scrollTo(mid(l.reels, 0.5), 3.0);
    await moveTo('.rcard.center', 0, 0.8, 0.5, 0.45); await click(3.4);
    await key('ArrowRight', 2.4);
    await key('Escape', 0.6);
    // 9. Bridal.
    l = await L();
    await scrollTo(l.bridal[0], 1.8);
    await scrollTo(mid(l.bridal, 0.5), 2.6); await hold(1.2);
    await scrollTo(l.bridal[1], 2.4); await hold(1.0);
    // 10. Three silks, one weave.
    l = await L();
    await scrollTo(l.weave, 2.2);
    await hold(0.5);
    for (const j of [0, 1, 2]) { await moveTo('.sw', j, 0.7); await click(1.5); }
    await hold(3.2);
    await moveTo('#weave-add', 0, 0.8); await click(2.6);
    // 11. Footer.
    l = await L();
    await move(1500, 300, 0.6);
    await scrollTo(l.max, 2.6);
    await hold(2.8);
  } catch (e) { if (e.message !== 'MAX') throw e; }
  console.log('DONE frames', frame, (frame / FPS).toFixed(2) + 's');
  await browser.close();
})();

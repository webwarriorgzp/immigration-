// Layered architecture (web3d-integration-patterns, Pattern 1):
//   3D layer        -> Three.js scene, owns the render loop
//   Animation layer -> GSAP ScrollTrigger tweens a plain `state` object
//   UI layer        -> static HTML, revealed with GSAP
// GSAP never touches Three.js objects directly; the render loop reads `state`
// each frame, so scroll, mouse and idle motion never fight over a property.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const { gsap, ScrollTrigger } = window;
gsap.registerPlugin(ScrollTrigger);

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = () => window.innerWidth < 768;

document.getElementById('year').textContent = new Date().getFullYear();

// ---------------------------------------------------------------------------
// Scroll keyframes for the 3D scene, one per section
// ---------------------------------------------------------------------------
const KEYFRAMES = [
  // Each keyframe parks the scene in the empty side of that section's layout.
  // `dim` fades the canvas behind text-heavy sections.
  /* hero     */ { bagX: 3.2, bagY: 0.0, bagRot: 0.4, ringRot: 0.0, spread: 0.85, tilt: 0.25, camZ: 8.0, hue: 0, dim: 0 },
  /* services */ { bagX: -3.6, bagY: -0.3, bagRot: Math.PI * 1.2, ringRot: Math.PI * 0.6, spread: 0.8, tilt: 0.4, camZ: 9.0, hue: 0.25, dim: 0.15 },
  /* work     */ { bagX: 0.0, bagY: -1.2, bagRot: Math.PI * 2.0, ringRot: Math.PI * 1.2, spread: 2.4, tilt: 0.05, camZ: 16.0, hue: 0.5, dim: 0.35 },
  /* process  */ { bagX: 3.6, bagY: 0.2, bagRot: Math.PI * 2.6, ringRot: Math.PI * 1.8, spread: 0.8, tilt: 0.55, camZ: 9.0, hue: 0.75, dim: 0.1 },
  /* contact  */ { bagX: 3.4, bagY: -0.4, bagRot: Math.PI * 4.0, ringRot: Math.PI * 2.4, spread: 0.8, tilt: 0.3, camZ: 9.0, hue: 1, dim: 0.2 },
];
const SECTIONS = ['#services', '#work', '#process', '#contact'];

const state = { ...KEYFRAMES[0] };
const pointer = { x: 0, y: 0 };

// ---------------------------------------------------------------------------
// 3D layer
// ---------------------------------------------------------------------------
function createScene(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x07090d, 9, 22);
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, state.camZ);

  scene.add(new THREE.AmbientLight(0xffffff, 0.35));
  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.position.set(4, 6, 6);
  scene.add(key);
  const rimGreen = new THREE.PointLight(0x9be15d, 40, 20);
  rimGreen.position.set(-4, 2, -2);
  scene.add(rimGreen);
  const rimTeal = new THREE.PointLight(0x2dd4bf, 30, 20);
  rimTeal.position.set(4, -3, 2);
  scene.add(rimTeal);

  const hero = new THREE.Group();
  scene.add(hero);

  const bag = createBag();
  hero.add(bag);

  const ring = new THREE.Group();
  hero.add(ring);
  const cards = createProductCards(8);
  cards.forEach((card) => ring.add(card));

  const props = createFloatingProps();
  hero.add(props);

  const particles = createParticles(isMobile() ? 600 : 1400);
  scene.add(particles);

  return { renderer, scene, camera, hero, bag, ring, cards, props, particles, rimGreen, rimTeal };
}

// A stylised shopping bag: graphite body, accent handles and a monogram tag.
function createBag() {
  const group = new THREE.Group();

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(1.6, 1.9, 0.7, 1, 1, 1),
    new THREE.MeshPhysicalMaterial({ color: 0x1a2230, metalness: 0.3, roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.15 })
  );
  group.add(body);

  const rim = new THREE.Mesh(
    new THREE.BoxGeometry(1.64, 0.12, 0.74),
    new THREE.MeshStandardMaterial({ color: 0x9be15d, metalness: 0.4, roughness: 0.3, emissive: 0x2a4d10, emissiveIntensity: 0.6 })
  );
  rim.position.y = 0.95;
  group.add(rim);

  const handleMat = new THREE.MeshStandardMaterial({ color: 0x9be15d, metalness: 0.6, roughness: 0.25 });
  [-0.2, 0.2].forEach((z) => {
    const handle = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.05, 16, 48, Math.PI), handleMat);
    handle.position.set(0, 0.98, z);
    group.add(handle);
  });

  const tag = new THREE.Mesh(
    new THREE.PlaneGeometry(0.9, 0.9),
    new THREE.MeshBasicMaterial({ map: monogramTexture(), transparent: true })
  );
  tag.position.set(0, -0.05, 0.352);
  group.add(tag);

  return group;
}

function monogramTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d');
  const grad = g.createLinearGradient(0, 0, 256, 256);
  grad.addColorStop(0, '#9be15d');
  grad.addColorStop(1, '#2dd4bf');
  roundRect(g, 28, 28, 200, 200, 48);
  g.fillStyle = grad;
  g.fill();
  g.fillStyle = '#0b1205';
  g.font = '700 140px "Space Grotesk", system-ui, sans-serif';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText('N', 128, 136);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Mock storefront product tiles orbiting the bag.
const PALETTES = [
  ['#9be15d', '#2dd4bf'], ['#f7b267', '#f25f5c'], ['#a78bfa', '#60a5fa'], ['#fbbf24', '#f472b6'],
  ['#34d399', '#3b82f6'], ['#fb7185', '#fdba74'], ['#2dd4bf', '#a78bfa'], ['#f472b6', '#9be15d'],
];
const PRICES = ['$48', '$120', '$32', '$89', '$64', '$210', '$27', '$155'];

function createProductCards(count) {
  const geo = new THREE.PlaneGeometry(1.05, 1.4);
  return Array.from({ length: count }, (_, i) => {
    const mat = new THREE.MeshBasicMaterial({ map: productTexture(i), transparent: true, side: THREE.DoubleSide, fog: true });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.userData = { angle: (i / count) * Math.PI * 2, offset: Math.random() * Math.PI * 2, yBias: (i % 2 ? 0.5 : -0.5) };
    return mesh;
  });
}

function productTexture(i) {
  const [c1, c2] = PALETTES[i % PALETTES.length];
  const c = document.createElement('canvas');
  c.width = 384;
  c.height = 512;
  const g = c.getContext('2d');

  roundRect(g, 4, 4, 376, 504, 36);
  g.fillStyle = '#11161e';
  g.fill();
  g.strokeStyle = 'rgba(255,255,255,0.12)';
  g.lineWidth = 3;
  g.stroke();

  const grad = g.createLinearGradient(24, 24, 360, 300);
  grad.addColorStop(0, c1);
  grad.addColorStop(1, c2);
  roundRect(g, 24, 24, 336, 280, 24);
  g.fillStyle = grad;
  g.fill();

  // "product" silhouette
  g.fillStyle = 'rgba(255,255,255,0.35)';
  g.beginPath();
  g.arc(192, 150, 70, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = 'rgba(7,9,13,0.25)';
  roundRect(g, 132, 228, 120, 18, 9);
  g.fill();

  g.fillStyle = 'rgba(233,238,245,0.9)';
  roundRect(g, 28, 330, 210, 20, 10);
  g.fill();
  g.fillStyle = 'rgba(139,150,168,0.6)';
  roundRect(g, 28, 362, 150, 14, 7);
  g.fill();

  g.fillStyle = '#e9eef5';
  g.font = '700 38px "Space Grotesk", system-ui, sans-serif';
  g.fillText(PRICES[i % PRICES.length], 28, 432);

  roundRect(g, 200, 400, 156, 52, 26);
  g.fillStyle = '#9be15d';
  g.fill();
  g.fillStyle = '#0b1205';
  g.font = '600 20px Inter, system-ui, sans-serif';
  g.textAlign = 'center';
  g.fillText('Add to cart', 278, 433);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

// Coins and parcels drifting around the scene.
function createFloatingProps() {
  const group = new THREE.Group();
  const coinGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.05, 40);
  const coinMat = new THREE.MeshStandardMaterial({ color: 0xf5c451, metalness: 1, roughness: 0.25 });
  const boxGeo = new THREE.BoxGeometry(0.35, 0.28, 0.35);
  const boxMat = new THREE.MeshStandardMaterial({ color: 0xc8a27a, roughness: 0.8 });
  const gemGeo = new THREE.IcosahedronGeometry(0.2, 0);
  const gemMat = new THREE.MeshPhysicalMaterial({ color: 0x2dd4bf, metalness: 0.1, roughness: 0.05, transmission: 0.6, thickness: 0.5 });

  const defs = [
    [coinGeo, coinMat, [-2.1, 1.4, 0.8]], [coinGeo, coinMat, [1.9, -1.5, 1.0]], [coinGeo, coinMat, [2.4, 1.6, -0.6]],
    [boxGeo, boxMat, [-1.8, -1.4, 1.2]], [boxGeo, boxMat, [1.4, 1.9, 0.9]],
    [gemGeo, gemMat, [-2.5, 0.2, -0.5]], [gemGeo, gemMat, [0.3, -2.0, 1.4]],
  ];
  defs.forEach(([geo, mat, pos], i) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(...pos);
    m.userData = { base: new THREE.Vector3(...pos), speed: 0.4 + (i % 3) * 0.2, phase: i * 1.3 };
    m.rotation.set(Math.random() * 3, Math.random() * 3, 0);
    group.add(m);
  });
  return group;
}

function createParticles(count) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const a = new THREE.Color(0x9be15d);
  const b = new THREE.Color(0x2dd4bf);
  for (let i = 0; i < count; i++) {
    const r = 6 + Math.random() * 12;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions.set([r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi) * 0.6, r * Math.sin(phi) * Math.sin(theta) - 4], i * 3);
    const col = a.clone().lerp(b, Math.random());
    colors.set([col.r, col.g, col.b], i * 3);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const mat = new THREE.PointsMaterial({ size: 0.04, vertexColors: true, transparent: true, opacity: 0.7, depthWrite: false });
  return new THREE.Points(geo, mat);
}

function roundRect(g, x, y, w, h, r) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}

// ---------------------------------------------------------------------------
// Render loop: reads `state`, applies idle motion and pointer parallax
// ---------------------------------------------------------------------------
function startLoop(ctx) {
  const { renderer, scene, camera, hero, bag, ring, cards, props, particles, rimGreen, rimTeal } = ctx;
  const canvas = renderer.domElement;
  const clock = new THREE.Clock();
  const target = new THREE.Vector3();
  const green = new THREE.Color(0x9be15d);
  const teal = new THREE.Color(0x2dd4bf);
  const motion = reducedMotion ? 0.15 : 1;
  let last = 0;

  function frame() {
    const now = clock.getElapsedTime();
    const dt = Math.min(now - last, 0.1);
    last = now;
    const t = now * motion;
    // Frame-rate independent smoothing factors.
    const fast = 1 - Math.exp(-dt * 6);
    const slow = 1 - Math.exp(-dt * 3);
    const mobile = isMobile();

    // Mobile: centre the scene, push it back and lift it above the hero copy.
    const xScale = mobile ? 0 : 1;
    const camZ = state.camZ + (mobile ? 6 : 0);
    const yLift = mobile ? 2.4 : 0;
    canvas.style.opacity = String(1 - Math.min(state.dim * (mobile ? 1.8 : 1), 0.7));

    target.set(state.bagX * xScale, state.bagY + yLift, 0);
    hero.position.lerp(target, fast);

    bag.rotation.y = state.bagRot + Math.sin(t * 0.6) * 0.15;
    bag.rotation.x = Math.sin(t * 0.4) * 0.08 + pointer.y * 0.15;
    bag.position.y = Math.sin(t * 1.1) * 0.12;

    ring.rotation.y = state.ringRot + t * 0.12;
    ring.rotation.x = state.tilt;
    const radius = 2.3 * state.spread;
    cards.forEach((card) => {
      const { angle, offset, yBias } = card.userData;
      card.position.set(
        Math.cos(angle) * radius,
        Math.sin(t * 0.8 + offset) * 0.18 + yBias * (state.spread - 0.8) * 0.6,
        Math.sin(angle) * radius
      );
      card.lookAt(camera.position);
    });

    props.children.forEach((m) => {
      const { base, speed, phase } = m.userData;
      m.position.y = base.y + Math.sin(t * speed + phase) * 0.25;
      m.rotation.x += 0.004 * motion;
      m.rotation.y += 0.006 * motion;
    });

    particles.rotation.y = t * 0.02 + state.ringRot * 0.05;

    // Light colours drift from green to teal as you move through the page.
    rimGreen.color.copy(green).lerp(teal, state.hue * 0.6);
    rimTeal.color.copy(teal).lerp(green, state.hue * 0.6);

    camera.position.x += (pointer.x * 0.6 - camera.position.x) * slow;
    camera.position.y += (-pointer.y * 0.4 - camera.position.y) * slow;
    camera.position.z += (camZ - camera.position.z) * fast;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

// ---------------------------------------------------------------------------
// Animation layer: scroll -> state, plus UI reveals
// ---------------------------------------------------------------------------
function initScrollScene() {
  // One explicit fromTo per section range, so scrubbing in either direction is
  // deterministic and tweens never overlap on the same property.
  SECTIONS.forEach((selector, i) => {
    gsap.fromTo(state, { ...KEYFRAMES[i] }, {
      ...KEYFRAMES[i + 1],
      ease: 'none',
      immediateRender: false,
      scrollTrigger: { trigger: selector, start: 'top bottom', end: 'top 25%', scrub: 1 },
    });
  });
}

function initReveals() {
  document.documentElement.classList.add('js-anim');

  gsap.to('.hero .reveal', { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.1, delay: 0.2 });

  ScrollTrigger.batch('main section:not(.hero) .reveal', {
    start: 'top 88%',
    onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08, overwrite: true }),
  });

  document.querySelectorAll('[data-count]').forEach((el) => {
    const end = Number(el.dataset.count);
    const { prefix = '', suffix = '' } = el.dataset;
    const counter = { v: 0 };
    el.textContent = `${prefix}0${suffix}`;
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => gsap.to(counter, {
        v: end, duration: 1.8, ease: 'power2.out',
        onUpdate: () => { el.textContent = `${prefix}${Math.round(counter.v)}${suffix}`; },
      }),
    });
  });
}

function initForm() {
  // Front-end only: connect this to your form backend (e.g. Formspree, Netlify Forms or a Shopify app).
  const form = document.getElementById('contact-form');
  const status = form.querySelector('.form-status');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    status.textContent = 'Thanks! We’ll be in touch within one business day.';
    form.reset();
  });
}

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------
window.addEventListener('pointermove', (e) => {
  pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
});

try {
  const ctx = createScene(document.getElementById('scene'));
  startLoop(ctx);
  initScrollScene();
} catch (err) {
  console.warn('WebGL unavailable, showing static background.', err);
  document.documentElement.classList.add('no-webgl');
}

if (reducedMotion) {
  document.querySelectorAll('[data-count]').forEach((el) => {
    el.textContent = `${el.dataset.prefix || ''}${el.dataset.count}${el.dataset.suffix || ''}`;
  });
} else {
  initReveals();
}
initForm();

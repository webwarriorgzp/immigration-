// "Three silks, one weave": three long ribbons whose vertices are moved on the
// CPU each frame. state.progress (0..1, driven by ScrollTrigger) blends from
// three separate flowing ribbons into a tight three-strand braid.
import * as THREE from 'three';

const SEG_U = 260, SEG_V = 14;

function makeTexture(src) {
  const tex = new THREE.Texture(src);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.MirroredRepeatWrapping; // hides seams on photo crops
  tex.repeat.set(4, 1);
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  return tex;
}

export function initWeave(canvas, textures, state) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch (e) {
    canvas.style.display = 'none';
    return null;
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0, 14);

  scene.add(new THREE.HemisphereLight(0xfff4ea, 0x5a2030, 1.4));
  const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(4, 6, 8); scene.add(key);
  const rim = new THREE.DirectionalLight(0xffc8d8, 1.4); rim.position.set(-6, -2, -4); scene.add(rim);

  const L = 22, W = 1.25;
  const ribbons = textures.map((src, i) => {
    const tex = makeTexture(src);
    const geo = new THREE.PlaneGeometry(L, W, SEG_U, SEG_V);
    const mat = new THREE.MeshPhysicalMaterial({
      map: tex, side: THREE.DoubleSide, roughness: 0.42, metalness: 0.05,
      sheen: 1, sheenRoughness: 0.35, sheenColor: new THREE.Color(0xffe6c8),
    });
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);
    return { mesh, geo, phase: (i / 3) * Math.PI * 2, baseY: (1 - i) * 2.3 };
  });

  const ease = (x) => x * x * (3 - 2 * x);
  const tmp = new THREE.Vector3();

  function update(t) {
    const p = state.progress;
    const braid = ease(Math.min(1, p / 0.7));         // separate -> braided
    const settle = ease(Math.max(0, (p - 0.7) / 0.3)); // braid tightens & lifts
    const R = THREE.MathUtils.lerp(1.1, 0.55, settle);
    const k = THREE.MathUtils.lerp(0.9, 1.5, settle);  // braid frequency along length

    for (const r of ribbons) {
      const pos = r.geo.attributes.position;
      for (let iv = 0; iv <= SEG_V; iv++) {
        const v = iv / SEG_V - 0.5;
        for (let iu = 0; iu <= SEG_U; iu++) {
          const u = iu / SEG_U;
          const x = (u - 0.5) * L;
          // Free-flowing state: gentle waves, ribbons stacked vertically.
          const wave = Math.sin(u * 7 + t * 0.9 + r.phase) * 0.55 + Math.sin(u * 13 - t * 0.6) * 0.15;
          const fy = r.baseY + wave;
          const fz = Math.cos(u * 5 + t * 0.7 + r.phase) * 0.6;
          // Braided state: helix around a shared axis.
          const a = x * k + r.phase + t * 0.35;
          const by = Math.cos(a) * R + settle * 0.9;
          const bz = Math.sin(a) * R;
          const cy = THREE.MathUtils.lerp(fy, by, braid);
          const cz = THREE.MathUtils.lerp(fz, bz, braid);
          // Ribbon twist: cross-axis rotates around the length axis.
          const twist = THREE.MathUtils.lerp(Math.sin(u * 4 + t * 0.8 + r.phase) * 0.9, a + Math.PI / 2, braid);
          const w = W * THREE.MathUtils.lerp(1, 0.75, braid);
          tmp.set(x, cy + Math.cos(twist) * v * w, cz + Math.sin(twist) * v * w);
          pos.setXYZ(iv * (SEG_U + 1) + iu, tmp.x, tmp.y, tmp.z);
        }
      }
      pos.needsUpdate = true;
      r.geo.computeVertexNormals();
    }
    scene.rotation.z = THREE.MathUtils.lerp(-0.12, 0, braid);
    scene.rotation.y = Math.sin(t * 0.2) * 0.08;
  }

  function resize() {
    const { clientWidth: w, clientHeight: h } = canvas;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.position.z = w < 700 ? 22 : 14;
    camera.updateProjectionMatrix();
  }
  addEventListener('resize', resize);
  resize();

  let active = false, raf = 0;
  const clock = new THREE.Clock();
  function loop() {
    if (!active) return;
    update(clock.getElapsedTime());
    renderer.render(scene, camera);
    raf = requestAnimationFrame(loop);
  }
  update(0); renderer.render(scene, camera);

  return {
    setTexture(i, src) {
      const m = ribbons[i].mesh.material;
      m.map?.dispose(); m.map = makeTexture(src); m.needsUpdate = true;
      if (!active) renderer.render(scene, camera);
    },
    setActive(on) {
      if (on === active) return;
      active = on;
      if (on) { resize(); raf = requestAnimationFrame(loop); } else cancelAnimationFrame(raf);
    },
  };
}

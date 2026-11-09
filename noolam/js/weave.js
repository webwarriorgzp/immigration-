// "Three silks, one weave": three threads drift across the screen. Choosing a
// silk unfurls a fabric ribbon along a thread (fill 0..1, left to right). With
// all three chosen, `braid` twists them into one plait; `scatter` flies them off.
// main.js tweens the numbers in `state`; this module only draws them.
import * as THREE from 'three';

const SEG_U = 220, SEG_V = 10, L = 26, W = 1.15;

function makeTexture(src) {
  const tex = new THREE.Texture(src);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.MirroredRepeatWrapping;
  tex.repeat.set(4, 1);
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  return tex;
}

export function initWeave(canvas) {
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); }
  catch (e) { canvas.style.display = 'none'; return null; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  scene.add(new THREE.HemisphereLight(0xfff6ee, 0x6a3040, 1.5));
  const key = new THREE.DirectionalLight(0xffffff, 2.1); key.position.set(3, 6, 9); scene.add(key);
  const rim = new THREE.DirectionalLight(0xffd3df, 1.2); rim.position.set(-6, -3, -4); scene.add(rim);

  const state = { braid: 0, scatter: 0, strands: [0, 1, 2].map(() => ({ fill: 0 })) };
  const ease = (x) => x * x * (3 - 2 * x);

  const strands = state.strands.map((s, i) => {
    const geo = new THREE.PlaneGeometry(L, W, SEG_U, SEG_V);
    const mat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, side: THREE.DoubleSide, roughness: 0.48, metalness: 0.04, sheen: 1, sheenRoughness: 0.4, sheenColor: new THREE.Color(0xfff0dc) });
    const mesh = new THREE.Mesh(geo, mat); mesh.visible = false; scene.add(mesh);
    const lgeo = new THREE.BufferGeometry();
    lgeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array((SEG_U + 1) * 3), 3));
    const line = new THREE.Line(lgeo, new THREE.LineBasicMaterial({ color: 0x4c4550, transparent: true, opacity: 0.55 }));
    scene.add(line);
    return { geo, mat, mesh, line, phase: (i / 3) * Math.PI * 2, s };
  });

  const centre = (st, u, t, i) => {
    const x = (u - 0.5) * L;
    const braid = ease(state.braid);
    const fy = Math.sin(u * 5.2 + t * 0.55 + st.phase) * 0.85 + Math.sin(u * 11 - t * 0.4 + i) * 0.12;
    const fz = Math.cos(u * 4 + t * 0.45 + st.phase) * 0.55;
    const a = x * 1.05 + st.phase + t * 0.5;
    const R = 0.62;
    let y = fy + (Math.cos(a) * R - fy) * braid;
    let z = fz + (Math.sin(a) * R - fz) * braid;
    const sc = ease(state.scatter);
    y += (i - 1) * 3.2 * sc + Math.sin(u * 9 + i) * sc;
    return { x: x + sc * 22 * (0.6 + u), y, z, a };
  };

  function update(t) {
    const braid = ease(state.braid);
    strands.forEach((st, i) => {
      const fill = st.s.fill;
      const lp = st.line.geometry.attributes.position;
      for (let iu = 0; iu <= SEG_U; iu++) {
        const u = iu / SEG_U; const c = centre(st, u, t, i);
        lp.setXYZ(iu, c.x, c.y, c.z);
      }
      lp.needsUpdate = true;
      st.line.material.opacity = 0.55 * (1 - Math.min(1, fill * 1.4)) * (1 - state.scatter);
      st.mesh.visible = fill > 0.001;
      if (!st.mesh.visible) return;
      const pos = st.geo.attributes.position;
      for (let iu = 0; iu <= SEG_U; iu++) {
        const u = iu / SEG_U; const c = centre(st, u, t, i);
        const reveal = Math.max(0, Math.min(1, (fill * 1.18 - u) / 0.18));
        const w = W * ease(reveal) * (1 - 0.25 * braid);
        const twist = Math.sin(u * 3 + t * 0.7 + st.phase) * 1.1 * (1 - braid) + (c.a + Math.PI / 2) * braid;
        const cy = Math.cos(twist), cz = Math.sin(twist);
        for (let iv = 0; iv <= SEG_V; iv++) {
          const v = iv / SEG_V - 0.5;
          pos.setXYZ(iv * (SEG_U + 1) + iu, c.x, c.y + cy * v * w, c.z + cz * v * w);
        }
      }
      pos.needsUpdate = true;
      st.geo.computeVertexNormals();
    });
    scene.rotation.z = -0.06 * (1 - braid);
  }

  function resize() {
    const { clientWidth: w, clientHeight: h } = canvas;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.position.set(0, 0.4, w < 700 ? 30 : 17);
    camera.lookAt(0, 0.2, 0);
    camera.updateProjectionMatrix();
  }
  addEventListener('resize', resize); resize();

  let active = false, raf = 0;
  const clock = new THREE.Clock();
  const frame = () => { if (!active) return; update(clock.getElapsedTime()); renderer.render(scene, camera); raf = requestAnimationFrame(frame); };
  update(0); renderer.render(scene, camera);

  return {
    state,
    setTexture(i, src) {
      const m = strands[i].mat; m.map?.dispose(); m.map = makeTexture(src); m.needsUpdate = true;
    },
    setActive(on) {
      if (on === active) return; active = on;
      if (on) { resize(); raf = requestAnimationFrame(frame); } else cancelAnimationFrame(raf);
    },
  };
}

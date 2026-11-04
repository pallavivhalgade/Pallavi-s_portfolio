import * as THREE from './assets/three.module.min.js';

const host = document.querySelector('.hero-orb');
const canvas = document.querySelector('#hero-orb-canvas');
const button = document.querySelector('#hero-motion');
const page = document.documentElement;
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
let userPaused = false;
try { userPaused = localStorage.getItem('pv-hero-motion') === 'paused'; } catch {}
let renderer, scene, camera, network, satellites, frame = null;
let visible = true, last = 0, elapsed = 0, angle = .15;
let targetX = 0, targetY = 0, tiltX = 0, tiltY = 0;
let dragging = false, previousX = 0, previousY = 0;
const paused = () => userPaused || reduced.matches;

function controls() {
  page.dataset.heroMotion = paused() ? 'paused' : 'playing';
  button.disabled = reduced.matches;
  button.textContent = reduced.matches ? 'Motion reduced' : userPaused ? 'Play 3D' : 'Pause 3D';
  button.setAttribute('aria-label', reduced.matches ? '3D motion is reduced by your system preference' : userPaused ? 'Play hero 3D animation' : 'Pause hero 3D animation');
  button.setAttribute('aria-pressed', String(paused()));
}
function draw() { if (renderer && !renderer.getContext().isContextLost()) renderer.render(scene, camera); }
function pose() {
  if (!network) return;
  network.rotation.set(.25 + tiltY, angle + tiltX, -.18);
  satellites.forEach((sphere, index) => {
    const phase = elapsed * (.42 + index * .06) + index * Math.PI / 2;
    sphere.position.set(Math.cos(phase) * 1.65, Math.sin(phase) * 1.2, Math.sin(phase + index) * .9);
  });
}
function stop() { if (frame !== null) cancelAnimationFrame(frame); frame = null; last = 0; }
function tick(time) {
  frame = null;
  if (paused() || !visible || document.hidden) return;
  if (!last) last = time;
  if (time - last >= 1000 / 30) {
    const delta = Math.min((time - last) / 1000, .08); last = time; elapsed += delta;
    if (!dragging) angle += delta * .22;
    tiltX += (targetX - tiltX) * .075; tiltY += (targetY - tiltY) * .075;
    pose(); draw();
  }
  frame = requestAnimationFrame(tick);
}
function start() { if (renderer && !renderer.getContext().isContextLost() && frame === null && !paused() && visible && !document.hidden) { last = 0; frame = requestAnimationFrame(tick); } }
function refresh() { controls(); stop(); pose(); draw(); start(); }

button.addEventListener('click', () => {
  userPaused = !userPaused;
  try { localStorage.setItem('pv-hero-motion', userPaused ? 'paused' : 'playing'); } catch {}
  refresh();
});
reduced.addEventListener('change', () => { targetX = 0; targetY = 0; tiltX = 0; tiltY = 0; refresh(); });
document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else start(); });

// Off-screen CSS models stay paused, as does the hero's WebGL renderer.
const models = [...document.querySelectorAll('.project-visual')];
models.forEach(element => { element.dataset.float3d = ''; });
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.target === host) {
        visible = entry.isIntersecting; page.dataset.heroVisible = String(visible);
        if (visible) start(); else stop();
      } else entry.target.classList.toggle('model-in-view', entry.isIntersecting);
    });
  }, { rootMargin: '35px', threshold: .02 });
  observer.observe(host); models.forEach(element => observer.observe(element));
} else models.forEach(element => element.classList.add('model-in-view'));
controls();

try {
  renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.15;
  scene = new THREE.Scene(); camera = new THREE.PerspectiveCamera(34, 1, .1, 40); camera.position.set(0, 0, 7.4);
  scene.add(new THREE.HemisphereLight(0xe7f7ff, 0x24476c, 2));
  const key = new THREE.DirectionalLight(0xffffff, 4.5); key.position.set(-3, 5, 4); scene.add(key);
  const rim = new THREE.DirectionalLight(0x72dacc, 3.5); rim.position.set(3, -1, 3); scene.add(rim);
  network = new THREE.Group(); scene.add(network);
  const blue = new THREE.MeshPhysicalMaterial({ color: 0x2e7bd4, metalness: .35, roughness: .2, clearcoat: 1 });
  const teal = new THREE.MeshStandardMaterial({ color: 0x57cfb7, metalness: .2, roughness: .25, emissive: 0x164c45, emissiveIntensity: .15 });
  const silver = new THREE.MeshStandardMaterial({ color: 0xd8efff, metalness: .5, roughness: .22 });
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(.64, 1), blue);
  core.rotation.set(.4, .4, .2); network.add(core);
  const points = [];
  const count = 52, golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2, radius = Math.sqrt(1 - y * y), a = golden * i;
    points.push(new THREE.Vector3(Math.cos(a) * radius, y, Math.sin(a) * radius).multiplyScalar(1.25));
  }
  const nodes = new THREE.InstancedMesh(new THREE.SphereGeometry(.046, 10, 8), silver, count);
  const matrix = new THREE.Matrix4(); points.forEach((point, i) => { matrix.makeTranslation(point.x, point.y, point.z); nodes.setMatrixAt(i, matrix); }); network.add(nodes);
  const connections = [];
  points.forEach((a, i) => points.slice(i + 1).forEach(b => { if (a.distanceTo(b) < .69) connections.push(a.x, a.y, a.z, b.x, b.y, b.z); }));
  const graph = new THREE.BufferGeometry(); graph.setAttribute('position', new THREE.Float32BufferAttribute(connections, 3));
  network.add(new THREE.LineSegments(graph, new THREE.LineBasicMaterial({ color: 0x4e99de, transparent: true, opacity: .55 })));
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.65, .028, 10, 100), silver);
  ring.rotation.set(.9, .28, .1); network.add(ring);
  const ringTwo = new THREE.Mesh(new THREE.TorusGeometry(1.48, .018, 8, 100), teal);
  ringTwo.rotation.set(-.75, .65, -.2); network.add(ringTwo);
  satellites = Array.from({ length: 4 }, (_, i) => {
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(i ? .09 : .14, 16, 12), i % 2 ? blue : teal);
    network.add(sphere); return sphere;
  });
  const resize = () => {
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false); camera.aspect = width / height; camera.updateProjectionMatrix(); pose(); draw();
  };
  new ResizeObserver(resize).observe(host); resize();
  canvas.addEventListener('pointerdown', e => {
    dragging = true; previousX = e.clientX; previousY = e.clientY;
    if (e.pointerType !== 'touch') canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener('pointermove', e => {
    if (dragging) {
      angle += (e.clientX - previousX) * .014;
      targetY = THREE.MathUtils.clamp(targetY + (e.clientY - previousY) * .008, -.6, .6);
      previousX = e.clientX; previousY = e.clientY;
      if (paused()) { tiltY = targetY; pose(); draw(); }
    } else if (!paused() && finePointer.matches && e.pointerType !== 'touch') {
      const bounds = canvas.getBoundingClientRect();
      targetX = ((e.clientX - bounds.left) / bounds.width - .5) * .45;
      targetY = ((e.clientY - bounds.top) / bounds.height - .5) * .4;
    }
  }, { passive: true });
  const release = () => { dragging = false; };
  canvas.addEventListener('pointerup', release); canvas.addEventListener('pointercancel', release);
  canvas.addEventListener('pointerleave', () => { release(); targetX = 0; targetY = 0; });
  canvas.addEventListener('keydown', e => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home'].includes(e.key)) return;
    e.preventDefault();
    if (e.key === 'Home') { angle = .15; tiltX = 0; tiltY = 0; targetX = 0; targetY = 0; }
    else { angle += e.key === 'ArrowRight' ? .2 : e.key === 'ArrowLeft' ? -.2 : 0; targetY = THREE.MathUtils.clamp(targetY + (e.key === 'ArrowUp' ? -.15 : e.key === 'ArrowDown' ? .15 : 0), -.6, .6); tiltY = targetY; }
    pose(); draw();
  });
  canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); stop(); canvas.hidden = true; host.dataset.renderer = 'fallback'; host.querySelector('.hero-orb-label').textContent = '3D VISUAL'; });
  canvas.addEventListener('webglcontextrestored', () => { canvas.hidden = false; host.dataset.renderer = 'webgl'; host.querySelector('.hero-orb-label').textContent = 'DRAG TO EXPLORE'; refresh(); });
  host.dataset.renderer = 'webgl'; host.querySelector('.hero-orb-label').textContent = 'DRAG TO EXPLORE'; refresh();
} catch {
  stop(); renderer?.dispose(); renderer = null; canvas.hidden = true; host.dataset.renderer = 'fallback'; host.querySelector('.hero-orb-label').textContent = '3D VISUAL';
}

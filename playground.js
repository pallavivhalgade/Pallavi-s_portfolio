import * as THREE from './assets/three.module.min.js';
import { createSculptures } from './sculptures.js';
const canvas = document.querySelector('#neural-canvas'), host = document.querySelector('#scene');
const pauseButton = document.querySelector('#motion'), scatterButton = document.querySelector('#scatter');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
let renderer, camera, scene, root, groups, objects, frame = null, lastTime = 0, visible = true;
let paused = reduceMotion.matches, scattered = false, expansion = 0, dragging = false, lastX = 0, lastY = 0, distance = 8.2;
const names = { orbit: 'Petal sculpture', network: 'Connected helix', wave: 'Flowing wave' };
function pauseLabel() { pauseButton.textContent = paused ? '▷' : 'Ⅱ'; pauseButton.setAttribute('aria-label', paused ? 'Play 3D animation' : 'Pause 3D animation'); pauseButton.title = paused ? 'Play animation' : 'Pause animation'; }
function positionObjects() { objects.forEach(mesh => mesh.position.copy(mesh.userData.base).addScaledVector(mesh.userData.direction, expansion * .75)); camera.position.z = distance + expansion * 2; }
function draw() { if (renderer && !renderer.getContext().isContextLost()) renderer.render(scene, camera); }
function tick(time) {
  frame = null; if (paused || !visible || document.hidden) return;
  const delta = Math.min((time - lastTime) / 1000, .05); lastTime = time;
  root.rotation.y += delta * .12; root.rotation.z = Math.sin(time * .0002) * .045;
  expansion = THREE.MathUtils.lerp(expansion, scattered ? 1 : 0, 1 - Math.exp(-delta * 5)); positionObjects(); draw(); frame = requestAnimationFrame(tick);
}
function start() { if (!frame && !paused && visible && !document.hidden && renderer) { lastTime = performance.now(); frame = requestAnimationFrame(tick); } }
function stop() { if (frame) cancelAnimationFrame(frame); frame = null; }
pauseLabel();
try {
  renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7)); renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.1;
  scene = new THREE.Scene(); camera = new THREE.PerspectiveCamera(34, 1, .1, 80); camera.position.set(0, 0, distance);
  // A generated studio panorama gives the chrome broad, legible reflections.
  const studio = document.createElement('canvas'); studio.width = 1024; studio.height = 512;
  const context = studio.getContext('2d'); context.fillStyle = '#171721'; context.fillRect(0, 0, 1024, 512);
  context.fillStyle = '#ffffff'; context.fillRect(95, 80, 125, 330); context.fillRect(700, 130, 210, 100);
  context.fillStyle = '#a4b7e4'; context.fillRect(350, 100, 90, 360); context.fillStyle = '#c4a8df'; context.fillRect(520, 250, 140, 180);
  const studioTexture = new THREE.CanvasTexture(studio); studioTexture.mapping = THREE.EquirectangularReflectionMapping; studioTexture.colorSpace = THREE.SRGBColorSpace;
  const pmrem = new THREE.PMREMGenerator(renderer); const environment = pmrem.fromEquirectangular(studioTexture).texture; studioTexture.dispose(); pmrem.dispose();
  scene.add(new THREE.HemisphereLight(0xcbd0ff, 0x1d0c0a, 2.2));
  const key = new THREE.DirectionalLight(0xffeee4, 4); key.position.set(-3, 4, 5); scene.add(key);
  const rim = new THREE.DirectionalLight(0xa9b4eb, 3); rim.position.set(3, -1, 1); scene.add(rim);
  root = new THREE.Group(); root.rotation.set(.2, -.35, 0); scene.add(root);
  ({ groups, objects } = createSculptures(environment));
  Object.entries(groups).forEach(([name, group]) => { group.visible = name === 'orbit'; root.add(group); });
  function resize() { const { width, height } = host.getBoundingClientRect(); if (!width || !height) return; renderer.setSize(width, height, false); camera.aspect = width / height; distance = camera.aspect < .8 ? 9.8 : 8.2; camera.updateProjectionMatrix(); positionObjects(); draw(); }
  new ResizeObserver(resize).observe(host); resize(); document.querySelector('.hero-visual').classList.add('webgl-ready');
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; if (visible) start(); else stop(); }, { rootMargin: '30px' }).observe(host);
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else start(); });
  pauseButton.addEventListener('click', () => { paused = !paused; pauseLabel(); if (paused) stop(); else start(); });
  reduceMotion.addEventListener('change', () => { paused = reduceMotion.matches; pauseLabel(); if (paused) { stop(); expansion = scattered ? 1 : 0; positionObjects(); draw(); } else start(); });
  document.querySelectorAll('[data-shape]').forEach(button => button.addEventListener('click', () => {
    Object.entries(groups).forEach(([name, group]) => { group.visible = name === button.dataset.shape; });
    document.querySelectorAll('[data-shape]').forEach(b => { b.classList.toggle('active', b === button); b.setAttribute('aria-pressed', String(b === button)); });
    document.querySelector('.visual-index').textContent = names[button.dataset.shape]; draw();
  }));
  scatterButton.addEventListener('click', () => { scattered = !scattered; scatterButton.setAttribute('aria-pressed', String(scattered)); scatterButton.textContent = scattered ? 'Reassemble ↙' : 'Scatter ↗'; if (paused) { expansion = scattered ? 1 : 0; positionObjects(); draw(); } });
  canvas.addEventListener('pointerdown', e => { dragging = true; lastX = e.clientX; lastY = e.clientY; if (e.pointerType !== 'touch') canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener('pointermove', e => { if (!dragging) return; root.rotation.y += (e.clientX - lastX) * .008; root.rotation.x = THREE.MathUtils.clamp(root.rotation.x + (e.clientY - lastY) * .006, -1.2, 1.2); lastX = e.clientX; lastY = e.clientY; draw(); });
  const release = () => { dragging = false; }; window.addEventListener('pointerup', release); canvas.addEventListener('pointercancel', release); canvas.addEventListener('pointerleave', release);
  canvas.addEventListener('keydown', e => { if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) return; e.preventDefault(); root.rotation.y += e.key === 'ArrowLeft' ? -.12 : e.key === 'ArrowRight' ? .12 : 0; root.rotation.x += e.key === 'ArrowUp' ? -.12 : e.key === 'ArrowDown' ? .12 : 0; draw(); });
  canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); stop(); document.querySelector('.hero-visual').classList.remove('webgl-ready'); });
  canvas.addEventListener('webglcontextrestored', () => { document.querySelector('.hero-visual').classList.add('webgl-ready'); draw(); start(); });
  draw(); start();
} catch {
  stop(); renderer?.dispose(); canvas.hidden = true;
  document.querySelector('.scene-controls').hidden = true; scatterButton.hidden = true;
  document.querySelector('.drag-hint').textContent = 'HUMAN IDEAS. MACHINE INTELLIGENCE.';
}

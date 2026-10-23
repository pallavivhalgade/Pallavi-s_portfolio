import { pointerPose, keyboardPose } from './portrait-math.js';
const card = document.querySelector('#portrait-card'), stage = document.querySelector('.portrait-stage');
const resetButton = document.querySelector('#portrait-reset');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)'), finePointer = matchMedia('(hover: hover) and (pointer: fine)');
let pose = { rx: reducedMotion.matches ? 0 : 4, ry: reducedMotion.matches ? 0 : -7, gx: 35, gy: 30 }, pending = null, tap = 0;
function apply(next) {
  pose = next; card.style.setProperty('--portrait-rx', `${pose.rx.toFixed(2)}deg`); card.style.setProperty('--portrait-ry', `${pose.ry.toFixed(2)}deg`);
  card.style.setProperty('--portrait-gx', `${pose.gx.toFixed(1)}%`); card.style.setProperty('--portrait-gy', `${pose.gy.toFixed(1)}%`);
}
function cancelPending() { if (pending) cancelAnimationFrame(pending); pending = null; }
function reset() { cancelPending(); card.dataset.tracking = 'false'; tap = 0; apply({ rx: 0, ry: 0, gx: 50, gy: 50 }); }
card.addEventListener('pointermove', e => {
  if (reducedMotion.matches || !finePointer.matches || e.pointerType === 'touch') return;
  const next = pointerPose(e.clientX, e.clientY, stage.getBoundingClientRect());
  cancelPending(); card.dataset.tracking = 'true'; pending = requestAnimationFrame(() => { pending = null; apply(next); });
});
card.addEventListener('pointerleave', () => { cancelPending(); card.dataset.tracking = 'false'; apply({ rx: reducedMotion.matches ? 0 : 4, ry: reducedMotion.matches ? 0 : -7, gx: 35, gy: 30 }); });
card.addEventListener('click', () => { cancelPending(); card.dataset.tracking = 'false'; tap = (tap + 1) % 3; apply(tap === 1 ? { rx: 5, ry: 10, gx: 70, gy: 25 } : tap === 2 ? { rx: -4, ry: -10, gx: 25, gy: 70 } : { rx: 0, ry: 0, gx: 50, gy: 50 }); });
card.addEventListener('keydown', e => { if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'Escape'].includes(e.key)) return; e.preventDefault(); cancelPending(); card.dataset.tracking = 'false'; apply(keyboardPose(pose, e.key)); });
card.addEventListener('blur', reset); resetButton.addEventListener('click', reset);
reducedMotion.addEventListener('change', reset); apply(pose);

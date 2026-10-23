const section = document.querySelector('#stack');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
let active = null, pending = null, touchCard = null;
const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
function reset() {
  if (pending) cancelAnimationFrame(pending); pending = null;
  if (active) { active.style.removeProperty('--tech-rx'); active.style.removeProperty('--tech-ry'); }
  active = null;
}
section.addEventListener('pointermove', e => {
  if (reducedMotion.matches || !finePointer.matches || e.pointerType === 'touch') return;
  const card = e.target.closest('.tech-card'); if (!card) { reset(); return; }
  if (active !== card) { reset(); active = card; }
  const bounds = card.getBoundingClientRect(); if (!bounds.width || !bounds.height) return;
  const rx = clamp((e.clientY - bounds.top) / bounds.height - .5, -.5, .5) * -10;
  const ry = clamp((e.clientX - bounds.left) / bounds.width - .5, -.5, .5) * 12;
  if (pending) cancelAnimationFrame(pending);
  pending = requestAnimationFrame(() => { pending = null; if (active !== card) return; card.style.setProperty('--tech-rx', `${rx.toFixed(2)}deg`); card.style.setProperty('--tech-ry', `${ry.toFixed(2)}deg`); });
}, { passive:true });
section.addEventListener('pointerout', e => { if (active && !active.contains(e.relatedTarget)) reset(); });
section.addEventListener('pointerleave', reset);
section.addEventListener('focusout', e => { if (active && active.contains(e.target)) reset(); });
section.addEventListener('pointerdown', e => { if (e.pointerType !== 'touch') return; touchCard = e.target.closest('.tech-card'); touchCard?.classList.add('is-pressed'); }, { passive:true });
function releaseTouch() { touchCard?.classList.remove('is-pressed'); touchCard = null; }
window.addEventListener('pointerup', releaseTouch, { passive:true });
window.addEventListener('pointercancel', releaseTouch, { passive:true });
window.addEventListener('blur', () => { reset(); releaseTouch(); });
reducedMotion.addEventListener('change', reset); finePointer.addEventListener('change', reset);
document.addEventListener('visibilitychange', () => { if (document.hidden) { reset(); releaseTouch(); } });

const motionToggle = section.querySelector('.technology-motion-toggle');
motionToggle?.addEventListener('click', () => {
  const paused = section.classList.toggle('is-flow-paused');
  motionToggle.setAttribute('aria-pressed', String(paused));
  motionToggle.textContent = paused ? 'Resume logo flow' : 'Pause logo flow';
});

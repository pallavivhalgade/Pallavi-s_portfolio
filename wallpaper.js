import { contourPoint } from './contour-field.js';
const canvas = document.querySelector('#live-wallpaper');
const modeButton = document.querySelector('#wallpaper-mode'), motionButton = document.querySelector('#wallpaper-motion');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const documentRoot = document.documentElement;
const context = canvas.getContext('2d', { alpha: false });
let mode = 'aurora', paused = reducedMotion.matches, frame = null, elapsed = 0, previous = 0;
let width = 1, height = 1, pointerX = 0, pointerY = 0, driftX = 0, driftY = 0;
try { mode = localStorage.getItem('pv-wallpaper-mode') === 'ocean' ? 'ocean' : 'aurora'; paused ||= localStorage.getItem('pv-wallpaper-paused') === 'true'; } catch {}
function updateControls() {
  documentRoot.dataset.wallpaper = mode; documentRoot.dataset.wallpaperPaused = String(paused);
  modeButton.textContent = mode === 'aurora' ? 'Contours' : 'Orbits';
  modeButton.setAttribute('aria-label', `Switch to ${mode === 'aurora' ? 'orbital' : 'contour'} live wallpaper`);
  modeButton.title = modeButton.getAttribute('aria-label');
  motionButton.textContent = paused ? 'Play' : 'Pause';
  motionButton.setAttribute('aria-label', paused ? 'Play live wallpaper' : 'Pause live wallpaper');
  motionButton.title = motionButton.getAttribute('aria-label'); motionButton.setAttribute('aria-pressed', String(paused));
}
const rgba = (rgb, alpha) => `rgba(${rgb.join(',')},${alpha})`;
function draw(seconds = elapsed) {
  if (!context) return;
  const light = documentRoot.dataset.theme === 'light', orbital = mode === 'ocean';
  const sky = context.createLinearGradient(0,0,width,height);
  sky.addColorStop(0,light?'#fff6ee':'#10121e');
  sky.addColorStop(.55,light?'#f7edf1':'#1c1930');
  sky.addColorStop(1,light?'#edf1fa':'#10252b');
  context.globalCompositeOperation='source-over';context.fillStyle=sky;context.fillRect(0,0,width,height);
  const colours=light?[[99,114,178],[176,105,133],[91,147,144]]:[[157,143,218],[109,174,181],[152,130,191]];
  const count=width<700?16:22;
  for(let layer=0;layer<count;layer++){
    const color=colours[layer%3];
    context.beginPath();
    for(let j=0;j<=100;j++){
      const p=contourPoint(j/100,seconds,layer,mode);
      const x=p.x*width+driftX*(8+layer*.4),y=p.y*height+driftY*(8+layer*.3);
      if(j===0)context.moveTo(x,y);else context.lineTo(x,y);
    }
    if(orbital)context.closePath();
    context.strokeStyle=rgba(color,light?(layer%4===0?.21:.11):(layer%4===0?.22:.1));
    context.lineWidth=layer%4===0?1.1:.65;context.stroke();
  }
  // Three quiet focal points follow the orbital paths.
  if(orbital)for(let i=0;i<3;i++){
    const p=contourPoint((seconds*.007+i/3)%1,seconds,4+i*5,mode);
    context.beginPath();context.arc(p.x*width+driftX*(8+(4+i*5)*.4),p.y*height+driftY*(8+(4+i*5)*.3),2.3,0,Math.PI*2);
    context.fillStyle=rgba(colours[i],light?.5:.6);context.fill();
  }
}
function tick(timestamp) {
  frame = null; if (paused || document.hidden || !context) return;
  if (!previous) previous = timestamp;
  if (timestamp - previous >= 1000 / 24) {
    elapsed += Math.min((timestamp - previous) / 1000, .1); previous = timestamp;
    driftX += (pointerX - driftX) * .04; driftY += (pointerY - driftY) * .04; draw();
  }
  frame = requestAnimationFrame(tick);
}
function start() { if (!frame && !paused && !document.hidden && context) { previous = 0; frame = requestAnimationFrame(tick); } }
function stop() { if (frame) cancelAnimationFrame(frame); frame = null; previous = 0; }
function resize() {
  width = innerWidth; height = innerHeight; const ratio = Math.min(devicePixelRatio, 1.25);
  canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio); context?.setTransform(ratio, 0, 0, ratio, 0, 0); draw();
}
modeButton.addEventListener('click', () => { mode = mode === 'aurora' ? 'ocean' : 'aurora'; try { localStorage.setItem('pv-wallpaper-mode', mode); } catch {} updateControls(); draw(); });
motionButton.addEventListener('click', () => { paused = !paused; try { localStorage.setItem('pv-wallpaper-paused', String(paused)); } catch {} updateControls(); if (paused) stop(); else start(); });
reducedMotion.addEventListener('change', () => { paused = reducedMotion.matches; updateControls(); if (paused) { stop(); draw(); } else start(); });
document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else start(); });
window.addEventListener('resize', resize, { passive: true });
window.addEventListener('pointermove', e => { if (paused || e.pointerType === 'touch') return; pointerX = e.clientX / width - .5; pointerY = e.clientY / height - .5; }, { passive: true });
new MutationObserver(() => draw()).observe(documentRoot, { attributes: true, attributeFilter: ['data-theme'] });
updateControls(); resize(); start();
if (!context) document.querySelector('.wallpaper-controls').hidden = true;

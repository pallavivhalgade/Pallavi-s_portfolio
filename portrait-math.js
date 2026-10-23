const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
export function pointerPose(x, y, bounds) {
  if (!(bounds.width > 0 && bounds.height > 0)) return { rx: 0, ry: 0, gx: 50, gy: 50 };
  const nx = clamp((x - bounds.left) / bounds.width, 0, 1), ny = clamp((y - bounds.top) / bounds.height, 0, 1);
  return { rx: (ny - .5) * -13, ry: (nx - .5) * 19, gx: nx * 100, gy: ny * 100 };
}
export function keyboardPose(pose, key) {
  if (key === 'Home' || key === 'Escape') return { rx: 0, ry: 0, gx: 50, gy: 50 };
  return { ...pose, rx: clamp(pose.rx + (key === 'ArrowUp' ? 3 : key === 'ArrowDown' ? -3 : 0), -9, 9), ry: clamp(pose.ry + (key === 'ArrowRight' ? 3 : key === 'ArrowLeft' ? -3 : 0), -12, 12) };
}

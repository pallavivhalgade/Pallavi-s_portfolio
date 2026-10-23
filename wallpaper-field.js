const fraction = n => n - Math.floor(n);
const seed = n => fraction(Math.sin(n * 127.1 + 311.7) * 43758.5453);

// Normalized coordinates keep the wallpaper continuous at every screen size.
export function ribbonPoint(u, seconds, layer, mode = 'aurora') {
  const ocean = mode === 'ocean';
  const speed = ocean ? .17 : .22;
  const y = .14 + layer * .19
    + Math.sin(u * Math.PI * (ocean ? 2.1 : 1.4) + seconds * speed + layer * .9) * .13
    + Math.cos(u * Math.PI * 4 - seconds * .09 + layer) * .035;
  return { x: u, y, thickness: .075 + Math.sin(u * Math.PI + seconds * .12 + layer) * .025 };
}

export function starSample(index, seconds) {
  const depth = .3 + seed(index + 91) * .7;
  return {
    x: fraction(seed(index + 1) + seconds * .0008 * depth),
    y: fraction(seed(index + 43) - seconds * .0006 * depth),
    radius: .35 + depth * .8,
    alpha: .18 + (.5 + Math.sin(seconds * .45 + index * 2.1) * .5) * .48,
    depth
  };
}

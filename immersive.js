(() => {
  const root = document.documentElement;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const cards = [...document.querySelectorAll('[data-depth]')];
  const clamp = (value, minimum, maximum) => Math.max(minimum, Math.min(maximum, value));
  const resetters = [];
  cards.forEach(card => {
    let frame = null, bounds = null;
    function reset() {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null; bounds = null;
      card.classList.remove('depth-active');
      for (const property of ['--depth-rx', '--depth-ry', '--depth-x', '--depth-y']) card.style.removeProperty(property);
    }
    resetters.push(reset);
    card.addEventListener('pointerenter', event => {
      if (reducedMotion.matches || !finePointer.matches || event.pointerType === 'touch') return;
      bounds = card.getBoundingClientRect();
    }, { passive: true });
    card.addEventListener('pointermove', event => {
      if (reducedMotion.matches || !finePointer.matches || event.pointerType === 'touch') return;
      if (!bounds) bounds = card.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      const x = clamp((event.clientX - bounds.left) / bounds.width, 0, 1);
      const y = clamp((event.clientY - bounds.top) / bounds.height, 0, 1);
      const depth = clamp(Number(card.dataset.depth) || 3, 0, 8);
      if (frame !== null) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        frame = null;
        card.classList.add('depth-active');
        card.style.setProperty('--depth-rx', `${((.5 - y) * depth).toFixed(2)}deg`);
        card.style.setProperty('--depth-ry', `${((x - .5) * depth).toFixed(2)}deg`);
        card.style.setProperty('--depth-x', `${(x * 100).toFixed(1)}%`);
        card.style.setProperty('--depth-y', `${(y * 100).toFixed(1)}%`);
      });
    }, { passive: true });
    card.addEventListener('pointerleave', reset);
    card.addEventListener('pointercancel', reset);
  });
  const resetAll = () => resetters.forEach(reset => reset());
  reducedMotion.addEventListener('change', resetAll);
  finePointer.addEventListener('change', resetAll);
  window.addEventListener('blur', resetAll);
  window.addEventListener('resize', resetAll, { passive: true });
  document.addEventListener('visibilitychange', () => { if (document.hidden) resetAll(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') resetAll(); });

  const reveals = [...document.querySelectorAll('[data-reveal]')];
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .07, rootMargin: '0px 0px 35px 0px' });
    reveals.forEach(element => observer.observe(element));
    root.classList.add('effects-ready');
    reducedMotion.addEventListener('change', () => {
      if (reducedMotion.matches) {
        observer.disconnect();
        reveals.forEach(element => element.classList.add('is-visible'));
      }
    });
  }
  let scrollFrame = null;
  function updateProgress() {
    scrollFrame = null;
    const scrollable = root.scrollHeight - innerHeight;
    const progress = scrollable > 0 ? clamp(scrollY / scrollable, 0, 1) : 0;
    root.style.setProperty('--reading-progress', progress.toFixed(4));
  }
  function queueProgress() {
    if (scrollFrame === null) scrollFrame = requestAnimationFrame(updateProgress);
  }
  window.addEventListener('scroll', queueProgress, { passive: true });
  window.addEventListener('resize', queueProgress, { passive: true });
  updateProgress();
})();

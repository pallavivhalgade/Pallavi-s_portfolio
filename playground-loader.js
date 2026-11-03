// Keep the optional 3D playground off the initial page-loading path.
const playground = document.querySelector('#playground');
let loading = false;
function loadPlayground() {
  if (loading) return;
  loading = true;
  import('./playground.js').catch(() => {
    const hint = playground.querySelector('.drag-hint');
    if (hint) hint.textContent = 'The interactive preview is unavailable. Explore the projects below.';
    playground.querySelectorAll('button').forEach(button => { button.disabled = true; });
  });
}
if (playground) {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        observer.disconnect();
        loadPlayground();
      }
    }, { rootMargin: '300px' });
    observer.observe(playground);
    playground.addEventListener('focusin', () => {
      observer.disconnect();
      loadPlayground();
    }, { once: true });
  } else {
    loadPlayground();
  }
}

const certificateButtons = [...document.querySelectorAll('[data-certificate-filter]')];
const certificateCards = [...document.querySelectorAll('[data-certificate-category]')];
const certificateCount = document.querySelector('.certificate-count');

certificateButtons.forEach(button => {
  button.addEventListener('click', () => {
    const category = button.dataset.certificateFilter;
    certificateButtons.forEach(option => {
      const selected = option === button;
      option.classList.toggle('active', selected);
      option.setAttribute('aria-pressed', String(selected));
    });
    let visible = 0;
    certificateCards.forEach(card => {
      card.hidden = category !== 'all' && card.dataset.certificateCategory !== category;
      if (!card.hidden) visible++;
    });
    if (certificateCount) certificateCount.textContent = `${visible} ${visible === 1 ? 'credential' : 'credentials'}`;
  });
});

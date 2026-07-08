(function () {
  const trigger = document.getElementById('profileTrigger');
  const lightbox = document.getElementById('profileLightbox');
  const windowEl = document.getElementById('profileWindow');
  const backdrop = document.getElementById('profileBackdrop');
  const closeBtn = document.getElementById('profileClose');
  if (!trigger || !lightbox || !windowEl) return;

  let isOpen = false;

  const setOrigin = () => {
    const rect = trigger.getBoundingClientRect();
    windowEl.style.setProperty('--profile-x', `${rect.left + rect.width / 2}px`);
    windowEl.style.setProperty('--profile-y', `${rect.top + rect.height / 2}px`);
  };

  const open = () => {
    if (isOpen) return;
    isOpen = true;
    setOrigin();
    lightbox.classList.remove('closing');
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('profile-open');

    if (window.lucide && closeBtn) lucide.createIcons({ nodes: [closeBtn] });

    requestAnimationFrame(() => {
      windowEl.style.setProperty('--profile-x', '50%');
      windowEl.style.setProperty('--profile-y', '50%');
    });
  };

  const close = () => {
    if (!isOpen) return;
    isOpen = false;
    lightbox.classList.add('closing');
    setOrigin();
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('profile-open');

    setTimeout(() => lightbox.classList.remove('closing'), 420);
  };

  trigger.addEventListener('click', open);
  backdrop.addEventListener('click', close);
  closeBtn.addEventListener('click', close);
  lightbox.querySelector('.dot.red')?.addEventListener('click', close);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) close();
  });

  window.addEventListener('resize', () => {
    if (isOpen) {
      windowEl.style.setProperty('--profile-x', '50%');
      windowEl.style.setProperty('--profile-y', '50%');
    }
  });
})();

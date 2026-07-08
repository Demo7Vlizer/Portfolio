(function () {
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (!nav || !toggle || !links) return;

  const setOpen = (open) => {
    links.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';

    if (window.lucide) {
      const icon = toggle.querySelector('.nav-toggle-icon');
      if (icon) {
        icon.setAttribute('data-lucide', open ? 'x' : 'menu');
        lucide.createIcons({ nodes: [icon.parentElement] });
      }
    }
  };

  toggle.addEventListener('click', () => setOpen(!links.classList.contains('open')));

  links.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => setOpen(false));
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 720) setOpen(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });
})();

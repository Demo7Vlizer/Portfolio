(function () {
  const sections = [...document.querySelectorAll('section, footer')].filter((s) => s.id);
  const links = [...document.querySelectorAll('.nav-links a')];
  if (!sections.length || !links.length) return;

  const map = Object.fromEntries(
    links.map((a) => [a.getAttribute('href').replace('#', ''), a])
  );

  let activeId = '';

  const setActive = (id) => {
    if (!id || id === activeId) return;
    activeId = id;
    links.forEach((l) => l.classList.remove('active'));
    const link = map[id];
    if (link) link.classList.add('active');
  };

  const io = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visible[0]) setActive(visible[0].target.id);
    },
    { rootMargin: '-42% 0px -50% 0px', threshold: [0, 0.15, 0.4] }
  );

  sections.forEach((s) => io.observe(s));
})();

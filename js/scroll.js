(function () {
  const bar = document.getElementById('scrollBar');
  const nav = document.getElementById('nav');
  const root = document.documentElement;
  let mouseX = 0;
  let mouseY = 0;
  const canHover = matchMedia('(hover: hover)').matches;

  if (canHover) {
    window.addEventListener('mousemove', (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      mouseX = (e.clientX - cx) * 0.02;
      mouseY = (e.clientY - cy) * 0.02;
      updateMotion();
    }, { passive: true });
  }

  const updateMotion = () => {
    const h = document.documentElement;
    const y = h.scrollTop;
    const pct = y / (h.scrollHeight - h.clientHeight);
    bar.style.transform = `scaleX(${pct})`;
    nav.classList.toggle('stuck', y > 40);
    root.style.setProperty('--blob-a-y', `${y * 0.25 + mouseY}px`);
    root.style.setProperty('--blob-b-y', `${y * -0.12 - mouseY * 0.6}px`);
    root.style.setProperty('--mouse-x', `${mouseX}px`);
    root.style.setProperty('--mouse-y', `${mouseY}px`);
  };

  window.addEventListener('scroll', updateMotion, { passive: true });
  updateMotion();
})();

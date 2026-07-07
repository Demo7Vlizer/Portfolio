(function () {
  const bar = document.getElementById('scrollBar');
  const nav = document.getElementById('nav');

  const onScroll = () => {
    const h = document.documentElement;
    const pct = h.scrollTop / (h.scrollHeight - h.clientHeight);
    bar.style.transform = `scaleX(${pct})`;
    nav.classList.toggle('stuck', h.scrollTop > 40);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const blobA = document.getElementById('blobA');
  const blobB = document.getElementById('blobB');

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    blobA.style.transform = `translateY(${y * 0.25}px)`;
    blobB.style.transform = `translateY(${y * -0.12}px)`;
  }, { passive: true });
})();

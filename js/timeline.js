(function () {
  const tlItems = document.querySelectorAll('.tl-item');
  const tlFill = document.getElementById('tlFill');
  const tl = document.getElementById('tl');

  const tlIo = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
  }, { threshold: 0.4 });
  tlItems.forEach(it => tlIo.observe(it));

  const updateFill = () => {
    const rect = tl.getBoundingClientRect();
    const vh = window.innerHeight;
    const start = rect.top - vh * 0.5;
    const total = rect.height;
    let p = Math.min(Math.max(-start / total, 0), 1);
    tlFill.style.height = (p * (total - 16)) + 'px';
  };

  window.addEventListener('scroll', updateFill, { passive: true });
  updateFill();
})();

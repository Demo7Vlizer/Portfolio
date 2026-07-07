(function () {
  const counted = new Set();

  const countIo = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && !counted.has(e.target)) {
        counted.add(e.target);
        const el = e.target;
        const target = +el.dataset.count;
        const suffix = el.dataset.suffix || '';
        const dur = 1400;
        const t0 = performance.now();
        const step = (t) => {
          const p = Math.min((t - t0) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 4);
          el.innerHTML = Math.round(eased * target) + (suffix ? `<small>${suffix}</small>` : '');
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    });
  }, { threshold: 0.6 });

  document.querySelectorAll('[data-count]').forEach(el => countIo.observe(el));
})();

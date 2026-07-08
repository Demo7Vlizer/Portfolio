(function () {
  if (typeof pdfjsLib === 'undefined') return;

  pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';

  const viewer = document.getElementById('pdfViewer');
  const backdrop = document.getElementById('pdfBackdrop');
  const closeBtn = document.getElementById('pdfClose');
  const downloadBtn = document.getElementById('pdfDownload');
  const titleEl = document.getElementById('pdfTitle');
  const loadingEl = document.getElementById('pdfLoading');
  const bodyEl = document.getElementById('pdfBody');
  const pagesEl = document.getElementById('pdfPages');
  const panelEl = viewer?.querySelector('.pdf-viewer-panel');
  if (!viewer || !pagesEl || !bodyEl || !panelEl) return;

  let isOpen = false;
  let renderToken = 0;

  const waitForLayout = () => new Promise((resolve) => {
    const done = () => resolve();
    panelEl.addEventListener('transitionend', done, { once: true });
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (bodyEl.clientWidth > 0) resolve();
      });
    });
    setTimeout(done, 520);
  });

  const getContainerWidth = () => {
    const widths = [
      pagesEl.clientWidth,
      bodyEl.clientWidth,
      panelEl.clientWidth
    ].map((w) => w - 32);
    const best = Math.max(...widths.filter((w) => w > 0));
    return best || Math.min(860, window.innerWidth - 80);
  };

  const open = async (url, title, downloadName) => {
    const token = ++renderToken;
    isOpen = true;
    viewer.classList.add('open');
    viewer.removeAttribute('aria-hidden');
    document.body.classList.add('pdf-open');
    titleEl.textContent = title || 'Document';
    downloadBtn.href = encodeURI(url);
    downloadBtn.download = downloadName || 'document.pdf';
    loadingEl.classList.remove('hidden');
    pagesEl.innerHTML = '';

    if (window.lucide) {
      lucide.createIcons({ nodes: [downloadBtn, closeBtn] });
    }

    closeBtn.focus({ preventScroll: true });

    await waitForLayout();
    if (token !== renderToken) return;

    try {
      const pdf = await pdfjsLib.getDocument(encodeURI(url)).promise;
      if (token !== renderToken) return;

      const containerWidth = getContainerWidth();

      for (let n = 1; n <= pdf.numPages; n++) {
        if (token !== renderToken) return;
        const page = await pdf.getPage(n);
        const baseViewport = page.getViewport({ scale: 1 });
        const scale = Math.min(Math.max(containerWidth / baseViewport.width, 0.25), 2.5);
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const displayViewport = page.getViewport({ scale });
        const renderViewport = page.getViewport({ scale: scale * dpr });

        const wrap = document.createElement('div');
        wrap.className = 'pdf-page-wrap';
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = renderViewport.width;
        canvas.height = renderViewport.height;
        canvas.style.width = `${displayViewport.width}px`;
        canvas.style.height = `${displayViewport.height}px`;
        wrap.appendChild(canvas);
        pagesEl.appendChild(wrap);

        await page.render({ canvasContext: ctx, viewport: renderViewport }).promise;
      }

      loadingEl.classList.add('hidden');
    } catch (err) {
      if (token !== renderToken) return;
      loadingEl.classList.add('hidden');
      pagesEl.innerHTML = '<p class="pdf-error">Could not load this document. Use the download button to save it instead.</p>';
    }
  };

  const close = () => {
    renderToken++;
    isOpen = false;
    if (viewer.contains(document.activeElement)) {
      document.activeElement.blur();
    }
    viewer.classList.remove('open');
    viewer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('pdf-open');
    pagesEl.innerHTML = '';
    loadingEl.classList.remove('hidden');
  };

  document.querySelectorAll('.pdf-link').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const url = link.getAttribute('href');
      const title = link.dataset.pdfTitle || link.textContent.trim();
      const name = link.dataset.pdfName || 'document.pdf';
      open(url, title, name);
    });
  });

  backdrop.addEventListener('click', close);
  closeBtn.addEventListener('click', close);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) close();
  });
})();

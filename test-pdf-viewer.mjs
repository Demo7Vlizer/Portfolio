import { chromium } from 'playwright';

const browser = await chromium.launch();
for (const [label, w, h] of [['desktop', 1280, 800], ['mobile', 390, 844]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.goto('http://127.0.0.1:3456/index.html', { waitUntil: 'networkidle' });
  await page.click('a.pdf-link[href*="Resume"]');
  await page.waitForTimeout(2500);
  const dims = await page.evaluate(() => {
    const body = document.getElementById('pdfBody');
    const pages = document.getElementById('pdfPages');
    const panel = document.querySelector('.pdf-viewer-panel');
    const bar = document.querySelector('.pdf-viewer-bar');
    return {
      body: body ? { w: body.clientWidth, h: body.clientHeight } : null,
      pages: pages ? { children: pages.children.length } : null,
      panel: panel ? { w: panel.clientWidth, h: panel.clientHeight } : null,
      bar: bar ? { w: bar.clientWidth, h: bar.clientHeight } : null,
      canvases: document.querySelectorAll('.pdf-page-wrap canvas').length,
    };
  });
  console.log(label, JSON.stringify(dims));
  await page.close();
}
await browser.close();

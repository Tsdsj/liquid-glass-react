/**
 * Replaces "about twenty glass surfaces per screen" with a number that came from somewhere.
 *
 * Drives a real drag on the heaviest page, under CPU throttling, and reports the frame budget
 * from the browser's own frame timings. Throttling is a stand-in for a slow device, not a
 * substitute: it slows the CPU and leaves the GPU alone, so it flatters anything that is really
 * fill-rate bound. Read it as a floor, not a verdict.
 *
 *   pnpm exec node scripts/measure-performance.mjs [url]
 */
import { chromium } from '@playwright/test';

const base = process.argv[2] ?? process.env.MEASURE_URL ?? 'http://127.0.0.1:4173';
const RATES = [1, 4, 6];

const browser = await chromium.launch({ channel: 'chrome' });
const rows = [];

for (const rate of RATES) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const client = await page.context().newCDPSession(page);
  await page.goto(`${base}/#/`);
  await page.waitForTimeout(1200);

  const surfaces = await page.evaluate(() => ({
    glass: document.querySelectorAll('.lg-root[data-renderer="css"], .lg-root[data-renderer="svg"]').length,
    lensed: document.querySelectorAll('.lg-root[data-renderer="svg"]').length,
    blurred: [...document.querySelectorAll('.lg-backdrop')]
      .filter(node => getComputedStyle(node).backdropFilter !== 'none').length,
  }));

  await client.send('Emulation.setCPUThrottlingRate', { rate });
  await page.waitForTimeout(400);

  // Record frame deltas across a drag of the media toolbar's slider — a gesture that repaints
  // glass every frame — rather than an idle page, which measures nothing.
  await page.evaluate(() => {
    const frames = [];
    window.__frames = frames;
    let last = performance.now();
    const tick = now => { frames.push(now - last); last = now; if (frames.length < 240) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  });

  const bar = page.locator('.media-viewer .lg-toolbar-group').first();
  const box = await bar.boundingBox();
  if (box) {
    await page.mouse.move(box.x + 20, box.y + box.height / 2);
    await page.mouse.down();
    for (let i = 0; i < 40; i++) {
      await page.mouse.move(box.x + 20 + Math.sin(i / 4) * 60, box.y + box.height / 2 + Math.cos(i / 5) * 10);
      await page.waitForTimeout(16);
    }
    await page.mouse.up();
  }
  await page.waitForTimeout(600);

  const frames = (await page.evaluate(() => window.__frames)).slice(5).filter(Number.isFinite);
  frames.sort((a, b) => a - b);
  const p = q => frames[Math.min(frames.length - 1, (frames.length * q) | 0)];
  rows.push({
    rate, ...surfaces, n: frames.length,
    median: p(.5), p95: p(.95), worst: frames[frames.length - 1],
    over32: frames.filter(f => f > 32).length,
  });
  await client.send('Emulation.setCPUThrottlingRate', { rate: 1 });
  await page.close();
}
await browser.close();

console.log('\nFrame times while dragging on the media page (ms between rAF callbacks)\n');
console.log('cpu     glass  blurred  lensed   median    p95      worst    frames >32ms');
for (const r of rows) {
  console.log(`${`${r.rate}x`.padEnd(7)} ${String(r.glass).padEnd(6)} ${String(r.blurred).padEnd(8)} ${String(r.lensed).padEnd(8)} ${`${r.median.toFixed(1)}`.padEnd(9)} ${`${r.p95.toFixed(1)}`.padEnd(8)} ${`${r.worst.toFixed(1)}`.padEnd(8)} ${r.over32}/${r.n}`);
}
console.log('\n1x is this machine. 4x and 6x throttle the CPU only — a real low-end device also has');
console.log('a slower GPU and less memory bandwidth, which is exactly what blurred surfaces cost.\n');

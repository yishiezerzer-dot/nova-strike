// Colour-blind bullet contrast check for Nova Strike.
// Opens the game in a phone-sized headless browser, plays into a boss fight in each act, and asks the game's devtest
// hook (cbCheck) to measure enemy-bullet contrast against the background under normal vision and simulated
// protanopia, deuteranopia and tritanopia, over the open playfield (HUD bands, toasts and dialogue excluded). Fails (exit code 1) if any mode drops below the thresholds below.
// Usage: node tools/cbcheck.js            (needs Playwright: PLAYWRIGHT=<path to playwright module> if not resolvable)
const path = require('path');
let pw; try { pw = require(process.env.PLAYWRIGHT || 'playwright') } catch (e) { pw = require(path.join(process.env.APPDATA || '', 'npm/node_modules/@playwright/cli/node_modules/playwright')) }
const CORE_MIN = 4.5, RING_MIN = 1.6;   // per bullet: best of (fill, ink keyline) vs background. Core: WCAG text contrast; ring: must separate from what is behind it
const GAME = 'file:///' + path.resolve(__dirname, '..', 'index.html').split(path.sep).join('/') + '#devtest';
(async () => {
  const browser = await pw.chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {});
  const page = await (await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true })).newPage();
  await page.goto(GAME); await page.waitForTimeout(800);
  let fail = 0;
  for (const n of [5, 10, 15, 20, 25]) {
    await page.evaluate(n => { const a = window.__ns; a.newRun(n); let g = 0; while (a.st === 'perk' && g++ < 9) a.takePerk(a.R.offer[0]); a.god.on = true; a.enemies.length = 0; a.LV.waveIdx = a.LV.waveCount; a.spawnBoss() }, n);
    await page.waitForTimeout(6500);
    await page.evaluate(() => { const a = window.__ns; a.toasts.length = 0; a.comms.length = 0; a.cbArm() }); await page.waitForTimeout(250);
    const r = await page.evaluate(() => window.__ns.cbRes);
    const row = ['normal', 'protan', 'deutan', 'tritan'].map(m => { const ok = r[m].core[0] >= CORE_MIN && r[m].ring[0] >= RING_MIN; if (!ok && r.n) fail++; return `${m} core ${r[m].core[0]} ring ${r[m].ring[0]}${ok ? '' : ' FAIL'}` });
    console.log(`sector ${n} (${r.n} bullets): ` + row.join(' | '));
    if (process.env.VERBOSE && r.worst) console.log('  worst [x,y,r,mine,ring rgb,bg luminance]:', JSON.stringify(r.worst.slice(0, 8)));
  }
  await browser.close();
  console.log(fail ? `FAILED (${fail})` : 'PASS'); process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1) });

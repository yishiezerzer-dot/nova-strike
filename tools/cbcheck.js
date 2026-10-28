// Colour-blind bullet contrast check for Nova Strike.
// Opens the game in a phone-sized headless browser, plays into a boss fight in each act, and asks the game's devtest
// hook (cbCheck) to measure enemy-bullet contrast against the background under normal vision and simulated
// protanopia, deuteranopia and tritanopia, over the open playfield (HUD bands, toasts and dialogue excluded). Each fight is measured with the
// standard bullets and again with the High-contrast bullets setting. It also drops one of each pickup token into the fight and checks the
// token edge stands off the background and its colour stays clearly apart from bullet vermilion. Then it plays wave sectors with the
// background archetypes (nebula, rift, tunnel, gates, arcs, belt) and the eclipse, minefield and meteor events, and checks the bullets
// there in both bullet modes, pooling samples until at least 20 bullets are measured. In wave sectors only the high-contrast mode
// must pass: standard bullets over mid-tone backgrounds (gate lasers, banded planets) can dip just under 4.5:1 and are reported as
// warnings. Bullets touching another bullet or sitting on an enemy or boss body are skipped. Fails (exit code 1) below the thresholds.
// WAVES='[[sector,archetype,event],...]' runs only those wave sectors. Set CHROME to a Chrome/Chromium executable if Playwright's own is missing.
// Usage: node tools/cbcheck.js            (needs Playwright: PLAYWRIGHT=<path to playwright module> if not resolvable)
const path = require('path');
let pw; try { pw = require(process.env.PLAYWRIGHT || 'playwright') } catch (e) { pw = require(path.join(process.env.APPDATA || '', 'npm/node_modules/@playwright/cli/node_modules/playwright')) }
const CORE_MIN = 4.5, RING_MIN = 1.6;   // per bullet: best of (fill, ink keyline) vs background. Core: WCAG text contrast; ring: must separate from what is behind it
const PK_MIN = 3, PK_DE = 30;          // pickups: WCAG non-text 3:1 edge contrast; CIE76 colour distance from bullet vermilion
const GAME = 'file:///' + path.resolve(__dirname, '..', 'index.html').split(path.sep).join('/') + '#devtest';
(async () => {
  const browser = await pw.chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {});
  const page = await (await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true })).newPage();
  await page.goto(GAME); await page.waitForTimeout(800);
  let fail = 0, warn = 0;
  const BOSSES = process.env.WAVES ? [] : [5, 10, 15, 20, 25];   // WAVES='[[n,arch,event],...]' runs only those wave sectors
  for (const n of BOSSES) {
    await page.evaluate(n => { const a = window.__ns; a.newRun(n); let g = 0; while (a.st === 'perk' && g++ < 9) a.takePerk(a.R.offer[0]); a.god.on = true; a.enemies.length = 0; a.LV.waveIdx = a.LV.waveCount; a.spawnBoss() }, n);
    await page.waitForTimeout(6500);
    for (const hc of [0, 1]) {
      await page.evaluate(hc => { const a = window.__ns; a.SV.hcb = hc; a.toasts.length = 0; a.comms.length = 0; a.clearBanners(); a.pickups.length = 0; ['P', 'S', 'B', 'H', '+', 'W', 'R', 'gem', 'p'].forEach((t, i) => a.dropAt(40 + (i % 5) * (innerWidth - 80) / 4, innerHeight * (0.42 + 0.1 * Math.floor(i / 5)), t, 1, t === 'W' ? 'flame' : undefined)); for (const p of a.pickups) { p.vx = 0; p.vy = 0 } }, hc);
      await page.waitForTimeout(40); await page.evaluate(() => window.__ns.cbArm()); await page.waitForTimeout(250);
      const r = await page.evaluate(() => window.__ns.cbRes);
      const row = ['normal', 'protan', 'deutan', 'tritan'].map(m => { const ok = r[m].core[0] >= CORE_MIN && r[m].ring[0] >= RING_MIN, pk = r[m].pk[1] >= PK_MIN && r[m].pkd[1] >= PK_DE; if (!ok && r.m) fail++; if (!pk && r.np) fail++; return `${m} core ${r[m].core[0]} ring ${r[m].ring[0]}${ok ? '' : ' FAIL'} pickups ${r[m].pk[1]}/${Math.round(r[m].pkd[1])}${pk ? '' : ' FAIL'}` });
      console.log(`sector ${n}${hc ? ' high-contrast' : ''} (${r.n} bullets, ${r.np} pickups): ` + row.join(' | '));
      if (process.env.VERBOSE && r.worst) console.log('  worst [x,y,r,mine,ring rgb,bg luminance]:', JSON.stringify(r.worst.slice(0, 8)));
      if (process.env.VERBOSE && r.pkw) console.log('  pickups [type,contrast,distance]:', JSON.stringify(r.pkw));
    }
    await page.evaluate(() => { const a = window.__ns; a.SV.hcb = 0; a.pickups.length = 0 });
  }
  // wave sectors: [sector, archetype, event]
  const WAVES = (process.env.WAVES && JSON.parse(process.env.WAVES)) || [[4, 'nebula'], [6, 'rift'], [9, 'tunnel'], [12, 'gates'], [14, 'arc'], [16, 'belt'], [7, null, 'eclipse'], [11, null, 'minefield'], [17, null, 'meteor']];
  for (const [n, arch, ev] of WAVES) {
    await page.evaluate(([n, arch, ev]) => { const a = window.__ns; a.newRun(Math.max(1, n - 1)); let g = 0; while (a.st === 'perk' && g++ < 9) a.takePerk(a.R.offer[0]); a.god.on = true; a.R.nextArch = arch; a.R.forceEv = ev; a.startLevel(n); a.R.forceEv = null }, [n, arch, ev]);
    await page.waitForTimeout(5000);
    const lv = await page.evaluate(() => { const a = window.__ns; return a.LV.arch + (a.LV.ev ? '/' + a.LV.ev : '') });
    for (const hc of [0, 1]) {
      const P = { n: 0 };
      for (let i = 0; i < 8 && (i < 3 || P.n < 20); i++) {
        await page.evaluate(hc => { const a = window.__ns; a.SV.hcb = hc; a.toasts.length = 0; a.comms.length = 0; a.clearBanners(); a.pickups.length = 0; a.cbArm() }, hc); await page.waitForTimeout(250);
        const r = await page.evaluate(() => window.__ns.cbRes); P.n += r.m;
        if (process.env.VERBOSE && r.worst) console.log('  worst [x,y,r,mine,ring rgb,bg luminance]:', JSON.stringify(r.worst.slice(0, 6)));
        if (r.m) for (const m of ['normal', 'protan', 'deutan', 'tritan']) { const q = P[m] || (P[m] = { cr: [], rr: [] }); q.cr.push(...r[m].cr); q.rr.push(...r[m].rr) }
        await page.waitForTimeout(1200);
      }
      if (P.n < 10) { console.log(`sector ${n} ${lv}${hc ? ' high-contrast' : ''}: only ${P.n} bullets sampled, skipped`); continue }
      const p10 = a => (a.sort((x, y) => x - y), a[Math.floor(a.length * 0.1)]);
      const row = ['normal', 'protan', 'deutan', 'tritan'].map(m => { const q = { core: p10(P[m].cr), ring: p10(P[m].rr) }, ok = q.core >= CORE_MIN && q.ring >= RING_MIN; if (!ok && hc) fail++; else if (!ok) warn++; return `${m} core ${q.core} ring ${q.ring}${ok ? '' : hc ? ' FAIL' : ' WARN'}` });
      console.log(`sector ${n} ${lv}${hc ? ' high-contrast' : ''} (${P.n} bullets): ` + row.join(' | '));
    }
    await page.evaluate(() => { window.__ns.SV.hcb = 0 });
  }
  await browser.close();
  console.log((fail ? `FAILED (${fail})` : 'PASS') + (warn ? `, ${warn} standard-bullet warnings in wave sectors` : '')); process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1) });

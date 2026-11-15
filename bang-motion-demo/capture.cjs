// uso: node capture.cjs sheet|frames
const {chromium} = require('playwright'); const path = require('path'); const fs = require('fs');
(async () => {
  const mode = process.argv[2];
  const b = await chromium.launch(); const p = await b.newPage({viewport: {width: 1920, height: 1080}});
  p.on('pageerror', e => console.log('PAGEERR', e.message));
  await p.goto('file://' + path.resolve('index.html') + '?clean=1'); await p.waitForTimeout(800);
  await p.evaluate(() => document.fonts.ready);
  const out = mode === 'sheet' ? 'out_snap' : 'out_frames'; fs.mkdirSync(out, {recursive: true});
  const times = mode === 'sheet' ? [0.8, 1.9, 3.0, 4.4, 5.3, 6.0, 7.0, 7.8, 8.9, 9.5] : Array.from({length: 300}, (_, i) => i / 30);
  for (let i = 0; i < times.length; i++) {
    await p.evaluate(t => window.__seek(t), times[i]);
    await p.screenshot({path: `${out}/${String(i).padStart(4, '0')}.png`});
  }
  await b.close(); console.log('ok', times.length);
})();

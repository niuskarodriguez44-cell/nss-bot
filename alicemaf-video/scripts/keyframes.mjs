import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';
const KEYS = JSON.parse(process.argv[2]); // {"E1": 7.5, ...} segundos globales
const entry = path.resolve('src/index.ts');
const serveUrl = await bundle({entryPoint: entry, publicDir: path.resolve('public')});
const opts = {browserExecutable: '/opt/pw-browsers/chromium', chromiumOptions: {gl: 'swangle'}};
const comp = await selectComposition({serveUrl, id: 'Main', inputProps: {width: 1920, height: 1080}, ...opts});
for (const [name, sec] of Object.entries(KEYS)) {
  await renderStill({composition: comp, serveUrl, frame: Math.round(sec * 30), output: `out/keyframes/${name}.png`, inputProps: {width: 1920, height: 1080}, ...opts});
  console.log('ok', name, sec);
}

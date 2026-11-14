import {bundle} from '@remotion/bundler';
import {renderMedia, selectComposition} from '@remotion/renderer';
import path from 'node:path';
// uso: node scripts/render.mjs <salida.mp4> [scale=1] [concurrency=2] [from] [to]
const [out, scale = '1', conc = '2', from, to] = process.argv.slice(2);
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts'), publicDir: path.resolve('public')});
const props = {width: 1920, height: 1080};
const opts = {browserExecutable: '/opt/pw-browsers/chromium', chromiumOptions: {gl: 'swangle'}};
const composition = await selectComposition({serveUrl, id: 'Main', inputProps: props, ...opts});
let last = 0;
await renderMedia({
  composition, serveUrl, codec: 'h264', outputLocation: out, inputProps: props, scale: Number(scale),
  concurrency: Number(conc), crf: 18, pixelFormat: 'yuv420p', audioCodec: 'aac', audioBitrate: '192k',
  frameRange: from !== undefined ? [Number(from), Number(to)] : null,
  onProgress: ({progress}) => { const p = Math.floor(progress * 100); if (p >= last + 5) { last = p; console.log('progress', p + '%'); } },
  ...opts,
});
console.log('done', out);

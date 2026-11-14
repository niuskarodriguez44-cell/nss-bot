import React from 'react';
import {useCurrentFrame, random} from 'remotion';
import {Beat, Label, px} from '../components/Beat';
import {FPS, colors, fonts} from '../brand/tokens';
import {clamp, lerp, prog, R1, R2, R3, Formation, ex} from '../engine/rand';

const ROWS = [2.5, 1.25, 0, -1.25, -2.5];
// palabras: segmentos por fila
const SEG = ROWS.map((_, r) => {
  const segs: [number, number][] = []; let x = -7;
  let k = 0;
  while (x < 6.5) { const w = 0.8 + random(`w${r}-${k}`) * 1.8; segs.push([x, Math.min(x + w, 7)]); x += w + 0.5; k++; }
  return segs;
});
const WORD = Array.from({length: 1400}, (_, i) => {
  const r = i % 5, segs = SEG[r], tot = segs.reduce((s, g) => s + (g[1] - g[0]), 0);
  let d = ((i / 5) % 280) / 280 * tot;
  for (const g of segs) { if (d <= g[1] - g[0]) return [g[0] + d, ROWS[r]] as [number, number]; d -= g[1] - g[0]; }
  return [0, ROWS[r]] as [number, number];
});

export const formation: Formation = (i, t, o) => {
  const col = i % 50, row = Math.floor(i / 50);
  const gx = -7.5 + col * 0.306, gy = 3.4 - row * 0.24;
  const bx = -8.5 + clamp((t - 3.5) / 6.5) * 17;
  const beam = Math.exp(-((gx - bx) ** 2) / 0.9);
  const e0 = prog(t, R1[i] * 1.5, 2.2);
  o.x = lerp(gx + (R2[i] - 0.5) * 4, gx, e0); o.y = lerp(gy + (R3[i] - 0.5) * 4, gy, e0); o.z = lerp(-3, 0, e0);
  o.s = 0.05 + beam * 0.05; o.c = 0.12 + beam * 0.88; o.a = (0.28 + beam * 0.9) * e0;
  // las partículas leídas por el haz se convierten en palabras
  const u = prog(t, 10.2 + R1[i] * 2.6, 3);
  const w = WORD[i];
  o.x = lerp(o.x, w[0] + Math.sin(t * 1.2 + i) * 0.015, u); o.y = lerp(o.y, w[1] + (R2[i] - 0.5) * 0.28, u); o.z = lerp(o.z, 0, u);
  o.s = lerp(o.s, 0.05, u); o.c = lerp(o.c, 0.3 + 0.7 * R1[i], u); o.a = lerp(o.a, 0.75, u);
};

export const Overlay: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const bx = -8.5 + clamp((t - 3.5) / 6.5) * 17;
  const fade = ex(clamp((t - 1.5) / 1)) * (1 - ex(clamp((t - 10.8) / 1.5)));
  const cols = 9, rows = 7;
  return (
    <>
      <div style={{position: 'absolute', inset: 0, opacity: fade * 0.9}}>
        {Array.from({length: cols * rows}, (_, k) => {
          const cx = -6.6 + (k % cols) * 1.65, cy = 2.6 - Math.floor(k / cols) * 0.85;
          const [x, y] = px(cx, cy);
          const b = Math.exp(-((cx - bx) ** 2) / 0.7);
          const val = (random(`n${k}-${Math.floor(t * 1.5 + random(`m${k}`) * 3)}`) * 2 - 1).toFixed(2);
          return <div key={k} style={{position: 'absolute', left: x, top: y, transform: 'translate(-50%,-50%)', fontFamily: fonts.mono, fontSize: 26, color: b > 0.25 ? colors.cyan : colors.slate, opacity: 0.7 + b * 0.3}}>{val}</div>;
        })}
      </div>
      <Beat from={17.2} to={23.2} style={{justifyContent: 'flex-end', alignItems: 'center'}}>
        <Label size={32}>Modelo = conocimiento · Motor = velocidad</Label>
      </Beat>
    </>
  );
};

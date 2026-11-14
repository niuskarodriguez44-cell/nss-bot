import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Beat, Label, px} from '../components/Beat';
import {FPS, colors, fonts} from '../brand/tokens';
import {ambient, clamp, lerp, polyline, prog, R1, R2, R3, ex, Formation} from '../engine/rand';

// Isotipo (coordenadas de la imagen 1089×889 → mundo): la «A» y sus dos ramas con nodos
const W = (px_: number, py_: number): [number, number] => [(px_ - 545) / 148, (444 - py_) / 148];
const OX = -4.1, SC = 0.9;
const LEG_L = polyline([W(105, 889), W(450, 120), W(545, 55)], 330);
const LEG_R = polyline([W(545, 55), W(640, 120), W(955, 889)], 330);
const BR1 = polyline([W(400, 485), W(975, 485)], 150), BR2 = polyline([W(320, 650), W(1025, 650)], 170);
const N1 = W(977, 485), N2 = W(1027, 653);
const ISO: {p: [number, number]; c: number; n: number}[] = [];
LEG_L.forEach((p, k) => ISO.push({p, c: 0, n: 0})); LEG_R.forEach((p) => ISO.push({p, c: 0, n: 0}));
BR1.forEach((p) => ISO.push({p, c: 1, n: 0})); BR2.forEach((p) => ISO.push({p, c: 1, n: 0}));
for (let k = 0; k < 60; k++) { const a = k * 2.4, r = Math.sqrt(k / 60) * 0.42; ISO.push({p: [N1[0] + Math.cos(a) * r, N1[1] + Math.sin(a) * r], c: 1, n: 1}); }
for (let k = 0; k < 60; k++) { const a = k * 2.4, r = Math.sqrt(k / 60) * 0.42; ISO.push({p: [N2[0] + Math.cos(a) * r, N2[1] + Math.sin(a) * r], c: 1, n: 2}); }
const NI = ISO.length;

export const formation: Formation = (i, t, o) => {
  ambient(i, t, o, 1, 0, 5.5);
  if (i >= NI) { o.a = 0.35; o.x += 1.5; return; }
  const q = ISO[i], leg = i < 660;
  const lat = (R2[i] - 0.5) * (leg ? 1.25 : 0.22) * SC;
  // desplazamiento lateral perpendicular aproximado: horizontal en las patas, vertical en ramas
  const tx = OX + q.p[0] * SC + (leg ? lat : 0), ty = q.p[1] * SC + (leg ? 0 : lat);
  const u = prog(t, 0.2 + R1[i] * 2.8, 3);
  o.x = lerp(o.x, tx, u); o.y = lerp(o.y, ty, u); o.z = lerp(o.z, (R3[i] - 0.5) * 0.15, u);
  const ig = q.n === 1 ? prog(t, 3.0, 0.8) : q.n === 2 ? prog(t, 3.9, 0.8) : q.c === 1 ? 1 : 1;
  const nodeOn = q.n ? ig : 1;
  o.s = lerp(o.s, (leg ? 0.075 : 0.055) * (q.n ? 1 + 0.5 * (1 - nodeOn) * 0 : 1), u);
  o.c = lerp(o.c, q.c ? 0.7 : 0, u); o.a = lerp(o.a, leg ? 0.8 : 0.42 + 0.3 * nodeOn, u);
};

const WORDS = ['guagua', '«estar en la lucha»'];
export const Overlay: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const [cx, cy] = px(OX, 0);
  const n1 = ex(clamp((t - 3.4) / 1.2)), n2 = ex(clamp((t - 5.2) / 1.2));
  return (
    <>
      <div style={{position: 'absolute', left: 1020, top: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
        <div style={{fontFamily: fonts.sans, fontWeight: 700, fontSize: 150, color: colors.coolWhite, lineHeight: 1, opacity: n1, transform: `translateY(${(1 - n1) * 20}px)`}}>AliceMaf</div>
        <div style={{fontFamily: fonts.sans, fontWeight: 700, fontSize: 150, color: colors.indigo, lineHeight: 1, opacity: n2, transform: `translateY(${(1 - n2) * 20}px)`}}>12B</div>
      </div>
      {WORDS.map((w, k) => {
        const t0 = 4.4 + k * 2.3, d = 2.3, u = (t - t0) / d;
        if (u < 0 || u > 1) return null;
        const th = -0.6 + u * 4.2, r = (u > 0.72 ? 1 - ex((u - 0.72) / 0.28) : ex(Math.min(1, u / 0.2))) * 215;
        const op = Math.min(ex(clamp(u / 0.15)), 1 - ex(clamp((u - 0.8) / 0.2)));
        return <div key={w} style={{position: 'absolute', left: cx + Math.cos(th) * r * 1.1, top: cy + Math.sin(th) * r * 0.62, transform: 'translate(-50%,-50%)', opacity: op, fontFamily: fonts.sans, fontWeight: 600, fontSize: 40, color: colors.cyan, whiteSpace: 'nowrap'}}>{w}</div>;
      })}
      <Beat from={9.2} to={12.0} style={{justifyContent: 'flex-end', alignItems: 'center'}}>
        <Label size={28}>Propuesta de investigación · 12B parámetros (objetivo)</Label>
      </Beat>
    </>
  );
};

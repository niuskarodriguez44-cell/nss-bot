import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Beat, Label, px} from '../components/Beat';
import {FPS, colors, fonts} from '../brand/tokens';
import {N, clamp, lerp, polyline, prog, R1, R2, R3, rotY, ex, Formation} from '../engine/rand';

// --- geometría del esquema (mundo) ---
const ORG: [number, number] = [-7, 0], ROUT: [number, number] = [-2.7, 0], OUT: [number, number] = [7.2, 0];
const EXP: [number, number][] = [[3.2, 2.4], [3.2, 0], [3.2, -2.4]]; // A, B, C
const circle = (cx: number, cy: number, r: number, n: number) => polyline(Array.from({length: 24}, (_, k) => [cx + Math.cos(k / 24 * 6.2832) * r, cy + Math.sin(k / 24 * 6.2832) * r] as [number, number]), n, true);
const boxEdges = (cx: number, cy: number, n: number) => {
  const w = 1.1, h = 0.65, d = 0.5;
  const V = (sx: number, sy: number, sz: number): [number, number, number] => [cx + sx * w, cy + sy * h, sz * d];
  const E: [[number, number, number], [number, number, number]][] = [];
  const c = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
  for (let k = 0; k < 4; k++) {
    const a = c[k], b = c[(k + 1) % 4];
    E.push([V(a[0], a[1], -1), V(b[0], b[1], -1)], [V(a[0], a[1], 1), V(b[0], b[1], 1)], [V(a[0], a[1], -1), V(a[0], a[1], 1)]);
  }
  return Array.from({length: n}, (_, i) => { const e = E[i % 12], u = (Math.floor(i / 12) + 0.5) / Math.ceil(n / 12); return [lerp(e[0][0], e[1][0], u), lerp(e[0][1], e[1][1], u), lerp(e[0][2], e[1][2], u)]; });
};
// reparto de partículas estáticas
const S_TOKEN = 70, S_ROUT = 150, S_EXP = 130, S_OUT = 70, S_CONN = 40;
const tokenPts = circle(ORG[0], ORG[1], 0.35, S_TOKEN);
const routPts = [...circle(ROUT[0], ROUT[1], 0.75, 90), ...polyline([[ROUT[0] - 0.4, 0], [ROUT[0], 0], [ROUT[0] + 0.35, 0.35]], 20), ...polyline([[ROUT[0], 0], [ROUT[0] + 0.35, -0.35]], 10), ...polyline([[ROUT[0], 0], [ROUT[0] + 0.4, 0]], 10), ...polyline([[ROUT[0] - 0.4, 0], [ROUT[0] - 0.9, 0]], 20)];
const expPts = EXP.map((e) => boxEdges(e[0], e[1], S_EXP));
const outPts = circle(OUT[0], OUT[1], 0.5, S_OUT);
const connPts = [...EXP.map((e) => polyline([[ROUT[0] + 0.8, 0], [e[0] - 1.2, e[1]]], S_CONN)), ...EXP.map((e) => polyline([[e[0] + 1.2, e[1]], [OUT[0] - 0.6, 0]], S_CONN))];
const STATIC = S_TOKEN + S_ROUT + 3 * S_EXP + S_OUT + 6 * S_CONN;

// Rondas: [inicio del vuelo (s), expertos activos]
const ROUNDS: [number, number[]][] = [[5, [0, 2]], [19, [1, 2]]];
const glow = (e: number, t: number) => {
  let g = 0;
  for (const [t0, ex_] of ROUNDS) if (ex_.includes(e)) g = Math.max(g, ex(clamp((t - (t0 + 3.4)) / 0.8)) * (1 - ex(clamp((t - (t0 + 8.2)) / 1.2))));
  return g;
};
const bez = (a: [number, number], b: [number, number], u: number): [number, number] => {
  const m = [(a[0] + b[0]) / 2, a[1]]; // curva suave que sale horizontal
  const x = (1 - u) * (1 - u) * a[0] + 2 * (1 - u) * u * m[0] + u * u * b[0];
  const y = (1 - u) * (1 - u) * a[1] + 2 * (1 - u) * u * m[1] + u * u * b[1];
  return [x, y];
};

const K = 1.55; // comprime la coreografía original (34 s) a ~21 s
const inner: Formation = (i, t, o) => {
  o.z = 0; o.c = 0; o.a = 0.5; o.s = 0.05;
  let k = i;
  const set = (p: number[], s: number, c: number, a: number) => { o.x = p[0]; o.y = p[1]; o.z = p[2] ?? 0; o.s = s; o.c = c; o.a = a; };
  const appear = prog(t, 0.3 + R1[i] * 1.6, 1.8);
  if (k < S_TOKEN) { set(tokenPts[k], 0.045, 0.9, 0.7); }
  else if ((k -= S_TOKEN) < S_ROUT) { const act = Math.max(glow(0, t), glow(1, t), glow(2, t)) > 0 ? 0.35 : 0; set(routPts[k], 0.04, 0.25 + act, 0.6); }
  else if ((k -= S_ROUT) < 3 * S_EXP) {
    const e = Math.floor(k / S_EXP), g = glow(e, t);
    set(expPts[e][k % S_EXP], 0.038 + g * 0.012, g * 0.9, 0.28 + g * 0.45);
  } else if ((k -= 3 * S_EXP) < S_OUT) {
    const pulse = Math.max(ex(clamp((t - 12.2) / 0.6)) * (1 - ex(clamp((t - 14.5) / 1.5))), ex(clamp((t - 26.2) / 0.6)) * (1 - ex(clamp((t - 28.5) / 1.5))));
    set(outPts[k], 0.04 + pulse * 0.02, 0.3 + pulse * 0.6, 0.45 + pulse * 0.35);
  } else if ((k -= S_OUT) < 6 * S_CONN) {
    const L = Math.floor(k / S_CONN), e = L % 3, inactive = e === 1;
    const g = glow(e, t);
    const dash = inactive && ((k % S_CONN) % 4 < 2) ? 0.35 : 1;
    set([...connPts[L][k % S_CONN]], 0.03, g, (inactive ? 0.18 : 0.2 + g * 0.6) * dash);
  } else {
    // partículas de flujo: tokens que viajan origen → enrutador → experto → salida combinada
    const f = k - 6 * S_CONN, rd = f % 2, [t0, act] = ROUNDS[rd];
    const ex_ = act[(f >> 1) % 2], d = R1[i] * 0.9;
    const T = t - t0 - d;
    const p1 = clamp(T / 1.9), p2 = clamp((T - 1.9) / 1.7), p3 = clamp((T - 5.6) / 1.9);
    let pos: [number, number] = ORG, fade = 1;
    if (T < 0) { pos = [ORG[0] + (R2[i] - 0.5) * 1.1, ORG[1] + (R3[i] - 0.5) * 1.1]; fade = 0.035; }
    else if (T < 1.9) pos = bez(ORG, ROUT, ex(p1));
    else if (T < 3.6) pos = bez([ROUT[0], ROUT[1]], [EXP[ex_][0] - 1.1, EXP[ex_][1]], ex(p2));
    else if (T < 5.6) pos = [EXP[ex_][0] + (R2[i] - 0.5) * 1.6, EXP[ex_][1] + (R3[i] - 0.5) * 0.9]; // procesa dentro del experto
    else { pos = bez([EXP[ex_][0] + 1.1, EXP[ex_][1]], OUT, ex(p3)); if (T > 7.5) { pos = [OUT[0] + (R2[i] - 0.5) * 1.0, OUT[1] + (R3[i] - 0.5) * 1.0]; fade = 0.35 * (1 - clamp((T - 7.8) / 1.0)); } }
    set([pos[0], pos[1], (R2[i] - 0.5) * (T > 3.6 && T < 5.6 ? 0.8 : 0.1)], 0.05, 0.75 + 0.25 * R3[i], 0.7 * fade);
  }
  o.a *= appear;
  rotY(o, 0.16 * Math.sin(t * 0.32));
  void N;
};

export const formation: Formation = (i, t, o) => inner(i, t * K, o);

const LBL: [string, number, number, number][] = [
  ['Token', ORG[0], ORG[1] - 0.95, 5.6], ['Enrutador', ROUT[0], ROUT[1] - 1.35, 6.4],
  ['Experto A', EXP[0][0], EXP[0][1] + 1.2, 7.2], ['Experto B', EXP[1][0], EXP[1][1] + 1.2, 7.4], ['Experto C', EXP[2][0], EXP[2][1] - 1.35, 7.6],
  ['Salida combinada', OUT[0] - 0.4, OUT[1] - 1.45, 8.2],
];
export const Overlay: React.FC = () => {
  const t = (useCurrentFrame() / FPS) * K;
  return (
    <>
      <Beat from={0.4} to={3.4} style={{justifyContent: 'flex-start', alignItems: 'center'}}>
        <Label size={28} style={{maxWidth: 1250, textAlign: 'center', color: colors.coolWhite, marginTop: 20}}>En una capa MoE, el enrutador selecciona qué expertos procesan cada token</Label>
      </Beat>
      {LBL.map(([txt, x, y, t0], k) => {
        const o = ex(clamp((t - t0) / 0.9)) * (1 - ex(clamp((t - 31.6) / 0.9)));
        const [lx, ly] = px(x, y);
        return <div key={k} style={{position: 'absolute', left: lx, top: ly, transform: 'translate(-50%,-50%)', opacity: o, fontFamily: fonts.mono, fontSize: 22, letterSpacing: '0.22em', textTransform: 'uppercase', color: colors.slate, whiteSpace: 'nowrap'}}>{txt}</div>;
      })}
    </>
  );
};

import {random, Easing} from 'remotion';
export const N = 1400;
const arr = (k: string) => Float32Array.from({length: N}, (_, i) => random(`${k}${i}`));
export const R1 = arr('a'), R2 = arr('b'), R3 = arr('c'), R4 = arr('d');
export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const ex = Easing.bezier(0.16, 1, 0.3, 1);
export const sm = Easing.bezier(0.65, 0, 0.35, 1);
/** progreso eased 0..1 entre t0 y t0+d */
export const prog = (t: number, t0: number, d: number) => ex(clamp((t - t0) / d));

export type P = {x: number; y: number; z: number; s: number; c: number; a: number};
export type Formation = (i: number, t: number, o: P) => void;

/** Muestreo uniforme por longitud de arco de una polilínea. Devuelve n puntos. */
export const polyline = (pts: [number, number][], n: number, closed = false) => {
  const p = closed ? [...pts, pts[0]] : pts;
  const L = [0];
  for (let i = 1; i < p.length; i++) L.push(L[i - 1] + Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]));
  const tot = L[L.length - 1];
  const out: [number, number][] = [];
  let j = 1;
  for (let k = 0; k < n; k++) {
    const d = (k / Math.max(1, n - (closed ? 0 : 1))) * tot;
    while (j < p.length - 1 && L[j] < d) j++;
    const u = (d - L[j - 1]) / Math.max(1e-6, L[j] - L[j - 1]);
    out.push([lerp(p[j - 1][0], p[j][0], u), lerp(p[j - 1][1], p[j][1], u)]);
  }
  return out;
};
export const rotY = (o: P, a: number) => {
  const c = Math.cos(a), s = Math.sin(a);
  const x = o.x * c + o.z * s, z = -o.x * s + o.z * c;
  o.x = x; o.z = z;
};
export const rotX = (o: P, a: number) => {
  const c = Math.cos(a), s = Math.sin(a);
  const y = o.y * c - o.z * s, z = o.y * s + o.z * c;
  o.y = y; o.z = z;
};
/** Enjambre ambiente: movimiento tranquilo y coherente, como un banco de peces. */
export const ambient = (i: number, t: number, o: P, cx: number, cy: number, spread: number) => {
  const ph = R1[i] * 6.2832, w = 0.22 + R2[i] * 0.3;
  const ang = R3[i] * 6.2832, rad = Math.sqrt(R4[i]) * spread * (1 + 0.05 * Math.sin(t * 1.1));
  let x = cx + Math.cos(ang) * rad * 1.5 + Math.sin(t * w + ph) * 0.3;
  let y = cy + Math.sin(ang) * rad * 0.8 + Math.cos(t * w * 1.1 + ph) * 0.3;
  x += 0.7 * Math.sin(t * 0.37 + y * 0.45);
  y += 0.5 * Math.cos(t * 0.31 + x * 0.35);
  o.x = x; o.y = y; o.z = (R2[i] - 0.5) * 4 + Math.sin(t * 0.4 + ph) * 0.3;
  o.s = 0.05 + R1[i] * 0.06; o.c = R3[i] * 0.8; o.a = 0.55;
};

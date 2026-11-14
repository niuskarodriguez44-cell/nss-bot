import React from 'react';
import {Beat, Title} from '../components/Beat';
import {clamp, lerp, prog, R1, R2, R3, R4, rotY, Formation} from '../engine/rand';

const NODES = 24;
const fib = (k: number): [number, number, number] => {
  const y = 1 - (k / (NODES - 1)) * 2, r = Math.sqrt(1 - y * y), th = k * 2.39996;
  return [Math.cos(th) * r, y, Math.sin(th) * r];
};
const CL = Array.from({length: 14}, (_, k) => [-6.6 + (k % 5) * 3.3 + (R1[k] - 0.5) * 1.2, 2.3 - Math.floor(k / 5) * 2.3 + (R2[k] - 0.5) * 0.8] as [number, number]);

export const formation: Formation = (i, t, o) => {
  // Fase A: red global de nodos enormes (índigo apagado)
  const a = i % NODES, b = (a * 5 + 1 + (Math.floor(i / NODES) % 3) * 4) % NODES;
  const na = fib(a), nb = fib(b);
  if (i < NODES) {
    o.x = na[0] * 3.4; o.y = na[1] * 3.4; o.z = na[2] * 3.4; o.s = 0.34; o.c = 0.1; o.a = 0.7 + 0.2 * Math.sin(t * 1.5 + i);
  } else {
    const s = (Math.floor(i / NODES) % 24 + 0.5) / 24;
    let x = lerp(na[0], nb[0], s), y = lerp(na[1], nb[1], s), z = lerp(na[2], nb[2], s);
    const l = Math.hypot(x, y, z) + 1e-6, rr = 3.4 * (1 + 0.22 * Math.sin(s * 3.14));
    o.x = (x / l) * rr; o.y = (y / l) * rr; o.z = (z / l) * rr; o.s = 0.028; o.c = 0.15; o.a = 0.42;
  }
  rotY(o, t * 0.16);
  // Fase B: la red se contrae a pequeños nodos: oficinas, escuelas, laboratorios
  const u = prog(t, 4.4 + R1[i] * 1.8, 2.6);
  const c = CL[i % 14], ang = R3[i] * 6.2832, rad = i < 14 ? 0 : 0.22 + R4[i] * 0.42;
  const tx = c[0] + Math.cos(ang) * rad, ty = c[1] + Math.sin(ang) * rad * 0.8;
  o.x = lerp(o.x, tx, u); o.y = lerp(o.y, ty, u); o.z = lerp(o.z, (R2[i] - 0.5) * 0.6, u);
  o.s = lerp(o.s, i < 14 ? 0.12 : 0.05, u); o.c = lerp(o.c, 0.8 + 0.2 * R3[i], u); o.a = lerp(o.a, 0.95, u);
  void clamp;
};

export const Overlay: React.FC = () => (
  <>
    <Beat from={5.6} to={9.6} style={{justifyContent: 'flex-end', alignItems: 'center'}}>
      <Title size={56} style={{textAlign: 'center', maxWidth: 1250}}>IA en las computadoras que ya tenemos</Title>
    </Beat>
  </>
);

import React from 'react';
import {Beat, Title} from '../components/Beat';
import {colors} from '../brand/tokens';
import {ambient, lerp, prog, R1, Formation} from '../engine/rand';
import pts from '../engine/icimaf_points.json';

const LOGO = pts as [number, number][];
export const formation: Formation = (i, t, o) => {
  ambient(i, t, o, 0, 0.2, 5);
  const vis = i === 0 ? prog(t, 0.2, 1) : prog(t, 0.9 + R1[i] * 1.4, 2);
  o.x = lerp(0, o.x, vis); o.y = lerp(0, o.y, vis);
  if (i === 0 && t < 2) { o.x = 0; o.y = 0; o.z = 0; o.s = 0.15; o.c = 1; o.a = 1; return; }
  o.a *= vis;
  // el banco de partículas se concentra y dibuja el logo del ICIMAF
  const u = prog(t, 2.2 + R1[i] * 1.6, 2.6);
  const q = LOGO[i];
  o.x = lerp(o.x, q[0] * 0.85, u); o.y = lerp(o.y, q[1] * 0.85 + 0.7, u); o.z = lerp(o.z, 0, u);
  o.s = lerp(o.s, 0.04, u); o.c = lerp(o.c, 0.55, u); o.a = lerp(o.a, 0.8, u);
};

export const Overlay: React.FC = () => (
  <Beat from={4.4} to={7.9} style={{justifyContent: 'flex-end', alignItems: 'center'}}>
    <Title size={42} weight={600} color={colors.coolWhite} style={{textAlign: 'center', marginBottom: 8}}>Instituto de Cibernética, Matemática y Física</Title>
  </Beat>
);

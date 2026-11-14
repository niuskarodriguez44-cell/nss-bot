import React from 'react';
import {Beat, Label, Title} from '../components/Beat';
import {colors, fonts} from '../brand/tokens';
import {ambient, lerp, prog, R1, R2, R3, R4, Formation} from '../engine/rand';

// «Presentamos»: dos focos de partículas (AliceMaf a la izquierda, AIRE a la derecha) unidos por un flujo
export const formation: Formation = (i, t, o) => {
  ambient(i, t, o, 0, 0, 6);
  const side = i % 2 === 0 ? -1 : 1;
  const u = prog(t, 0.3 + R1[i] * 1.5, 2.4);
  const ang = R3[i] * 6.2832 + t * 0.35 * side, rad = 0.35 + Math.sqrt(R4[i]) * 1.9 * (1 + 0.05 * Math.sin(t * 1.3 + i));
  let tx = side * 4.5 + Math.cos(ang) * rad * 1.1, ty = 2.5 + Math.sin(ang) * rad * 0.7;
  let tz = (R2[i] - 0.5) * 1.2, a = 0.55, s = 0.045;
  if (i % 7 === 0) { // flujo que conecta los dos proyectos
    const f = (R1[i] * 3 + t * 0.22) % 1; tx = lerp(-4.5, 4.5, f); ty = 2.5 + Math.sin(f * 3.1416) * 0.9 * (R2[i] - 0.5) * 2; tz = 0; a = 0.5; s = 0.035;
  }
  o.x = lerp(o.x, tx, u); o.y = lerp(o.y, ty, u); o.z = lerp(o.z, tz, u);
  o.s = lerp(o.s, s, u); o.c = lerp(o.c, side < 0 ? 0.15 : 0.9, u); o.a = lerp(o.a, a, u);
};

export const Overlay: React.FC = () => (
  <>
    <Beat from={0.4} to={3.4} style={{justifyContent: 'center', alignItems: 'center'}}>
      <Label size={40}>Presentamos</Label>
    </Beat>
    <Beat from={3.6} to={8.6} style={{justifyContent: 'center', alignItems: 'center'}}>
      <div style={{display: 'flex', gap: 150, alignItems: 'baseline', fontFamily: fonts.sans, fontSize: 104, lineHeight: 1}}>
        <span style={{fontWeight: 700, color: colors.coolWhite}}>AliceMaf <span style={{color: colors.indigo}}>12B</span></span>
        <span style={{fontWeight: 800, color: colors.coolWhite}}>AIRE <span style={{color: colors.cyan}}>MoE</span></span>
      </div>
    </Beat>
    <Beat from={8.8} to={11.8} style={{justifyContent: 'flex-end', alignItems: 'center'}}>
      <Title size={52} style={{textAlign: 'center', maxWidth: 1300, marginBottom: 40}}>Dos proyectos de investigación del ICIMAF</Title>
    </Beat>
  </>
);

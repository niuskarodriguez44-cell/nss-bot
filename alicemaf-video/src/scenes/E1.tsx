import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Beat, Label, Title} from '../components/Beat';
import {FPS, colors, fonts} from '../brand/tokens';
import {ambient, clamp, lerp, prog, R1, R2, Formation} from '../engine/rand';

const Q = '¿Qué quiere decir «estar en la lucha»?';
const ANS = 'Es una expresión cubana que describe el esfuerzo diario por resolver, inventar y salir adelante.'.split(' ');

export const formation: Formation = (i, t, o) => {
  ambient(i, t, o, 4.6, 0.3, 3.2);
  const vis = i === 0 ? prog(t, 0.2, 1) : prog(t, 1.2 + R1[i] * 1.6, 2.2);
  // la primera partícula nace en el centro; el resto se abre desde ella
  o.x = lerp(0, o.x, vis); o.y = lerp(0, o.y, vis);
  if (i === 0) { o.x = 0; o.y = 0; o.s = 0.15; o.c = 1; o.a = 1.1; o.z = 0; return; }
  o.a *= vis;
  // flujo de la respuesta: línea luminosa que se asienta bajo el texto
  const u = prog(t, 6.2 + R1[i] * 2.2, 2.6);
  const lx = -6.4 + R2[i] * 12.8, ly = -3.35 + Math.sin(lx * 1.3 + t * 0.8) * 0.06;
  o.x = lerp(o.x, lx, u); o.y = lerp(o.y, ly, u); o.z = lerp(o.z, 0, u);
  o.s = lerp(o.s, 0.045, u); o.a = lerp(o.a, 0.7, u); o.c = lerp(o.c, 0.6 + 0.4 * R1[i], u);
};

export const Overlay: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const qn = Math.floor(clamp((t - 1.3) / 2.6) * Q.length);
  const words = Math.floor(clamp((t - 4.4) / (ANS.length * 0.24)) * ANS.length);
  const caret = Math.floor(t * 2) % 2 === 0 || t < 4.4;
  return (
    <>
      <Beat from={1.0} to={8.7} style={{justifyContent: 'center'}}>
        <div style={{maxWidth: 1050, marginTop: 40}}>
          <Title size={50} weight={600}>{Q.slice(0, qn)}<span style={{color: colors.cyan, opacity: caret && qn < Q.length ? 1 : 0}}>▍</span></Title>
          <div style={{fontFamily: fonts.sans, fontSize: 40, lineHeight: 1.4, color: colors.slate, marginTop: 36, minHeight: 170}}>
            {ANS.map((w, k) => <span key={k} style={{opacity: k < words ? 1 : 0, color: k < words ? colors.coolWhite : colors.slate}}>{w} </span>)}
          </div>
        </div>
      </Beat>
      <Beat from={8.9} to={11.9} style={{justifyContent: 'center', alignItems: 'center'}}>
        <Label size={34}>IA local · IA soberana</Label>
      </Beat>
    </>
  );
};

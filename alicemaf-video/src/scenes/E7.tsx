import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Beat, Label, px} from '../components/Beat';
import {FPS, colors, fonts} from '../brand/tokens';
import {ambient, clamp, lerp, polyline, prog, R1, Formation, ex} from '../engine/rand';

const CX = [-5.4, -1.8, 1.8, 5.4];
const RECT = polyline([[-1.65, -1.8], [1.65, -1.8], [1.65, 1.8], [-1.65, 1.8]], 150, true);
export const formation: Formation = (i, t, o) => {
  ambient(i, t, o, 0, 0, 7);
  if (i < 600) {
    const c = Math.floor(i / 150), q = RECT[i % 150], u = prog(t, 0.6 + c * 0.5 + R1[i] * 1.2, 2);
    o.x = lerp(o.x, CX[c] + q[0], u); o.y = lerp(o.y, 0.3 + q[1], u); o.z = lerp(o.z, 0, u);
    o.s = lerp(o.s, 0.05, u); o.c = lerp(o.c, 0.3 + 0.2 * c, u); o.a = lerp(o.a, 0.75, u);
  } else { o.a = 0.22; }
};

const CARDS: [string, string][] = [['Latencia', 'Tiempo hasta el primer token'], ['Velocidad', 'Tokens por segundo'], ['Memoria', 'Pico de RAM y VRAM'], ['Consistencia', 'Equivalencia de las salidas']];
export const Overlay: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <>
      {CARDS.map(([h, d], k) => {
        const o = ex(clamp((t - (1.6 + k * 0.5)) / 0.9)) * (1 - ex(clamp((t - 16.2) / 0.9)));
        const [x, y] = px(CX[k], 0.3);
        return (
          <div key={h} style={{position: 'absolute', left: x - 178, top: y - 195, width: 356, height: 390, padding: 32, boxSizing: 'border-box', opacity: o, transform: `translateY(${(1 - o) * 18}px)`, background: 'linear-gradient(160deg, rgba(86,94,242,0.14), rgba(114,232,237,0.04))', borderRadius: 20, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
            <div style={{fontFamily: fonts.mono, fontSize: 20, letterSpacing: '0.2em', color: colors.slate, marginBottom: 'auto'}}>0{k + 1}</div>
            <div style={{fontFamily: fonts.mono, fontSize: 28, letterSpacing: '0.18em', textTransform: 'uppercase', color: colors.cyan, marginBottom: 16}}>{h}</div>
            <div style={{fontFamily: fonts.sans, fontSize: 28, color: colors.coolWhite, lineHeight: 1.3, minHeight: 74}}>{d}</div>
          </div>
        );
      })}
      <Beat from={8.5} to={16.8} style={{justifyContent: 'flex-end', alignItems: 'center'}}>
        <div style={{fontFamily: fonts.sans, fontSize: 32, color: colors.coolWhite, textAlign: 'center', marginBottom: 20}}>
          <span style={{color: colors.coolWhite, fontWeight: 700}}>AIRE </span><span style={{color: colors.cyan, fontWeight: 700}}>MoE</span> frente a un motor de referencia · mismo modelo, mismo hardware
        </div>
      </Beat>
    </>
  );
};

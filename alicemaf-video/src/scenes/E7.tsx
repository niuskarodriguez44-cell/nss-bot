import React from 'react';
import {useCurrentFrame, Img, AbsoluteFill} from 'remotion';
import {Beat, Label, Title} from '../components/Beat';
import {FPS, assets, colors, fonts} from '../brand/tokens';
import {ambient, clamp, lerp, prog, R1, R2, R3, Formation, ex} from '../engine/rand';

export const formation: Formation = (i, t, o) => {
  ambient(i, t, o, 0, 0, 5);
  // anillo de luz (lazos elípticos rotados, como la portada)
  const L = i % 24, th = (Math.floor(i / 24) / 58) * 6.2832 + t * 0.12, phi = (L / 24) * 3.1416 + t * 0.05;
  const rx = 3.9, ry = 1.7;
  const ex_ = Math.cos(th) * rx, ey = Math.sin(th) * ry;
  const tx = ex_ * Math.cos(phi) - ey * Math.sin(phi) * 0.5, ty = ex_ * Math.sin(phi) * 0.6 + ey * Math.cos(phi);
  const u = prog(t, 0.3 + R1[i] * 2.4, 3);
  const fadeEnd = 1 - ex(clamp((t - 5.8) / 1.0));
  o.x = lerp(o.x, tx, u); o.y = lerp(o.y, ty, u); o.z = lerp(o.z, 0, u);
  o.s = lerp(o.s, 0.032, u); o.c = lerp(o.c, 0.2 + 0.8 * Math.abs(Math.sin(L)), u); o.a = lerp(o.a, 0.6, u) * fadeEnd;
};

export const Overlay: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <>
      <Beat from={0.4} to={3.4} style={{justifyContent: 'center', alignItems: 'center'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 56}}>
          <Img src={assets.isotipo} style={{height: 170}} />
          <div style={{fontFamily: fonts.sans, fontWeight: 700, fontSize: 96, color: colors.coolWhite, lineHeight: 1}}>AliceMaf <span style={{color: colors.indigo}}>12B</span></div>
          <div style={{width: 2, height: 120, background: colors.slate, opacity: 0.5}} />
          <div style={{fontFamily: fonts.sans, fontWeight: 800, fontSize: 96, color: colors.coolWhite, lineHeight: 1}}>AIRE <span style={{color: colors.cyan}}>MoE</span></div>
        </div>
      </Beat>
      <Beat from={6.6} to={10} style={{justifyContent: 'center', alignItems: 'center'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 40}}>
          <div style={{background: colors.coolWhite, borderRadius: 18, padding: '18px 26px'}}><Img src={assets.icimaf} style={{height: 150, display: 'block'}} /></div>
          <div style={{fontFamily: fonts.sans, fontSize: 40, color: colors.coolWhite, lineHeight: 1.25, fontWeight: 600}}>Instituto de Cibernética,<br />Matemática y Física</div>
        </div>
      </Beat>
      <AbsoluteFill style={{background: colors.inkBlue, opacity: ex(clamp((t - 9.2) / 0.8))}} />
    </>
  );
};

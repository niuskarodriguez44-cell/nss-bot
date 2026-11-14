import React from 'react';
import {useCurrentFrame, AbsoluteFill} from 'remotion';
import {Beat, Label, Title} from '../components/Beat';
import {colors, fonts} from '../brand/tokens';
import {R1, R2, R3, rotY, Formation} from '../engine/rand';

// El vidrio y los hilos de luz los pone el plano hero de Blender; aquí solo queda polvo de luz suave.
export const formation: Formation = (i, t, o) => {
  const ph = (R1[i] * 18 + t * 1.6) % 18, x = -9 + ph;
  const k = 1 - 0.8 * Math.exp(-((x - 0.2) ** 2) / 6);
  o.x = x; o.y = (R2[i] - 0.5) * 4.6 * k; o.z = (R3[i] - 0.5) * 3 * k;
  o.s = 0.03; o.c = 0.5 + 0.5 * R3[i]; o.a = (0.16 + 0.3 * Math.exp(-(x * x) / 10)) * Math.min(1, ph / 1.5, (18 - ph) / 1.5);
  rotY(o, -0.3);
};

const AREAS = ['Ejecución de expertos', 'Gestión de memoria', 'Planificación de la inferencia'];
export const Overlay: React.FC = () => {
  const f = useCurrentFrame();
  const flash = Math.max(0, 1 - f / 7) * 0.8;
  return (
    <>
      <AbsoluteFill style={{background: colors.coolWhite, opacity: flash}} />
      <Beat from={0.5} to={4.5} style={{justifyContent: 'center'}}>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 26, fontFamily: fonts.sans, fontWeight: 800, fontSize: 170, letterSpacing: '-0.02em', lineHeight: 1}}>
          <span style={{color: colors.coolWhite}}>AIRE</span><span style={{color: colors.cyan}}>MoE</span>
        </div>
        <Label size={24} style={{marginTop: 24, color: colors.slate}}>Motor de inferencia propio</Label>
      </Beat>
      {AREAS.map((a, k) => (
        <Beat key={a} from={[4.8, 7.9, 11.0][k]} to={[7.9, 11.0, 14.1][k]} style={{justifyContent: 'flex-end'}}>
          <Label size={22} color={colors.slate} style={{marginBottom: 10}}>Área de investigación {k + 1} de 3</Label>
          <Title size={50} style={{maxWidth: 900, marginBottom: 30}}><span style={{color: colors.cyan, fontFamily: fonts.mono, fontWeight: 400, marginRight: 22}}>0{k + 1}</span>{a}</Title>
        </Beat>
      ))}
    </>
  );
};

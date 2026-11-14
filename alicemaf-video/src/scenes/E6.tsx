import React from 'react';
import {useCurrentFrame, AbsoluteFill} from 'remotion';
import {Beat, Label, Title} from '../components/Beat';
import {FPS, colors, fonts} from '../brand/tokens';
import {clamp, lerp, polyline, prog, R1, R2, R3, rotY, rotX, ex, Formation} from '../engine/rand';

const PX = [-4.4, -1.5, 1.5, 4.4]; // paneles de vidrio apilados en profundidad (eje del flujo)
const RECT = polyline([[-2.3, -1.7], [2.3, -1.7], [2.3, 1.7], [-2.3, 1.7]], 120, true);
const ON = [12.2, 18.0, 23.8]; // 3 áreas = 3 capas que se encienden

export const formation: Formation = (i, t, o) => {
  if (i < 480) {
    const p = Math.floor(i / 120), q = RECT[i % 120];
    const lit = p < 3 ? prog(t, ON[p], 0.7) : 0.2;
    const hit = ex(clamp(1 - t / 0.5)); // golpe inicial
    o.x = PX[p]; o.y = q[1]; o.z = q[0];
    o.s = 0.05 + lit * 0.04 + hit * 0.06; o.c = Math.max(0.35, lit, hit); o.a = 0.35 + lit * 0.8 + hit * 0.9;
  } else {
    // flujo de luz que se estrecha al atravesar el vidrio y vuelve a abrirse
    const j = i - 480, ph = (R1[i] * 18 + t * 3.2) % 18, x = -9 + ph;
    const y0 = (R2[i] - 0.5) * 4.4, z0 = (R3[i] - 0.5) * 3.2;
    const k = 1 - 0.82 * Math.exp(-((x - 0.2) ** 2) / 6);
    o.x = x; o.y = y0 * k; o.z = z0 * k; o.s = 0.045; o.c = 0.4 + 0.6 * Math.exp(-(x * x) / 8); o.a = 0.25 + 0.7 * Math.exp(-(x * x) / 12);
    void j;
  }
  rotY(o, -0.42); rotX(o, 0.12);
  o.x += 1.9; // el vidrio ocupa la derecha, la firma va a la izquierda
};

export const Overlay: React.FC = () => {
  const f = useCurrentFrame();
  const flash = Math.max(0, 1 - f / 7) * 0.85;
  const AREAS = ['Ejecución de expertos', 'Gestión de memoria', 'Planificación de la inferencia'];
  return (
    <>
      <AbsoluteFill style={{background: colors.coolWhite, opacity: flash}} />
      <Beat from={1.2} to={10.8} style={{justifyContent: 'center'}}>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 28, fontFamily: fonts.sans, fontWeight: 800, fontSize: 190, letterSpacing: '-0.02em', lineHeight: 1}}>
          <span style={{color: colors.coolWhite}}>AIRE</span><span style={{color: colors.cyan}}>MoE</span>
        </div>
        <Label size={26} style={{marginTop: 28, color: colors.slate}}>Motor de inferencia</Label>
      </Beat>
      {AREAS.map((a, k) => (
        <Beat key={a} from={[11.6, 17.4, 23.2][k]} to={[17.4, 23.2, 30.8][k]} style={{justifyContent: 'center'}}>
          <Label size={24} color={colors.slate} style={{marginBottom: 14}}>Área {k + 1} de 3</Label>
          <Title size={58} style={{maxWidth: 720, color: colors.coolWhite}}><span style={{color: colors.cyan, fontFamily: fonts.mono, fontWeight: 400, marginRight: 24}}>0{k + 1}</span>{a}</Title>
        </Beat>
      ))}
    </>
  );
};

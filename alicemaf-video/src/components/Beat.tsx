import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {FPS, MIN_TEXT_SECONDS, SAFE, colors, fonts} from '../brand/tokens';
import {ex, clamp} from '../engine/rand';

/** Una idea de texto: aparece (0,8 s), se sostiene y se va (0,6 s). Exige >= 2 s completos de lectura. */
export const Beat: React.FC<{from: number; to: number; children: React.ReactNode; style?: React.CSSProperties}> = ({from, to, children, style}) => {
  if (to - from < MIN_TEXT_SECONDS + 0.8) throw new Error(`Beat ${from}-${to}s: menos de ${MIN_TEXT_SECONDS}s legibles`);
  const t = useCurrentFrame() / FPS;
  const fi = ex(clamp((t - from) / 0.8)), fo = ex(clamp((to - t) / 0.6));
  const o = Math.min(fi, fo);
  if (o <= 0.001) return null;
  return (
    <AbsoluteFill style={{padding: `${SAFE * 100}vh ${SAFE * 100}vw ${SAFE * 100 + (style?.justifyContent === 'flex-end' ? 15 : 0)}vh`, display: 'flex', flexDirection: 'column', opacity: o, ...style}}>
      <div style={{filter: `blur(${(1 - o) * 7}px)`, transform: `translateY(${(1 - fi) * 16}px) scale(${0.985 + 0.015 * fi})`, }}>{children}</div>
    </AbsoluteFill>
  );
};

export const Label: React.FC<{children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties}> = ({children, size = 26, color = colors.cyan, style}) => (
  <div style={{fontFamily: fonts.mono, fontSize: size, letterSpacing: '0.28em', textTransform: 'uppercase', color, fontWeight: 400, lineHeight: 1.5, ...style}}>{children}</div>
);
export const Title: React.FC<{children: React.ReactNode; size?: number; weight?: number; color?: string; style?: React.CSSProperties}> = ({children, size = 64, weight = 700, color = colors.coolWhite, style}) => (
  <div style={{fontFamily: fonts.sans, fontSize: size, fontWeight: weight, color, lineHeight: 1.15, letterSpacing: '-0.01em', ...style}}>{children}</div>
);
/** Posición en píxeles de un punto del mundo (plano z=0; 10 unidades = alto del cuadro). */
export const px = (x: number, y: number, W = 1920, H = 1080): [number, number] => [W / 2 + x * (H / 10), H / 2 - y * (H / 10)];

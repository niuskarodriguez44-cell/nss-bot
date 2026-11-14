import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {FPS, SAFE, colors, fonts} from '../brand/tokens';
import {ex, clamp} from '../engine/rand';

// Subtítulos (sin voz en off): el guion narrado. Mínimo 2,8 s por línea y <= 21 caracteres/s.
export const CUES: [number, number, string][] = [
  [0.8, 4.2, 'Una propuesta de investigación'],
  [8.6, 12.0, 'Presentamos AliceMaf 12B y AIRE MoE,'],
  [12.2, 16.0, 'dos proyectos de investigación del ICIMAF'],
  [16.2, 19.9, 'que buscan llevar la IA a las computadoras que ya tenemos,'],
  [20.4, 24.4, 'Los grandes modelos exigen hardware costoso y servicios externos.'],
  [25.0, 29.6, '¿Cómo llevarlos a los equipos que ya tenemos?'],
  [30.4, 34.4, 'En una capa MoE, el enrutador selecciona qué expertos procesan cada token.'],
  [34.8, 39.6, 'Cada token activa solo algunos expertos; el resto descansa.'],
  [40.0, 44.8, 'Las salidas elegidas se combinan en una sola respuesta.'],
  [45.2, 50.2, 'El conocimiento de un modelo grande, con el esfuerzo de uno pequeño.'],
  [52.4, 56.4, 'AliceMaf 12B: un modelo de lenguaje con mezcla de expertos,'],
  [56.8, 60.0, 'pensado para el español de Cuba.'],
  [63.8, 67.6, 'AIRE MoE: el motor de inferencia propio que proponemos,'],
  [76.9, 80.4, 'Se validará frente a un motor de referencia: mismo modelo, mismo hardware.'],
  [80.6, 83.4, 'con un modelo propio y un motor de inferencia propio.'],
  [83.6, 86.9, 'Inteligencia artificial eficiente y soberana, hecha en Cuba'],
];

export const Subtitles: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const cue = CUES.find(([a, b]) => t >= a && t <= b);
  if (!cue) return null;
  const [a, b, text] = cue;
  const fi = ex(clamp((t - a) / 0.5)), fo = ex(clamp((b - t) / 0.4));
  const o = Math.min(fi, fo);
  return (
    <AbsoluteFill style={{padding: `0 ${SAFE * 100}vw ${SAFE * 100 + 1.5}vh`, justifyContent: 'flex-end', alignItems: 'center', pointerEvents: 'none'}}>
      <div style={{opacity: o, transform: `translateY(${(1 - fi) * 10}px)`, filter: `blur(${(1 - o) * 6}px)`, fontFamily: fonts.sans, fontWeight: 600, fontSize: 38, lineHeight: 1.3, color: colors.coolWhite, textAlign: 'center', maxWidth: 1350, textShadow: `0 2px 18px ${colors.inkBlue}, 0 0 4px ${colors.inkBlue}`}}>{text}</div>
    </AbsoluteFill>
  );
};

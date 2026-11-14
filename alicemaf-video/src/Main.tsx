import React from 'react';
import {AbsoluteFill, Img, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {FPS, assets, colors} from './brand/tokens';
import {SCENES, TOTAL_SECONDS} from './timeline';
import {Stage} from './engine/Stage';
import {scenes} from './scenes';

const Backdrop: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const o1 = interpolate(t, [3, 9, 11, 13], [0, 0.4, 0.4, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const o6 = interpolate(t, [118, 118.5, 148, 151], [0, 0.32, 0.32, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const o8 = interpolate(t, [166, 172, 183, 185], [0, 0.5, 0.5, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const z = 1 + t * 0.0006;
  const img = (src: string, o: number) => o > 0.001 ? <Img src={src} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: o, transform: `scale(${z})`}} /> : null;
  return <AbsoluteFill>{img(assets.toroide, o1)}{img(assets.cristal, o6)}{img(assets.toroide, o8)}</AbsoluteFill>;
};

export const Main: React.FC<{width: number; height: number}> = ({width, height}) => (
  <AbsoluteFill style={{background: colors.inkBlue}}>
    <Backdrop />
    <Stage width={width} height={height} />
    {scenes.map((S, k) => {
      const from = Math.round(SCENES[k].start * FPS);
      const end = Math.round((SCENES[k + 1]?.start ?? TOTAL_SECONDS) * FPS);
      return <Sequence key={k} from={from} durationInFrames={end - from} name={SCENES[k].id}><S.Overlay /></Sequence>;
    })}
  </AbsoluteFill>
);

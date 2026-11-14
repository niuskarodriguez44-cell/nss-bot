import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {FPS, HERO_VIDEO, assets, colors} from './brand/tokens';
import {SCENES, TOTAL_SECONDS} from './timeline';
import {Stage} from './engine/Stage';
import {scenes} from './scenes';

const Backdrop: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const o6 = HERO_VIDEO ? 0 : interpolate(t, [63, 63.4, 79, 81], [0, 0.32, 0.32, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const o7 = interpolate(t, [80, 83, 86, 89], [0, 0.4, 0.22, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const img = (src: string, o: number) => o > 0.001 ? <Img src={src} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: o, transform: `scale(${1 + t * 0.0006})`}} /> : null;
  return (
    <AbsoluteFill>
      {img(assets.cristal, o6)}{img(assets.toroide, o7)}
      {HERO_VIDEO && (
        <Sequence from={63 * FPS} durationInFrames={17 * FPS}>
          <OffthreadVideo src={staticFile('hero/aire.mp4')} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        </Sequence>
      )}
    </AbsoluteFill>
  );
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

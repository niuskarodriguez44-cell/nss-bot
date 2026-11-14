import React from 'react';
import {AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {FPS, HERO_VIDEO, assets, colors} from './brand/tokens';
import {SCENES, TOTAL_SECONDS} from './timeline';
import {Stage} from './engine/Stage';
import {scenes} from './scenes';
import {Subtitles} from './components/Subtitles';

const Finish: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(8,14,37,0) 52%, rgba(4,7,20,0.62) 100%)', pointerEvents: 'none'}} />
      <AbsoluteFill style={{background: 'linear-gradient(to top, rgba(8,14,37,0.72) 0%, rgba(8,14,37,0.35) 18%, rgba(8,14,37,0) 34%)', pointerEvents: 'none'}} />
      <AbsoluteFill style={{opacity: 0.07, mixBlendMode: 'overlay', pointerEvents: 'none'}}>
        <svg width="100%" height="100%"><filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={f % 24} /></filter><rect width="100%" height="100%" filter="url(#g)" /></svg>
      </AbsoluteFill>
    </>
  );
};

const Backdrop: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const o6 = 0 * interpolate(t, [63, 63.4, 79, 81], [0, 0.32, 0.32, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
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
    <Subtitles />
    <Finish />
    <Audio src={staticFile('audio/soundtrack.wav')} />
  </AbsoluteFill>
);

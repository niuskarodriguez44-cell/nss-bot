import React from 'react';
import {Composition, continueRender, delayRender} from 'remotion';
import {FPS, fontFaces} from './brand/tokens';
import {E1} from './scenes/E1';
import {E2} from './scenes/E2';
import {E3} from './scenes/E3';
import {E4} from './scenes/E4';
import {E5} from './scenes/E5';
import {E6} from './scenes/E6';
import {E7} from './scenes/E7';
import {E8} from './scenes/E8';

const useFonts = () => {
  const [h] = React.useState(() => delayRender('fonts'));
  React.useEffect(() => {
    Promise.all(fontFaces.map((f) => new FontFace(f.family, `url(${f.url})`, {weight: String(f.weight)}).load()))
      .then((l) => { l.forEach((x) => document.fonts.add(x)); continueRender(h); });
  }, [h]);
};

export const Root: React.FC = () => {
  useFonts();
  return (
    <>
      <Composition id="E1" component={E1} durationInFrames={150} fps={FPS} width={1920} height={1080} />
      <Composition id="E2" component={E2} durationInFrames={150} fps={FPS} width={1920} height={1080} />
      <Composition id="E3" component={E3} durationInFrames={150} fps={FPS} width={1920} height={1080} />
      <Composition id="E4" component={E4} durationInFrames={150} fps={FPS} width={1920} height={1080} />
      <Composition id="E5" component={E5} durationInFrames={150} fps={FPS} width={1920} height={1080} />
      <Composition id="E6" component={E6} durationInFrames={150} fps={FPS} width={1920} height={1080} />
      <Composition id="E7" component={E7} durationInFrames={150} fps={FPS} width={1920} height={1080} />
      <Composition id="E8" component={E8} durationInFrames={150} fps={FPS} width={1920} height={1080} />
    </>
  );
};

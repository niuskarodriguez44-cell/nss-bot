import React from 'react';
import {Composition, continueRender, delayRender} from 'remotion';
import {FPS, fontFaces} from './brand/tokens';
import {TOTAL_SECONDS} from './timeline';
import {Main} from './Main';

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
    <Composition id="Main" component={Main} durationInFrames={TOTAL_SECONDS * FPS} fps={FPS} width={1920} height={1080} defaultProps={{width: 1920, height: 1080}} />
  );
};

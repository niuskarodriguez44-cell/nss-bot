import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {Frame} from '../components/Frame';
import {colors, fonts, ease} from '../brand/tokens';

// E1: marcador de posición. Pendiente del guion.
export const E1: React.FC = () => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 20], [0, 1], {easing: ease, extrapolateRight: 'clamp'});
  return (
    <Frame>
      <div style={{opacity: o, color: colors.coolWhite, fontFamily: fonts.mono, fontSize: 48}}>E1</div>
    </Frame>
  );
};

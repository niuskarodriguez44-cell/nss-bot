import React from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import {colors, SAFE} from '../brand/tokens';

/** Fondo azul tinta + zona segura del 5 % para texto. */
export const Frame: React.FC<{children?: React.ReactNode; bg?: React.ReactNode}> = ({children, bg}) => {
  const {width, height} = useVideoConfig();
  return (
    <AbsoluteFill style={{background: colors.inkBlue}}>
      {bg}
      <AbsoluteFill style={{padding: `${height * SAFE}px ${width * SAFE}px`}}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

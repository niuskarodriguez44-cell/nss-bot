import React from "react";
import { AbsoluteFill } from "remotion";
import {
  BEAVER,
  C,
  FOX,
  HEART,
  OWL,
  PLUG_DIAMOND,
  PLUG_HEX,
  PLUG_ROUND,
  PLUG_SQUARE,
  PLUG_TRI,
  SQUIRREL,
  Sprite,
  TEACHER,
  TURTLE,
  STAR,
  BOOK,
  WRENCH,
  SCROLL,
  CAL,
  DOC,
  LOCK,
  CROSS,
  HAND,
} from "./pixel";

export const SpriteSheet: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.sky }}>
    <svg width={1920} height={1080}>
      <Sprite rows={OWL} x={40} y={40} s={14} />
      <Sprite rows={SQUIRREL} x={300} y={40} s={14} />
      <Sprite rows={BEAVER} x={560} y={40} s={14} />
      <Sprite rows={FOX} x={820} y={40} s={14} />
      <Sprite rows={TURTLE} x={1080} y={40} s={14} />
      <Sprite rows={TEACHER} x={1340} y={40} s={14} />
      {[HEART, STAR, BOOK, WRENCH, SCROLL, CAL, DOC, LOCK, CROSS, HAND].map(
        (r, i) => (
          <Sprite key={i} rows={r} x={40 + i * 150} y={400} s={14} />
        ),
      )}
      {[PLUG_SQUARE, PLUG_ROUND, PLUG_TRI, PLUG_DIAMOND, PLUG_HEX].map(
        (r, i) => (
          <Sprite key={i} rows={r} x={40 + i * 150} y={640} s={14} />
        ),
      )}
    </svg>
  </AbsoluteFill>
);

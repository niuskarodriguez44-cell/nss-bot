import React from "react";
import { AbsoluteFill, spring, useVideoConfig } from "remotion";
import { Bubble, BUBBLE_H, BUBBLE_STEP, BUBBLE_W } from "../components/Bubble";
import { COLORS, CX, CY, ease, LINE, LORA, lin, useScene } from "../theme";
import type { SceneProps } from "./types";

const ARROW_R = 390;
const SVG_SIZE = 2 * ARROW_R + 80;
const C = SVG_SIZE / 2;

const polar = (deg: number, r: number) => {
  const a = (deg * Math.PI) / 180;
  return { x: C + r * Math.cos(a), y: C + r * Math.sin(a) };
};

/** Flecha circular: arco de 300° con punta de flecha al final (sentido horario). */
const buildArrow = () => {
  const startDeg = -70;
  const endDeg = 230;
  const s = polar(startDeg, ARROW_R);
  const e = polar(endDeg, ARROW_R);
  const a = (endDeg * Math.PI) / 180;
  // Tangente horaria en el extremo y vector "hacia atrás".
  const back = { x: Math.sin(a), y: -Math.cos(a) };
  const rot = (v: { x: number; y: number }, deg: number) => {
    const r = (deg * Math.PI) / 180;
    return {
      x: v.x * Math.cos(r) - v.y * Math.sin(r),
      y: v.x * Math.sin(r) + v.y * Math.cos(r),
    };
  };
  const head = 34;
  const p1 = rot(back, 28);
  const p2 = rot(back, -28);
  return {
    arc: `M ${s.x} ${s.y} A ${ARROW_R} ${ARROW_R} 0 1 1 ${e.x} ${e.y}`,
    head: `M ${e.x + p1.x * head} ${e.y + p1.y * head} L ${e.x} ${e.y} L ${
      e.x + p2.x * head
    } ${e.y + p2.y * head}`,
  };
};

const ARROW = buildArrow();

export const Scene2Problem: React.FC<SceneProps> = ({
  texts,
  lead,
  durationInFrames,
}) => {
  const { frame, opacity } = useScene(lead, durationInFrames, true);
  const { fps } = useVideoConfig();

  // La flecha gira 0 -> 360° durante la escena (nominal: 150 frames).
  const rotation = lin(frame, [0, 150], [0, 360]);
  const arrowIn = ease(frame, [0, 20], [0, 1]);

  // Frame global 210 = frame 90 de la escena (120 + 90).
  const captionP = ease(frame, [90, 112], [0, 1]);

  return (
    <AbsoluteFill style={{ opacity }}>
      <svg
        width={SVG_SIZE}
        height={SVG_SIZE}
        viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
        style={{
          position: "absolute",
          left: CX - C,
          top: CY - C,
          opacity: arrowIn,
          transform: `rotate(${rotation}deg)`,
          transformOrigin: "50% 50%",
        }}
      >
        <path
          d={ARROW.arc}
          fill="none"
          stroke={COLORS.midGray}
          strokeWidth={LINE}
          strokeLinecap="round"
        />
        <path
          d={ARROW.head}
          fill="none"
          stroke={COLORS.midGray}
          strokeWidth={LINE}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {[0, 1, 2].map((i) => {
        // Entrada escalonada cada 20 frames, spring sin rebote.
        const s = spring({
          frame: frame - i * 20,
          fps,
          config: { damping: 200 },
        });
        return (
          <Bubble
            key={i}
            text={texts.s2.bubble}
            style={{
              position: "absolute",
              left: CX - BUBBLE_W / 2,
              top: CY + (i - 1) * BUBBLE_STEP - BUBBLE_H / 2,
              opacity: s,
              transform: `translateY(${(1 - s) * 160}px)`,
            }}
          />
        );
      })}

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 905,
          textAlign: "center",
          fontFamily: LORA,
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: 40,
          color: COLORS.midGray,
          opacity: captionP,
          transform: `translateY(${(1 - captionP) * 24}px)`,
        }}
      >
        {texts.s2.caption}
      </div>
    </AbsoluteFill>
  );
};

import React from "react";
import { AbsoluteFill } from "remotion";
import { cameraStyle } from "../camera";
import { SANS, SERIF, ease, P } from "../theme";
import { useScene } from "../../theme";
import type { AgentSceneProps } from "../types";

const Line: React.FC<{ text: string; frame: number; start: number; italic?: boolean; color?: string }> = ({
  text,
  frame,
  start,
  italic,
  color = P.dark,
}) => {
  const p = ease(frame, [start, start + 34], [0, 1]);
  return (
    <div style={{ overflow: "hidden", height: 150, textAlign: "center" }}>
      <div
        style={{
          fontFamily: SERIF,
          fontStyle: italic ? "italic" : "normal",
          fontSize: 124,
          lineHeight: "150px",
          color,
          opacity: p,
          transform: `translateY(${(1 - p) * 150}px)`,
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </div>
    </div>
  );
};

export const A7Outro: React.FC<AgentSceneProps> = ({ texts, lead, durationInFrames }) => {
  // Última escena: sin fade out; el cierre se queda en pantalla.
  const { frame, opacity } = useScene(lead, durationInFrames, false);
  const t = texts.a7;
  const cam = cameraStyle(frame, [
    { f: 0, x: 960, y: 520, s: 1.12, r: 0.5 },
    { f: 120, x: 960, y: 530, s: 1.0, r: 0 },
  ]);
  const sub = ease(frame, [64, 94], [0, 1]);
  return (
    <AbsoluteFill style={{ opacity }}>
      <div style={cam}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 250 }}>
          <Line text={t.line1} frame={frame} start={6} />
          <Line text={t.line2} frame={frame} start={26} italic color={P.orange} />
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 590,
            textAlign: "center",
            fontFamily: SANS,
            fontWeight: 500,
            fontSize: 34,
            color: P.dark,
            letterSpacing: 1,
            opacity: sub,
            transform: `translateY(${(1 - sub) * 24}px)`,
          }}
        >
          {t.subtitle}
        </div>
      </div>
    </AbsoluteFill>
  );
};

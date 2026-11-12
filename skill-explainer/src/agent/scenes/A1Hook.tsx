import React from "react";
import { AbsoluteFill } from "remotion";
import { MaskSwap } from "../../components/MaskSwap";
import { cameraStyle } from "../camera";
import { ease, lin, P, SERIF } from "../theme";
import { useScene } from "../../theme";
import type { AgentSceneProps } from "../types";

/** Línea que se revela deslizándose hacia arriba dentro de una máscara. */
const RevealLine: React.FC<{
  text: string;
  frame: number;
  start: number;
  size: number;
  color?: string;
  italic?: boolean;
}> = ({ text, frame, start, size, color = P.dark, italic }) => {
  const p = ease(frame, [start, start + 34], [0, 1]);
  return (
    <div style={{ overflow: "hidden", height: size * 1.2, textAlign: "center" }}>
      <div
        style={{
          fontFamily: SERIF,
          fontStyle: italic ? "italic" : "normal",
          fontWeight: 400,
          fontSize: size,
          lineHeight: `${size * 1.2}px`,
          color,
          transform: `translateY(${(1 - p) * size * 1.2}px)`,
          opacity: p,
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </div>
    </div>
  );
};

export const A1Hook: React.FC<AgentSceneProps> = ({ texts, lead, durationInFrames }) => {
  const { frame, opacity } = useScene(lead, durationInFrames, true);
  const t = texts.a1;
  const swapPos = ease(frame, [96, 126], [0, 1]);
  const lineOpacity = 1 - ease(frame, [92, 112], [0, 1]);

  // Cámara: empuje lento y una pequeña inclinación al final.
  const cam = cameraStyle(frame, [
    { f: 0, x: 960, y: 540, s: 1.0, r: -0.6 },
    { f: 100, x: 960, y: 520, s: 1.05, r: 0 },
    { f: 180, x: 960, y: 540, s: 1.12, r: 0.5 },
  ]);

  return (
    <AbsoluteFill style={{ opacity }}>
      <div style={cam}>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 330,
            opacity: lineOpacity,
          }}
        >
          <RevealLine text={t.line1} frame={frame} start={8} size={120} />
          <div style={{ height: 14 }} />
          <RevealLine text={t.line2} frame={frame} start={30} size={120} italic color={P.orange} />
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 410,
            opacity: ease(frame, [100, 124], [0, 1]),
          }}
        >
          <MaskSwap
            items={[<span key="a" />, <span key="b" style={{ fontFamily: SERIF, fontSize: 150, color: P.dark }}>{t.swap}</span>]}
            pos={swapPos}
            height={190}
            justify="center"
            style={{ width: 1920 }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 640,
            textAlign: "center",
            height: 3,
          }}
        >
          <div
            style={{
              margin: "0 auto",
              height: 3,
              width: lin(frame, [120, 160], [0, 160]),
              backgroundColor: P.dark,
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

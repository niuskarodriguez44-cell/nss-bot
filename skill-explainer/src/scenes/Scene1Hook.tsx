import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS, ease, POPPINS, useScene } from "../theme";
import type { SceneProps } from "./types";

const FRAMES_PER_CHAR = 3;

export const Scene1Hook: React.FC<SceneProps> = ({
  texts,
  lead,
  durationInFrames,
}) => {
  const { frame, opacity } = useScene(lead, durationInFrames, true);
  const title = texts.s1.title;

  // Máquina de escribir: 1 carácter cada 3 frames.
  const visibleChars = Math.min(
    title.length,
    Math.max(0, Math.floor(frame / FRAMES_PER_CHAR)),
  );
  const typed = title.slice(0, visibleChars);

  // Cursor naranja: opacidad alterna cada 15 frames.
  const cursorOpacity = Math.floor(Math.max(0, frame) / 15) % 2 === 0 ? 1 : 0;

  // Punto naranja: scale 1 -> 1.2 -> 1 con Math.sin(frame / 8).
  const dotScale = 1.1 + 0.1 * Math.sin(frame / 8);
  const dotIn = ease(frame, [0, 18], [0, 1]);

  const titleStyle: React.CSSProperties = {
    fontFamily: POPPINS,
    fontWeight: 600,
    fontSize: 96,
    lineHeight: "120px",
    color: COLORS.dark,
    whiteSpace: "pre",
  };

  return (
    <AbsoluteFill
      style={{
        opacity,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ position: "relative" }}>
          {/* Texto completo invisible: reserva el ancho para centrar el título */}
          <div style={{ ...titleStyle, visibility: "hidden" }}>{title}</div>
          <div style={{ ...titleStyle, position: "absolute", left: 0, top: 0 }}>
            {typed}
            <span
              style={{
                display: "inline-block",
                width: 0,
                height: 100,
                verticalAlign: "middle",
                position: "relative",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  left: 6,
                  top: 0,
                  width: 6,
                  height: 100,
                  borderRadius: 3,
                  backgroundColor: COLORS.orange,
                  opacity: cursorOpacity,
                }}
              />
            </span>
          </div>
        </div>
        <div
          style={{
            width: 24,
            height: 24,
            marginLeft: 48,
            borderRadius: 12,
            backgroundColor: COLORS.orange,
            opacity: dotIn,
            transform: `scale(${dotScale})`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

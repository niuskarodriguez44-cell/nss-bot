import React from "react";
import { AbsoluteFill, Easing } from "remotion";
import { Bubble, BUBBLE_H, BUBBLE_STEP, BUBBLE_W } from "../components/Bubble";
import { CARD_H, CARD_W, SkillCard } from "../components/SkillCard";
import { CX, CY, ease, useScene } from "../theme";
import type { SceneProps } from "./types";

export const Scene3Build: React.FC<SceneProps> = ({
  texts,
  lead,
  durationInFrames,
}) => {
  const { frame, opacity } = useScene(lead, durationInFrames, true);

  // Push-in suave de toda la escena: scale 1 -> 1.05.
  const pushIn = ease(frame, [0, 180], [1, 1.05], Easing.inOut(Easing.sin));

  // La tarjeta aparece mientras las burbujas convergen.
  const cardIn = ease(frame, [18, 48], [0, 1]);
  const cardScale = ease(frame, [18, 48], [0.82, 1]);

  // Cuatro filas, una cada 18 frames.
  const rowsProgress = texts.s3.rows.map((_, i) =>
    ease(frame, [50 + i * 18, 50 + i * 18 + 16], [0, 1]),
  );

  // Contorno naranja al terminar las filas.
  const outlineProgress = ease(frame, [128, 164], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: `scale(${pushIn})`,
        transformOrigin: `${CX}px ${CY}px`,
      }}
    >
      {[0, 1, 2].map((i) => {
        const startY = (i - 1) * BUBBLE_STEP;
        const t = ease(frame, [4 + i * 3, 40 + i * 3], [0, 1]);
        return (
          <Bubble
            key={i}
            text={texts.s2.bubble}
            style={{
              position: "absolute",
              left: CX - BUBBLE_W / 2,
              top: CY - BUBBLE_H / 2,
              opacity: 1 - ease(frame, [18 + i * 3, 42 + i * 3], [0, 1]),
              transform: `translateY(${startY * (1 - t)}px) scale(${
                1 - 0.15 * t
              })`,
            }}
          />
        );
      })}

      <div
        style={{
          position: "absolute",
          left: CX - CARD_W / 2,
          top: CY - CARD_H / 2,
          opacity: cardIn,
          transform: `scale(${cardScale})`,
        }}
      >
        <SkillCard
          file={texts.s3.file}
          rows={texts.s3.rows}
          rowsProgress={rowsProgress}
          outlineProgress={outlineProgress}
          glow={0}
        />
      </div>
    </AbsoluteFill>
  );
};

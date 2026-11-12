import React from "react";
import {
  AbsoluteFill,
  Audio,
  getStaticFiles,
  interpolate,
  Sequence,
  staticFile,
} from "remotion";
import { COLORS, FADE } from "./theme";
import { Scene1Hook } from "./scenes/Scene1Hook";
import { Scene2Problem } from "./scenes/Scene2Problem";
import { Scene3Build } from "./scenes/Scene3Build";
import { Scene4Result } from "./scenes/Scene4Result";

/** Todos los textos del video, editables en un solo lugar. */
export const TEXTS = {
  s1: {
    title: "¿Qué es una Skill?",
  },
  s2: {
    bubble: "Hazme un plan de clase…",
    caption: "Repites lo mismo cada semana",
  },
  s3: {
    file: "plan-de-clase / SKILL.md",
    rows: ["Cuándo usarla", "Pasos", "Formato", "Ejemplo"],
  },
  s4: {
    bubble: "Clase de fracciones",
    tableHeaders: ["Momento", "Actividad", "Tiempo"],
    tableRows: [
      ["Inicio", "Pizzas y fracciones", "10 min"],
      ["Desarrollo", "Fracciones equivalentes", "30 min"],
      ["Cierre", "Ticket de salida", "10 min"],
    ],
    titleA: "Escríbela una vez.",
    titleB: "Úsala siempre.",
    subtitle: "Skills · IA aplicada a la docencia",
  },
};

export type Texts = typeof TEXTS;

export const TOTAL_FRAMES = 600;

/**
 * Cada escena tiene un tramo "nominal" (0-120, 120-270, 270-450, 450-600).
 * Las escenas 2-4 se montan FADE frames antes para solaparse con la anterior:
 * mientras una hace fade out la siguiente hace fade in.
 */
const SCENES = {
  s1: { from: 0, duration: 120, lead: 0 },
  s2: { from: 120 - FADE, duration: 150 + FADE, lead: FADE },
  s3: { from: 270 - FADE, duration: 180 + FADE, lead: FADE },
  s4: { from: 450 - FADE, duration: 150 + FADE, lead: FADE },
};

// Si no existe public/music.mp3 se omite el audio y el render no se rompe.
const HAS_MUSIC = getStaticFiles().some((file) => file.name === "music.mp3");

export const SkillExplainer: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      {HAS_MUSIC ? (
        <Audio
          src={staticFile("music.mp3")}
          volume={(f) =>
            interpolate(
              f,
              [0, 15, TOTAL_FRAMES - 30, TOTAL_FRAMES],
              [0, 0.4, 0.4, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            )
          }
        />
      ) : null}

      <Sequence from={SCENES.s1.from} durationInFrames={SCENES.s1.duration}>
        <Scene1Hook
          texts={TEXTS}
          lead={SCENES.s1.lead}
          durationInFrames={SCENES.s1.duration}
        />
      </Sequence>

      <Sequence from={SCENES.s2.from} durationInFrames={SCENES.s2.duration}>
        <Scene2Problem
          texts={TEXTS}
          lead={SCENES.s2.lead}
          durationInFrames={SCENES.s2.duration}
        />
      </Sequence>

      <Sequence from={SCENES.s3.from} durationInFrames={SCENES.s3.duration}>
        <Scene3Build
          texts={TEXTS}
          lead={SCENES.s3.lead}
          durationInFrames={SCENES.s3.duration}
        />
      </Sequence>

      <Sequence from={SCENES.s4.from} durationInFrames={SCENES.s4.duration}>
        <Scene4Result
          texts={TEXTS}
          lead={SCENES.s4.lead}
          durationInFrames={SCENES.s4.duration}
        />
      </Sequence>
    </AbsoluteFill>
  );
};

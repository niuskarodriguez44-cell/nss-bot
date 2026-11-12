import React from "react";
import { Audio, getStaticFiles, interpolate, staticFile } from "remotion";
import { SfxLayer } from "./SfxLayer";
import { FADE } from "./theme";
import { SCENES, TOTAL_FRAMES } from "./timeline";
import { TYPE_START, CALLOUT_START, CALLOUT_STEP } from "./scenes/Scene4Example";
import { FLOW } from "./scenes/Scene5Flow";
import { RESULT } from "./scenes/Scene6Result";

type SfxName = "tick" | "tock" | "pop" | "whoosh" | "chime" | "success" | "sparkle";
type Cue = { frame: number; name: SfxName; volume: number };

/** Lista de efectos de sonido, sincronizados con los frames de cada escena. */
const buildCues = (): Cue[] => {
  const cues: Cue[] = [];
  const add = (frame: number, name: SfxName, volume = 1) =>
    cues.push({ frame: Math.max(0, Math.round(frame)), name, volume });
  const S = SCENES;

  // Transiciones entre escenas
  [S.problem, S.build, S.example, S.flow, S.result].forEach((s) => add(s.from - FADE, "whoosh", 0.28));

  // 1 · Hook: teclas + punto naranja
  for (let k = 1; k <= 18; k++) add(S.hook.from + 3 * k, "tick", 0.45);
  add(S.hook.from + 14, "pop", 0.5);

  // 2 · Problema
  [0, 20, 40].forEach((o) => add(S.problem.from + o + 3, "pop", 0.5));
  add(S.problem.from + 92, "chime", 0.3);

  // 3 · Construir la skill
  add(S.build.from + 8, "whoosh", 0.3);
  add(S.build.from + 30, "pop", 0.5);
  [0, 1, 2, 3].forEach((i) => add(S.build.from + 54 + i * 18, "tock", 0.5));
  add(S.build.from + 130, "whoosh", 0.22);
  add(S.build.from + 164, "success", 0.45);

  // 4 · Skill de ejemplo
  add(S.example.from + 4, "whoosh", 0.32);
  for (let f = TYPE_START; f < TYPE_START + 120; f += 4) add(S.example.from + f, "tick", 0.3);
  for (let i = 0; i < 5; i++) {
    const s = S.example.from + CALLOUT_START + i * CALLOUT_STEP;
    add(s + 4, "whoosh", 0.18);
    add(s + 14, "pop", 0.45);
  }
  add(S.example.from + CALLOUT_START + 4 * CALLOUT_STEP + 22, "chime", 0.4);

  // 5 · Cómo la usa Claude
  [0, 1, 2, 3].forEach((i) => add(S.flow.from + i * 5 + 2, "pop", 0.28));
  add(S.flow.from + FLOW.requestIn + 2, "pop", 0.5);
  add(S.flow.from + FLOW.pathRequest, "whoosh", 0.2);
  [0, 1, 2].forEach((k) => add(S.flow.from + FLOW.scanStops[2 + k * 2] - 2, "tock", 0.45));
  add(S.flow.from + FLOW.match, "chime", 0.5);
  add(S.flow.from + FLOW.pathLoad, "whoosh", 0.28);
  [0, 1, 2, 3].forEach((r) => add(S.flow.from + FLOW.tableStart + r * 8, "tock", 0.4));
  add(S.flow.from + FLOW.checkStart + 6, "success", 0.4);

  // 6 · Resultado
  const R = S.result.from;
  add(R + RESULT.cardIn + 2, "pop", 0.45);
  RESULT.flights.forEach((fl, i) => {
    add(R + fl.s, "whoosh", 0.3);
    add(R + fl.s + fl.d - 4, i === 0 ? "sparkle" : "pop", i === 0 ? 0.5 : 0.5);
  });
  add(R + RESULT.shrink, "whoosh", 0.25);
  [0, 1, 2, 3].forEach((r) => add(R + RESULT.tableStart + r * 8, "tock", 0.4));
  RESULT.swaps.forEach((s) => [0, 1, 2].forEach((r) => add(R + s + r * 5, "tock", 0.3)));
  add(R + RESULT.title, "whoosh", 0.3);
  add(R + RESULT.title + 8, "success", 0.5);

  return cues;
};

const CUES = buildCues();

// Cada nombre de cue usa un rol de sonido "foley" (ver scripts/make_sfx_foley.py).
const ROLE: Record<string, string> = {
  tick: "key",
  tock: "tok",
  pop: "note",
  whoosh: "whoosh",
  chime: "bell",
  success: "bell_up",
  sparkle: "sparkle",
};

// Si falta algún archivo en public/, simplemente se omite (el render no se rompe).
const hasMusic = new Set(getStaticFiles().map((f) => f.name)).has("music.mp3");

export const Soundtrack: React.FC = () => (
  <>
    {hasMusic ? (
      <Audio
        src={staticFile("music.mp3")}
        volume={(f) =>
          interpolate(f, [0, 15, TOTAL_FRAMES - 30, TOTAL_FRAMES], [0, 0.4, 0.4, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
      />
    ) : null}
    <SfxLayer cues={CUES} roleOf={ROLE} prefix="v1" gain={1.4} />
  </>
);

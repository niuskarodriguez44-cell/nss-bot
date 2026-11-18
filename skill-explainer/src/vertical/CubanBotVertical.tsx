import React from "react";
import {
  AbsoluteFill,
  Audio,
  getStaticFiles,
  interpolate,
  Sequence,
  staticFile,
} from "remotion";
import { SfxLayer } from "../SfxLayer";
import {
  Backdrop,
  S1Hook,
  S2Gauge,
  S3Ring,
  S4Nodes,
  S5Apps,
  S6Night,
  S7Statement,
  S8End,
} from "./scenes";
import { FPS, NARR_DELAY, SCENE, TOTAL } from "./theme";

const SCENES = [
  S1Hook,
  S2Gauge,
  S3Ring,
  S4Nodes,
  S5Apps,
  S6Night,
  S7Statement,
  S8End,
];

/** Volumen de la música por escena: contraste (sube en "Presentamos", baja en "mientras duermes", final fuerte). */
const MUSIC_LEVEL = [0.16, 0.18, 0.2, 0.34, 0.3, 0.1, 0.24, 0.36];

export const CubanBotVertical: React.FC = () => {
  const f = new Set(getStaticFiles().map((x) => x.name));
  const cues = SCENES.slice(1).map((_, i) => ({
    frame: SCENE(i + 1).from - 3,
    name: "whoosh_s",
    volume: 0.25,
  }));
  return (
    <AbsoluteFill>
      <Backdrop />
      {f.has("vertical/narracion.mp3") ? (
        <Sequence from={Math.round(NARR_DELAY * FPS)} layout="none">
          <Audio src={staticFile("vertical/narracion.mp3")} />
        </Sequence>
      ) : null}
      {f.has("vertical/musica.mp3") ? (
        <Audio
          src={staticFile("vertical/musica.mp3")}
          volume={(fr) => {
            const idx = SCENES.findIndex(
              (_, i) =>
                fr >= SCENE(i).from && fr < SCENE(i).from + SCENE(i).dur,
            );
            const i = Math.max(0, idx);
            const next = MUSIC_LEVEL[Math.min(i + 1, MUSIC_LEVEL.length - 1)];
            const s = SCENE(i);
            // Transición suave de nivel en los últimos 10 frames de cada escena.
            const level = interpolate(
              fr,
              [s.from + s.dur - 10, s.from + s.dur],
              [MUSIC_LEVEL[i], next],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            );
            const fade = interpolate(
              fr,
              [0, 12, TOTAL - 40, TOTAL],
              [0, 1, 1, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            );
            return level * fade;
          }}
        />
      ) : null}
      <SfxLayer cues={cues} roleOf={{}} prefix="v1" gain={1} />
      {SCENES.map((Scene, i) => {
        const s = SCENE(i);
        return (
          <Sequence key={i} from={s.from} durationInFrames={s.dur}>
            <Scene dur={s.dur} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

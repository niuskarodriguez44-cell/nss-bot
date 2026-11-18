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
import { B, NARR_DELAY, SCENE, TOTAL, FPS } from "./brand";
import {
  C1Intro,
  C2Team,
  C3Profile,
  C4Map,
  C5Apps,
  C6Auto,
  C7Feed,
  C8Phone,
  C9Outro,
} from "./scenes";

const SCENES = [
  C1Intro,
  C2Team,
  C3Profile,
  C4Map,
  C5Apps,
  C6Auto,
  C7Feed,
  C8Phone,
  C9Outro,
];

const files = () => new Set(getStaticFiles().map((f) => f.name));

/** Sonidos discretos: un "tap" en cada corte de escena y un whoosh suave. */
const cues = () => {
  const out: { frame: number; name: string; volume: number }[] = [];
  for (let i = 1; i < SCENES.length; i++) {
    out.push({ frame: SCENE(i).from - 4, name: "whoosh_s", volume: 0.18 });
  }
  return out;
};

export const CubanBotLaunch: React.FC = () => {
  const f = files();
  return (
    <AbsoluteFill style={{ backgroundColor: B.paper }}>
      {f.has("cubanbot/narracion.mp3") ? (
        <Sequence from={Math.round(NARR_DELAY * FPS)} layout="none">
          <Audio src={staticFile("cubanbot/narracion.mp3")} volume={1} />
        </Sequence>
      ) : null}
      {f.has("cubanbot/musica.mp3") ? (
        <Audio
          src={staticFile("cubanbot/musica.mp3")}
          volume={(fr) =>
            interpolate(fr, [0, 20, TOTAL - 50, TOTAL], [0, 0.16, 0.16, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })
          }
        />
      ) : null}
      <SfxLayer cues={cues()} roleOf={{}} prefix="v1" gain={1} />
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

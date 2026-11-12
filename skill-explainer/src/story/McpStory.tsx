import React from "react";
import {
  AbsoluteFill,
  Audio,
  getStaticFiles,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { SfxLayer } from "../SfxLayer";
import { C } from "./pixel";
import {
  P1Hook,
  P2Problem,
  P3Idea,
  P4How,
  P5Example,
  P6Friend,
  P7Finale,
} from "./scenes";
import { LINES, SC, STORY_TOTAL, EV } from "./script";

/** Orden fijo y determinista de las celdas del barrido (mulberry32 con semilla). */
const ORDER = (() => {
  let s = 20260;
  const rnd = () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const cells = Array.from({ length: 144 }, (_, i) => ({ i, k: rnd() }));
  cells.sort((a, b) => a.k - b.k);
  const rank = new Array<number>(144);
  cells.forEach((c, r) => (rank[c.i] = r));
  return rank;
})();

const WIPE = 9;
const BOUNDARIES = [
  SC.s2.from,
  SC.s3.from,
  SC.s4.from,
  SC.s5.from,
  SC.s6.from,
  SC.s7.from,
];

/** Barrido de bloques negros entre escenas (cubre y descubre, estilo consola). */
const BlockWipe: React.FC = () => {
  const frame = useCurrentFrame();
  let cover = 0;
  for (const b of BOUNDARIES) {
    if (frame >= b - WIPE && frame < b)
      cover = Math.max(cover, (frame - (b - WIPE) + 1) / WIPE);
    if (frame >= b && frame < b + WIPE)
      cover = Math.max(cover, 1 - (frame - b + 1) / WIPE);
  }
  if (cover <= 0) return null;
  return (
    <AbsoluteFill>
      <svg width={1920} height={1080}>
        {ORDER.map((rank, i) =>
          rank / 144 < cover ? (
            <rect
              key={i}
              x={(i % 16) * 120}
              y={Math.floor(i / 16) * 120}
              width={121}
              height={121}
              fill={C.ink}
            />
          ) : null,
        )}
      </svg>
    </AbsoluteFill>
  );
};

type NamedCue = { frame: number; name: string; volume: number };

const buildCues = (): NamedCue[] => {
  const cues: NamedCue[] = [];
  const add = (frame: number, name: string, volume = 0.6) =>
    cues.push({ frame: Math.max(0, Math.round(frame)), name, volume });
  const g = (k: keyof typeof SC, f: number) => SC[k].from + f;

  // Barridos entre escenas
  BOUNDARIES.forEach((b) => add(b - WIPE, "wipe", 0.35));

  // Voces: un blip cada 2 caracteres (pitch propio de cada personaje)
  for (const l of LINES) {
    const text = l.lines.join("");
    for (let i = 0; i < text.length; i += 2) {
      if (text[i] === " ") continue;
      add(g(l.scene, l.start) + i * 2, `v_${l.voice}`, 0.38);
    }
  }

  // 1 · Gancho
  for (let i = 0; i < 15; i += 2)
    add(g("s1", EV.s1.title) + i * 2, "type", 0.3);
  add(g("s1", EV.s1.lock), "error", 0.5);

  // 2 · Problema
  const e2 = EV.s2;
  add(g("s2", e2.squirrelIn), "jump", 0.35);
  add(g("s2", e2.try1), "zap", 0.5);
  add(g("s2", e2.try1 + 2), "error", 0.5);
  add(g("s2", e2.beaverIn), "jump", 0.35);
  add(g("s2", e2.try2), "zap", 0.5);
  add(g("s2", e2.try2 + 2), "error", 0.5);
  add(g("s2", e2.dizzy), "dizzy", 0.5);
  add(g("s2", e2.tangle), "tangle", 0.5);
  add(g("s2", e2.caption), "warn", 0.45);

  // 3 · La idea
  const e3 = EV.s3;
  add(g("s3", e3.turtleIn), "jump", 0.3);
  add(g("s3", e3.title), "power", 0.7);
  add(g("s3", e3.fly), "whoosh", 0.4);
  add(g("s3", e3.plugOwl), "click", 0.7);
  add(g("s3", e3.plugOwl + 2), "coin", 0.55);
  add(g("s3", e3.cableOut), "wipe", 0.25);
  add(g("s3", e3.plugSq), "click", 0.7);
  add(g("s3", e3.plugBv), "click", 0.7);
  add(g("s3", e3.plugBv + 4), "fanfare", 0.55);
  add(g("s3", e3.caption1), "coin", 0.45);
  add(g("s3", e3.caption2), "coin", 0.45);

  // 4 · Cómo funciona
  const e4 = EV.s4;
  [e4.tagOwl, e4.tagSq, e4.tagBv].forEach((f) =>
    add(g("s4", f), "select", 0.5),
  );
  [e4.card1, e4.card2, e4.card3].forEach((f) => {
    add(g("s4", f), "whoosh", 0.3);
    add(g("s4", f + 8), "coin", 0.5);
  });

  // 5 · Ejemplo
  const e5 = EV.s5;
  add(g("s5", e5.toSquirrel), "send", 0.5);
  add(g("s5", e5.backSquirrel), "receive", 0.5);
  add(g("s5", e5.backSquirrel + 22), "coin", 0.5);
  add(g("s5", e5.toBeaver), "send", 0.5);
  add(g("s5", e5.toBeaver + 36), "coin", 0.5);
  add(g("s5", e5.turtleIn), "jump", 0.3);
  add(g("s5", e5.askPermission), "warn", 0.45);
  add(g("s5", e5.click), "select", 0.7);
  add(g("s5", e5.granted), "confirm", 0.6);
  add(g("s5", e5.board), "power", 0.55);
  for (let i = 0; i < 5; i++) add(g("s5", e5.board + 12 + i * 8), "coin", 0.4);
  add(g("s5", e5.heart), "fanfare", 0.5);

  // 6 · Un amigo nuevo
  const e6 = EV.s6;
  add(g("s6", e6.foxIn), "jump", 0.35);
  add(g("s6", e6.plug), "click", 0.7);
  add(g("s6", e6.plug + 2), "power", 0.6);
  for (let i = 0; i < 20; i += 4) add(g("s6", e6.count1 + i), "tick", 0.35);
  for (let i = 0; i < 16; i += 4) add(g("s6", e6.count2 + i), "tick", 0.35);
  add(g("s6", e6.win), "coin", 0.5);

  // 7 · Final
  const e7 = EV.s7;
  add(g("s7", e7.title), "fanfare", 0.7);
  e7.fireworks.forEach((f) => add(g("s7", f), "boom", 0.45));
  add(g("s7", e7.clear), "power", 0.55);
  return cues;
};

const CUES = buildCues();

const ROLE: Record<string, string> = {};
const hasMusic = () =>
  new Set(getStaticFiles().map((f) => f.name)).has("music_pixel.mp3");

export const McpStory: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.sky }}>
    {hasMusic() ? (
      <Audio
        src={staticFile("music_pixel.mp3")}
        volume={(f) =>
          interpolate(
            f,
            [0, 15, STORY_TOTAL - 45, STORY_TOTAL],
            [0, 0.34, 0.34, 0],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            },
          )
        }
      />
    ) : null}
    <SfxLayer cues={CUES} roleOf={ROLE} prefix="px" gain={1.0} />
    <Sequence from={SC.s1.from} durationInFrames={SC.s1.dur}>
      <P1Hook />
    </Sequence>
    <Sequence from={SC.s2.from} durationInFrames={SC.s2.dur}>
      <P2Problem />
    </Sequence>
    <Sequence from={SC.s3.from} durationInFrames={SC.s3.dur}>
      <P3Idea />
    </Sequence>
    <Sequence from={SC.s4.from} durationInFrames={SC.s4.dur}>
      <P4How />
    </Sequence>
    <Sequence from={SC.s5.from} durationInFrames={SC.s5.dur}>
      <P5Example />
    </Sequence>
    <Sequence from={SC.s6.from} durationInFrames={SC.s6.dur}>
      <P6Friend />
    </Sequence>
    <Sequence from={SC.s7.from} durationInFrames={SC.s7.dur}>
      <P7Finale />
    </Sequence>
    <BlockWipe />
  </AbsoluteFill>
);

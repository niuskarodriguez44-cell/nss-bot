import React from "react";
import { Audio, getStaticFiles, Sequence, staticFile } from "remotion";

export type NamedCue = { frame: number; name: string; volume: number };

/** Cuántas variantes tiene cada rol (public/sfx/<prefijo>_<rol>_<n>.mp3). */
const VARIANTS: Record<string, number> = {
  key: 3,
  tap: 3,
  tok: 3,
  whoosh: 3,
  whoosh_s: 3,
  thud: 2,
  note: 5,
  hi: 5,
  bell: 2,
  bell_up: 2,
  notif: 2,
  send: 2,
  check: 2,
  sparkle: 2,
  toggle: 2,
};

/**
 * Reparte las variantes de cada rol en orden cronológico: las teclas/golpes rotan
 * entre varias tomas y las notas suben por la escala (suenan a melodía, no a máquina).
 */
export const assignVariants = (cues: NamedCue[], roleOf: Record<string, string>, prefix: string) => {
  const counters: Record<string, number> = {};
  return [...cues]
    .sort((a, b) => a.frame - b.frame)
    .map((c) => {
      const role = roleOf[c.name] ?? c.name;
      const n = VARIANTS[role] ?? 1;
      const i = (counters[role] = (counters[role] ?? -1) + 1);
      return { ...c, file: `sfx/${prefix}_${role}_${i % n}.mp3` };
    });
};

export const SfxLayer: React.FC<{
  cues: NamedCue[];
  roleOf: Record<string, string>;
  prefix: string;
  gain: number;
}> = ({ cues, roleOf, prefix, gain }) => {
  const available = new Set(getStaticFiles().map((f) => f.name));
  return (
    <>
      {assignVariants(cues, roleOf, prefix)
        .filter((c) => available.has(c.file))
        .map((c, i) => (
          <Sequence key={i} from={c.frame} durationInFrames={90} layout="none">
            <Audio src={staticFile(c.file)} volume={Math.min(1, c.volume * gain)} />
          </Sequence>
        ))}
    </>
  );
};

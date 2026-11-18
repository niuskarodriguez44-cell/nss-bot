import { Easing, interpolate } from "remotion";
export { INTER } from "../cubanbot/brand";
export { SERIF } from "../agent/theme";

/** Paleta del estudio editorial de referencia (marfil, tinta, verde hoja, salvia). */
export const V = {
  ivory: "#F8F8F0",
  ink: "#111111",
  green: "#109808",
  sage: "#E0F0D9",
  gray: "#D9DDDA",
  teal: "#0f9683",
};

export const FPS = 30;
export const W = 1080;
export const H = 1920;
export const NARR_DELAY = 0.5;

/**
 * Inicio (s) de cada frase de la narración. Estimados hasta tener el audio;
 * luego se miden con scripts/narration_segments.py (n = 8).
 */
export const SEG = [0, 4.6, 9.6, 15.6, 21.4, 25.2, 28.8, 33.0];
export const NARR_END = 36.0;
export const TOTAL = Math.round((NARR_DELAY + NARR_END + 2.2) * FPS);

export const segFrame = (i: number) => Math.round((NARR_DELAY + SEG[i]) * FPS);
export const SCENE = (i: number) => {
  const from = i === 0 ? 0 : segFrame(i);
  const to = i + 1 < SEG.length ? segFrame(i + 1) : TOTAL;
  return { from, dur: to - from };
};

export const OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const ease = (
  f: number,
  a: number,
  b: number,
  from = 0,
  to = 1,
  e = OUT,
) =>
  interpolate(f, [a, b], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: e,
  });

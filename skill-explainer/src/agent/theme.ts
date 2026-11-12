import { Easing, interpolate } from "remotion";
import { loadFont as loadNewsreader } from "@remotion/google-fonts/Newsreader";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

/** Paleta editorial cálida (crema, durazno, azul acuarela). */
export const P = {
  bg: "#fbf4ea",
  paper: "#fffdf9",
  line: "#eadfd0",
  dark: "#141413",
  mid: "#8d8a80",
  soft: "#b0aea5",
  peach: "#f1cfb2",
  peachLight: "#f7e3d0",
  sky: "#7d9fba",
  skyDeep: "#5d82a3",
  orange: "#d97757",
  blue: "#6a9bcc",
  green: "#788c5d",
};

export const SERIF = loadNewsreader("normal", {
  weights: ["400", "500"],
  subsets: ["latin"],
}).fontFamily;
loadNewsreader("italic", { weights: ["400"], subsets: ["latin"] });

export const SANS = loadInter("normal", {
  weights: ["400", "500", "600"],
  subsets: ["latin"],
}).fontFamily;

export const MONO = loadMono("normal", {
  weights: ["400"],
  subsets: ["latin"],
}).fontFamily;

/** Easing general (el mismo del primer video). */
export const EASE = Easing.bezier(0.16, 1, 0.3, 1);
/** Easing suave de entrada y salida para cámara y cursor. */
export const SOFT = Easing.bezier(0.45, 0, 0.2, 1);

export const ease = (
  frame: number,
  input: [number, number],
  output: [number, number],
  easing: (t: number) => number = EASE,
) =>
  interpolate(frame, input, output, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

export const lin = (
  frame: number,
  input: [number, number],
  output: [number, number],
) =>
  interpolate(frame, input, output, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

export const hexA = (hex: string, alpha: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
};

/** Cronología de las escenas (frames globales, 30 fps, 60 s). */
export const AGENT_SCENES = {
  hook: { from: 0, dur: 180 },
  horizon: { from: 180, dur: 240 },
  loop: { from: 420, dur: 300 },
  plan: { from: 720, dur: 420 },
  adapt: { from: 1140, dur: 360 },
  memory: { from: 1500, dur: 180 },
  outro: { from: 1680, dur: 120 },
};
export const AGENT_TOTAL = 1800;
export const AGENT_FADE = 12;

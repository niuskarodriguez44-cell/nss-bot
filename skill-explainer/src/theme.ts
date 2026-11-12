import { Easing, interpolate, useCurrentFrame } from "remotion";
import { loadFont as loadPoppins } from "@remotion/google-fonts/Poppins";
import { loadFont as loadLora } from "@remotion/google-fonts/Lora";
import { loadFont as loadJetBrainsMono } from "@remotion/google-fonts/JetBrainsMono";

export const COLORS = {
  bg: "#faf9f5",
  dark: "#141413",
  midGray: "#b0aea5",
  lightGray: "#e8e6dc",
  orange: "#d97757",
  blue: "#6a9bcc",
  green: "#788c5d",
};

// Las fuentes bloquean el render hasta estar listas (delayRender interno).
export const POPPINS = loadPoppins("normal", {
  weights: ["600"],
  subsets: ["latin"],
}).fontFamily;

export const LORA = loadLora("normal", {
  weights: ["400"],
  subsets: ["latin"],
}).fontFamily;

// Misma familia, estilo italic.
loadLora("italic", { weights: ["400"], subsets: ["latin"] });

export const MONO = loadJetBrainsMono("normal", {
  weights: ["400"],
  subsets: ["latin"],
}).fontFamily;

/** Centro del contenido principal (compartido entre escenas 2, 3 y 4). */
export const CX = 960;
export const CY = 470;

export const RADIUS = 16;
export const LINE = 2;

/** Easing general del video. */
export const EASE = Easing.bezier(0.16, 1, 0.3, 1);

/** Duración (frames) de los fundidos entre escenas. */
export const FADE = 12;

/** interpolate con clamp y el easing general. */
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

/** interpolate lineal con clamp. */
export const lin = (
  frame: number,
  input: [number, number],
  output: [number, number],
) =>
  interpolate(frame, input, output, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

/**
 * Tiempo de una escena.
 * - `frame`: frame "nominal" de la escena (0 = inicio del guion de la escena).
 *   Las escenas 2-4 se montan `lead` frames antes para solaparse con la
 *   anterior durante el fundido; `frame` ya descuenta ese adelanto.
 * - `opacity`: fade in de FADE frames al entrar y fade out de FADE frames al
 *   final del Sequence (salvo en la última escena, que se queda en pantalla).
 */
export const useScene = (
  lead: number,
  durationInFrames: number,
  fadeOut: boolean,
) => {
  const raw = useCurrentFrame();
  const fadeIn = lin(raw, [0, FADE], [0, 1]);
  const fadeOutValue = fadeOut
    ? lin(raw, [durationInFrames - FADE, durationInFrames], [1, 0])
    : 1;
  return { frame: raw - lead, opacity: Math.min(fadeIn, fadeOutValue) };
};

/** "#rrggbb" + alfa -> "rgba(...)". */
export const hexA = (hex: string, alpha: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
};

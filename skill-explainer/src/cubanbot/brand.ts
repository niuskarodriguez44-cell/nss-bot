import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

export const INTER = loadInter("normal", {
  weights: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
}).fontFamily;

export const B = {
  paper: "#f7f6f2",
  mint: "#eaf1ef",
  ink: "#111111",
  gray: "#6b6b6b",
  line: "#e3e1db",
  teal: "#0f9683",
  orange: "#f47c33",
  blue: "#4767df",
  purple: "#9157d3",
  yellow: "#efb52b",
  pink: "#e5577a",
  accent: "#1673e6",
};

export const FPS = 30;
/** La narración empieza un poco después del primer frame. */
export const NARR_DELAY = 0.6;
export const NARR_DURATION = 55.44;

/**
 * Inicio (segundos dentro de la narración) de cada frase del guion.
 * Estimados por longitud de texto; se reemplazan por los medidos con
 * scripts/narration_segments.py cuando el mp3 está en public/cubanbot/narracion.mp3.
 */
export const SEG = [0, 4.89, 15.44, 22.17, 28.05, 34.78, 40.27, 46.6, 51.63];

export const segFrame = (i: number) => Math.round((NARR_DELAY + SEG[i]) * FPS);
export const TOTAL = Math.round((NARR_DELAY + NARR_DURATION + 2.6) * FPS);

/** Frames de cada escena: [inicio, duración]. */
export const SCENE = (i: number) => {
  const from = i === 0 ? 0 : segFrame(i);
  const to = i + 1 < SEG.length ? segFrame(i + 1) : TOTAL;
  return { from, dur: to - from };
};

export const CAPTIONS = [
  "",
  "Tu equipo de agentes",
  "Un perfil para cada agente",
  "Mapa del equipo",
  "Apps y servidores MCP",
  "Automatizaciones",
  "Feed y herramientas para negocios",
  "En tu teléfono",
  "",
];

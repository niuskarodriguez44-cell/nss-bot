export const FPS = 30;

/**
 * Tramos "nominales" de cada escena (frames globales).
 * Las escenas 2-6 se montan FADE frames antes (ver SkillExplainer.tsx) para
 * solaparse con la anterior durante el fundido.
 */
export const SCENES = {
  hook: { from: 0, dur: 120 },
  problem: { from: 120, dur: 150 },
  build: { from: 270, dur: 180 },
  example: { from: 450, dur: 390 },
  flow: { from: 840, dur: 270 },
  result: { from: 1110, dur: 270 },
};

export const TOTAL_FRAMES = 1380; // 46 s

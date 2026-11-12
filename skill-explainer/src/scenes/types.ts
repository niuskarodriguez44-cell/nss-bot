import type { Texts } from "../SkillExplainer";

export type SceneProps = {
  texts: Texts;
  /** Frames que la escena se monta antes de su inicio nominal (solape del fundido). */
  lead: number;
  /** Duración del <Sequence> que contiene la escena. */
  durationInFrames: number;
};

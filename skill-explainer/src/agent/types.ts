import type { AgentTexts } from "./AgentPlanner";

export type AgentSceneProps = {
  texts: AgentTexts;
  /** Frames que la escena se monta antes de su inicio nominal (solape del fundido). */
  lead: number;
  durationInFrames: number;
};

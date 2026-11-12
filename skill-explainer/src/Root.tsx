import React from "react";
import { Composition } from "remotion";
import { SkillExplainer } from "./SkillExplainer";
import { FPS, TOTAL_FRAMES } from "./timeline";
import { AgentPlanner } from "./agent/AgentPlanner";
import { AGENT_TOTAL } from "./agent/theme";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="SkillExplainer"
        component={SkillExplainer}
        width={1920}
        height={1080}
        fps={FPS}
        durationInFrames={TOTAL_FRAMES}
      />
      <Composition
        id="AgentPlanner"
        component={AgentPlanner}
        width={1920}
        height={1080}
        fps={FPS}
        durationInFrames={AGENT_TOTAL}
      />
    </>
  );
};

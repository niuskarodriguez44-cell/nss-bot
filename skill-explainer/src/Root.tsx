import React from "react";
import { Composition, Still } from "remotion";
import { SkillExplainer } from "./SkillExplainer";
import { FPS, TOTAL_FRAMES } from "./timeline";
import { AgentPlanner } from "./agent/AgentPlanner";
import { CubanBotLaunch } from "./cubanbot/CubanBotLaunch";
import { TOTAL as CUBAN_TOTAL } from "./cubanbot/brand";
import { McpStory } from "./story/McpStory";
import { STORY_TOTAL } from "./story/script";
import { SpriteSheet } from "./story/SpriteSheet";
import { FrameBauhaus, FramePixel, FrameShadow } from "./story/StyleFrames";
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
      <Composition
        id="CubanBotLaunch"
        component={CubanBotLaunch}
        width={1920}
        height={1080}
        fps={FPS}
        durationInFrames={CUBAN_TOTAL}
      />
      <Composition
        id="McpStory"
        component={McpStory}
        width={1920}
        height={1080}
        fps={FPS}
        durationInFrames={STORY_TOTAL}
      />
      <Still
        id="SpriteSheet"
        component={SpriteSheet}
        width={1920}
        height={1080}
      />
      <Still
        id="StyleBauhaus"
        component={FrameBauhaus}
        width={1920}
        height={1080}
      />
      <Still
        id="StylePixel"
        component={FramePixel}
        width={1920}
        height={1080}
      />
      <Still
        id="StyleShadow"
        component={FrameShadow}
        width={1920}
        height={1080}
      />
    </>
  );
};

import React from "react";
import { Composition } from "remotion";
import { SkillExplainer } from "./SkillExplainer";
import { FPS, TOTAL_FRAMES } from "./timeline";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="SkillExplainer"
      component={SkillExplainer}
      width={1920}
      height={1080}
      fps={FPS}
      durationInFrames={TOTAL_FRAMES}
    />
  );
};

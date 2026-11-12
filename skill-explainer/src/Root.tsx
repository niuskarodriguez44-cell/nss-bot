import React from "react";
import { Composition } from "remotion";
import { SkillExplainer, TOTAL_FRAMES } from "./SkillExplainer";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="SkillExplainer"
      component={SkillExplainer}
      width={1920}
      height={1080}
      fps={30}
      durationInFrames={TOTAL_FRAMES}
    />
  );
};

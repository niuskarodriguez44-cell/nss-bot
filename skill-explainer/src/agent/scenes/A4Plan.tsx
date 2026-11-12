import React from "react";
import { AbsoluteFill } from "remotion";
import { Cursor, cursorAt } from "../Cursor";
import { cameraStyle } from "../camera";
import { INPUT, PLANNER_INIT, Planner, SEND } from "../Planner";
import type { PlannerState } from "../Planner";
import { ease, P } from "../theme";
import { useScene } from "../../theme";
import type { AgentSceneProps } from "../types";

// Tiempos nominales (frames locales); también los usa AgentSound.tsx.
export const PLAN = {
  typeStart: 76,
  typeSpeed: 0.55,
  clickInput: 62,
  clickSend: 214,
  stepStart: 232,
  stepGap: 30,
  finalMsg: 360,
  barStart: 330,
  barGap: 22,
};

export const UNIT_COLORS = [P.blue, P.green, P.orange, P.skyDeep];

export const A4Plan: React.FC<AgentSceneProps> = ({ texts, lead, durationInFrames }) => {
  const { frame, opacity } = useScene(lead, durationInFrames, true);
  const t = texts.a4;

  const intro = ease(frame, [0, 34], [0, 1]);

  // Escritura del objetivo.
  const chars = Math.max(0, Math.floor((frame - PLAN.typeStart) * PLAN.typeSpeed));
  const sentP = ease(frame, [PLAN.clickSend + 4, PLAN.clickSend + 30], [0, 1]);
  const typed = frame >= PLAN.clickSend + 4 ? "" : t.prompt.slice(0, chars);
  const caret = frame >= PLAN.clickInput && frame < PLAN.clickSend + 4 && Math.floor(frame / 10) % 2 === 0;

  const steps = t.steps.map((_, i) => ease(frame, [PLAN.stepStart + i * PLAN.stepGap, PLAN.stepStart + i * PLAN.stepGap + 18], [0, 1]));
  const stepsDone = t.steps.map((_, i) =>
    ease(frame, [PLAN.stepStart + i * PLAN.stepGap + 22, PLAN.stepStart + i * PLAN.stepGap + 34], [0, 1]),
  );
  const bars = t.units.map((_, i) =>
    ease(frame, [PLAN.barStart + i * PLAN.barGap, PLAN.barStart + i * PLAN.barGap + 44], [0, 1]),
  );
  const evals = t.units.map((_, i) =>
    ease(frame, [PLAN.barStart + i * PLAN.barGap + 40, PLAN.barStart + i * PLAN.barGap + 56], [0, 1]),
  );

  // Cursor: va al campo, hace clic, espera y pulsa enviar.
  const keys = [
    { f: 0, x: 980, y: 560 },
    { f: 40, x: 980, y: 560 },
    { f: PLAN.clickInput, x: INPUT.x + 270, y: INPUT.y + 50 },
    { f: PLAN.clickSend - 30, x: INPUT.x + 270, y: INPUT.y + 50 },
    { f: PLAN.clickSend, x: SEND.x + SEND.r, y: SEND.y + SEND.r },
    { f: PLAN.clickSend + 40, x: 900, y: 600 },
    { f: 380, x: 1260, y: 500 },
    { f: 420, x: 1260, y: 500 },
  ];
  const cur = cursorAt(frame, keys);
  const sendHover = ease(Math.hypot(cur.x - (SEND.x + SEND.r), cur.y - (SEND.y + SEND.r)), [0, 60], [1, 0]);

  const state: PlannerState = {
    ...PLANNER_INIT,
    frame,
    intro,
    typed,
    caret,
    sent: sentP,
    steps,
    stepsDone,
    finalMsg: ease(frame, [PLAN.finalMsg, PLAN.finalMsg + 24], [0, 1]),
    bars,
    evals,
    sendHover: frame < PLAN.clickSend + 6 ? sendHover : 0,
  };

  // Cámara: del chat al lienzo, y un acercamiento final a las unidades.
  const cam = cameraStyle(frame, [
    { f: 0, x: 540, y: 620, s: 1.45, r: -0.8 },
    { f: 150, x: 430, y: 700, s: 1.55, r: 0 },
    { f: 226, x: 460, y: 640, s: 1.5, r: 0.4 },
    { f: 300, x: 960, y: 540, s: 1.0, r: 0 },
    { f: 340, x: 1230, y: 540, s: 1.3, r: 0.5 },
    { f: 420, x: 1260, y: 560, s: 1.22, r: 0 },
  ]);

  return (
    <AbsoluteFill style={{ opacity }}>
      <div style={cam}>
        <Planner
          state={state}
          prompt={t.prompt}
          placeholder={t.placeholder}
          chatTitle={t.chatTitle}
          steps={t.steps}
          finalText={t.finalText}
          units={t.units.map((u, i) => ({ ...u, color: UNIT_COLORS[i] }))}
          months={texts.a2.months}
          emptyCanvas={t.emptyCanvas}
          tabs={t.tabs}
          refuerzoLabel={texts.a5.refuerzo}
          endLabel={t.endLabel}
          quizLabel={texts.a5.quizLabel}
          proposalTitle={texts.a5.proposalTitle}
          proposalBody={texts.a5.proposalBody}
          accept={texts.a5.accept}
          decline={texts.a5.decline}
          addedText={texts.a5.added}
        />
        <Cursor frame={frame} keys={keys} clicks={[PLAN.clickInput, PLAN.clickSend]} visibleFrom={20} />
      </div>
    </AbsoluteFill>
  );
};


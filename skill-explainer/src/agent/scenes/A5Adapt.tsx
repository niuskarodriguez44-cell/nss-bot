import React from "react";
import { AbsoluteFill } from "remotion";
import { Cursor, cursorAt } from "../Cursor";
import { cameraStyle } from "../camera";
import { PLANNER_INIT, PROMPT_SCROLL, Planner } from "../Planner";
import type { PlannerState } from "../Planner";
import { SANS, SOFT, ease, hexA, P } from "../theme";
import { Icon, Slider, Tabs, Toggle, cardStyle } from "../ui";
import { useScene } from "../../theme";
import { UNIT_COLORS } from "./A4Plan";
import type { AgentSceneProps } from "../types";

// Tiempos nominales (frames locales); también los usa AgentSound.tsx.
export const ADAPT = {
  quiz: 30,
  toast: 46,
  proposal: 92,
  clickAccept: 170,
  shift: 182,
  clickToggle: 262,
  pressSlider: 290,
  sliderEnd: 330,
};

// Posiciones de los botones de la propuesta (mundo): ver Planner.PROPOSAL y CHAT.
const ACCEPT_POS = { x: 216, y: 722 };
const DECLINE_POS = { x: 382, y: 722 };

const PANEL = { x: 1250, y: 560, w: 540, h: 400 };
const TOGGLE_POS = { x: PANEL.x + PANEL.w - 28 - 44, y: PANEL.y + 112 };
const SLIDER = { x: PANEL.x + 28, y: PANEL.y + 258, w: PANEL.w - 56 };

export const A5Adapt: React.FC<AgentSceneProps> = ({ texts, lead, durationInFrames }) => {
  const { frame, opacity } = useScene(lead, durationInFrames, true);
  const t = texts.a5;
  const a4 = texts.a4;

  const keys = [
    { f: 0, x: 1500, y: 330 },
    { f: 70, x: 1500, y: 330 },
    { f: 112, x: 430, y: 610 },
    { f: 136, x: DECLINE_POS.x, y: DECLINE_POS.y },
    { f: 152, x: DECLINE_POS.x, y: DECLINE_POS.y },
    { f: 168, x: ACCEPT_POS.x, y: ACCEPT_POS.y },
    { f: 178, x: ACCEPT_POS.x, y: ACCEPT_POS.y },
    { f: 226, x: 1180, y: 640 },
    { f: ADAPT.clickToggle, x: TOGGLE_POS.x, y: TOGGLE_POS.y },
    { f: 276, x: TOGGLE_POS.x, y: TOGGLE_POS.y },
    { f: ADAPT.pressSlider, x: SLIDER.x + SLIDER.w * 0.5, y: SLIDER.y + 18 },
    { f: ADAPT.sliderEnd, x: SLIDER.x + SLIDER.w * 0.7, y: SLIDER.y + 18 },
    { f: 352, x: 1500, y: 760 },
  ];
  const cur = cursorAt(frame, keys);
  const near = (p: { x: number; y: number }) => ease(Math.hypot(cur.x - p.x, cur.y - p.y), [0, 80], [1, 0]);

  const proposal = ease(frame, [ADAPT.proposal, ADAPT.proposal + 26], [0, 1]);
  const accepted = ease(frame, [ADAPT.clickAccept + 2, ADAPT.clickAccept + 20], [0, 1]);
  const ins = ease(frame, [ADAPT.shift, ADAPT.shift + 50], [0, 1]);
  const sliderV = 0.5 + 0.2 * ease(frame, [ADAPT.pressSlider, ADAPT.sliderEnd], [0, 1], SOFT);
  const compress = (sliderV - 0.5) / 0.2;
  const toggleOn = ease(frame, [ADAPT.clickToggle + 2, ADAPT.clickToggle + 20], [0, 1]);
  const panelIn = ease(frame, [238, 264], [0, 1]) * (1 - ease(frame, [344, 358], [0, 1]));
  const toastIn = ease(frame, [ADAPT.toast, ADAPT.toast + 24], [0, 1]) * (1 - ease(frame, [122, 140], [0, 1]));

  const state: PlannerState = {
    ...PLANNER_INIT,
    frame,
    sent: 1,
    steps: [1, 1, 1, 1],
    stepsDone: [1, 1, 1, 1],
    finalMsg: 1,
    bars: [1, 1, 1, 1],
    evals: [1, 1, 1, 1],
    quizMark: ease(frame, [ADAPT.quiz, ADAPT.quiz + 34], [0, 1]),
    bell: ease(frame, [ADAPT.quiz + 6, ADAPT.quiz + 50], [0, 1]),
    chatScroll: PROMPT_SCROLL * ease(frame, [70, 112], [0, 1]),
    proposal,
    accepted,
    hoverAccept: proposal > 0.8 && accepted < 0.1 ? near(ACCEPT_POS) : 0,
    hoverDecline: proposal > 0.8 && accepted < 0.1 ? near(DECLINE_POS) : 0,
    ins,
    compress,
  };

  const cam = cameraStyle(frame, [
    { f: 0, x: 1250, y: 520, s: 1.12, r: 0.5 },
    { f: 60, x: 1400, y: 420, s: 1.35, r: 0.4 },
    { f: 100, x: 460, y: 640, s: 1.5, r: -0.5 },
    { f: 178, x: 460, y: 640, s: 1.5, r: 0 },
    { f: 226, x: 1230, y: 560, s: 1.3, r: 0.6 },
    { f: 262, x: 1450, y: 700, s: 1.55, r: 0 },
    { f: 332, x: 1450, y: 690, s: 1.5, r: -0.4 },
    { f: 360, x: 960, y: 540, s: 1.0, r: 0 },
  ]);

  return (
    <AbsoluteFill style={{ opacity }}>
      <div style={cam}>
        <Planner
          state={state}
          prompt={a4.prompt}
          placeholder={a4.placeholder}
          chatTitle={a4.chatTitle}
          steps={a4.steps}
          finalText={a4.finalText}
          units={a4.units.map((u, i) => ({ ...u, color: UNIT_COLORS[i] }))}
          months={texts.a2.months}
          emptyCanvas={a4.emptyCanvas}
          tabs={a4.tabs}
          refuerzoLabel={t.refuerzo}
          endLabel={a4.endLabel}
          quizLabel={t.quizLabel}
          proposalTitle={t.proposalTitle}
          proposalBody={t.proposalBody}
          accept={t.accept}
          decline={t.decline}
          addedText={t.added}
        />

        {/* Aviso del quiz */}
        <div
          style={{
            position: "absolute",
            left: 1290,
            top: 214,
            width: 500,
            height: 104,
            boxSizing: "border-box",
            padding: "0 28px",
            display: "flex",
            alignItems: "center",
            gap: 18,
            ...cardStyle({ borderRadius: 26, border: `2px solid ${hexA(P.orange, 0.5)}` }),
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: 26,
            color: P.dark,
            opacity: toastIn,
            transform: `translateY(${(1 - toastIn) * -40}px)`,
          }}
        >
          <Icon name="bell" size={36} color={P.orange} />
          {t.toast}
        </div>

        {/* Ajustes del agente */}
        <div
          style={{
            position: "absolute",
            left: PANEL.x,
            top: PANEL.y,
            width: PANEL.w,
            height: PANEL.h,
            boxSizing: "border-box",
            ...cardStyle({ borderRadius: 28 }),
            opacity: panelIn,
            transform: `translateY(${(1 - panelIn) * 50}px)`,
          }}
        >
          <div style={{ position: "absolute", left: 28, top: 26, fontFamily: SANS, fontWeight: 600, fontSize: 28, color: P.dark }}>
            {t.panelTitle}
          </div>
          <div style={{ position: "absolute", left: 28, top: 96, width: 340, fontFamily: SANS, fontSize: 25, lineHeight: "32px", color: P.dark }}>
            {t.toggleLabel}
          </div>
          <div style={{ position: "absolute", left: PANEL.w - 28 - 88, top: 90 }}>
            <Toggle on={toggleOn} />
          </div>
          <div style={{ position: "absolute", left: 28, top: 190, fontFamily: SANS, fontSize: 25, color: P.dark }}>{t.sliderLabel}</div>
          <div style={{ position: "absolute", right: 28, top: 190, fontFamily: SANS, fontWeight: 600, fontSize: 25, color: P.orange }}>
            {Math.round(sliderV * 100)} %
          </div>
          <div style={{ position: "absolute", left: 28, top: 240 }}>
            <Slider value={sliderV} w={SLIDER.w} />
          </div>
          <div style={{ position: "absolute", left: 28, top: 306 }}>
            <Tabs options={t.tabs} pos={0} w={SLIDER.w} />
          </div>
        </div>

        <Cursor
          frame={frame}
          keys={keys}
          clicks={[ADAPT.clickAccept, ADAPT.clickToggle, ADAPT.pressSlider]}
          visibleFrom={0}
        />
      </div>
    </AbsoluteFill>
  );
};

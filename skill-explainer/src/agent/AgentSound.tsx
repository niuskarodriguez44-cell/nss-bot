import React from "react";
import { Audio, getStaticFiles, interpolate, staticFile } from "remotion";
import { SfxLayer } from "../SfxLayer";
import { AGENT_FADE, AGENT_SCENES, AGENT_TOTAL } from "./theme";
import { PLAN } from "./scenes/A4Plan";
import { ADAPT } from "./scenes/A5Adapt";
import { MEM } from "./scenes/A6Memory";

type Cue = { frame: number; name: string; volume: number };

/** Efectos (pack uisfx CC0) sincronizados por frame con cada escena. */
const buildCues = (): Cue[] => {
  const cues: Cue[] = [];
  const add = (frame: number, name: string, volume = 0.5) =>
    cues.push({ frame: Math.max(0, Math.round(frame)), name, volume });
  const S = AGENT_SCENES;

  // Transiciones
  [S.horizon, S.loop, S.plan, S.adapt, S.memory, S.outro].forEach((s) => add(s.from - AGENT_FADE, "swipe", 0.25));

  // 1 · Gancho
  add(S.hook.from + 10, "expand", 0.3);
  add(S.hook.from + 32, "select", 0.3);
  add(S.hook.from + 100, "swipe", 0.3);
  add(S.hook.from + 124, "checkpoint", 0.4);

  // 2 · Horizonte largo
  for (let i = 0; i < 7; i++) add(S.horizon.from + 100 + i * 9 + 16, "select", 0.35);
  [120, 130, 140].forEach((f) => add(S.horizon.from + f, "progress-step", 0.3));
  add(S.horizon.from + 172, "notification", 0.3);

  // 3 · Ciclo del agente
  add(S.loop.from + 40, "connecting", 0.25);
  for (let n = 0; n < 8; n++) add(S.loop.from + 44 + (n + 1) * 30, "select", n < 5 ? 0.4 : 0.28);
  for (let i = 0; i < 4; i++) add(S.loop.from + 112 + i * 14 + 14, "snap", 0.35);
  add(S.loop.from + 214, "retry", 0.35);

  // 4 · Plan
  const A = S.plan.from;
  add(A + 8, "open", 0.35);
  add(A + PLAN.clickInput, "press", 0.4);
  for (let f = PLAN.typeStart; f < PLAN.typeStart + 98; f += 4) add(A + f, "typing", 0.3);
  add(A + PLAN.clickSend, "press", 0.35);
  add(A + PLAN.clickSend + 2, "send", 0.5);
  for (let i = 0; i < 4; i++) add(A + PLAN.stepStart + i * PLAN.stepGap + 24, "check", 0.4);
  add(A + PLAN.finalMsg, "complete", 0.4);
  for (let i = 0; i < 4; i++) {
    add(A + PLAN.barStart + i * PLAN.barGap, "expand", 0.22);
    add(A + PLAN.barStart + i * PLAN.barGap + 46, "snap", 0.3);
  }

  // 5 · Ajuste dinámico
  const B = S.adapt.from;
  add(B + ADAPT.quiz, "notification", 0.5);
  add(B + ADAPT.toast, "receive", 0.4);
  add(B + ADAPT.proposal, "open", 0.4);
  add(B + ADAPT.clickAccept, "press", 0.4);
  add(B + ADAPT.clickAccept + 6, "complete", 0.45);
  add(B + ADAPT.shift, "drop", 0.45);
  add(B + ADAPT.shift + 4, "swipe", 0.25);
  add(B + 240, "open", 0.3);
  add(B + ADAPT.clickToggle, "press", 0.4);
  add(B + ADAPT.clickToggle + 3, "toggle-on", 0.5);
  add(B + ADAPT.pressSlider, "press", 0.35);
  for (let f = ADAPT.pressSlider + 4; f < ADAPT.sliderEnd; f += 9) add(B + f, "hover", 0.25);
  add(B + ADAPT.sliderEnd + 2, "checkpoint", 0.45);

  // 6 · Memoria
  const C = S.memory.from;
  for (let i = 0; i < 4; i++) add(C + MEM.notes + i * MEM.noteGap, "typing", 0.22);
  add(C + MEM.review, "notification", 0.3);
  for (let i = 0; i < 3; i++) add(C + MEM.chips + i * 12, "snap", 0.3);
  add(C + MEM.clickChip, "press", 0.4);
  add(C + MEM.clickChip + 3, "select", 0.4);

  // 7 · Cierre
  add(S.outro.from + 8, "swipe", 0.3);
  add(S.outro.from + 40, "checkpoint", 0.4);
  add(S.outro.from + 76, "complete", 0.5);

  return cues;
};

const CUES = buildCues();
const ROLE: Record<string, string> = {
  typing: "key",
  hover: "key",
  press: "tap",
  select: "note",
  "progress-step": "note",
  swipe: "whoosh",
  expand: "whoosh_s",
  open: "whoosh_s",
  connecting: "whoosh_s",
  snap: "tok",
  checkpoint: "bell",
  complete: "bell_up",
  check: "check",
  notification: "notif",
  receive: "notif",
  send: "send",
  drop: "thud",
  "toggle-on": "toggle",
  retry: "hi",
};
const hasMusic = new Set(getStaticFiles().map((f) => f.name)).has("music_agent.mp3");

export const AgentSound: React.FC = () => (
  <>
    {hasMusic ? (
      <Audio
        src={staticFile("music_agent.mp3")}
        volume={(f) =>
          interpolate(f, [0, 15, AGENT_TOTAL - 45, AGENT_TOTAL], [0, 0.38, 0.38, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
      />
    ) : null}
    <SfxLayer cues={CUES} roleOf={ROLE} prefix="v2" gain={1.4} />
  </>
);

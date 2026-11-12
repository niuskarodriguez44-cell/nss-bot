import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { FADE } from "../theme";
import { AgentSound } from "./AgentSound";
import { WaveBg } from "./WaveBg";
import { AGENT_SCENES, P } from "./theme";
import { A1Hook } from "./scenes/A1Hook";
import { A2Horizon } from "./scenes/A2Horizon";
import { A3Loop } from "./scenes/A3Loop";
import { A4Plan } from "./scenes/A4Plan";
import { A5Adapt } from "./scenes/A5Adapt";
import { A6Memory } from "./scenes/A6Memory";
import { A7Outro } from "./scenes/A7Outro";

/** Todos los textos del video 2, editables en un solo lugar. */
export const AGENT_TEXTS = {
  a1: {
    line1: "Planificar un año escolar",
    line2: "no cabe en un solo prompt.",
    swap: "Necesita un agente.",
  },
  a2: {
    title: "El horizonte largo",
    months: ["Sep", "Oct", "Nov", "Dic", "Ene", "Feb", "Mar", "Abr", "May"],
    stats: ["semanas", "unidades", "evaluaciones"],
    uncertain: "Lo incierto crece con el tiempo",
  },
  a3: {
    center: "Agente",
    centerSub: "no responde una vez: repite el ciclo",
    nodes: [
      { label: "Objetivo", sub: "La meta del año" },
      { label: "Plan", sub: "Unidades y semanas" },
      { label: "Actuar", sub: "Usa herramientas" },
      { label: "Observar", sub: "Resultados reales" },
      { label: "Ajustar", sub: "Replanifica" },
    ],
    tools: ["Calendario escolar", "Currículo", "Notas de clase", "Resultados"],
  },
  a4: {
    chatTitle: "Asistente",
    placeholder: "Escribe tu objetivo…",
    prompt: "Planifica Matemáticas de 5.º: 36 semanas y 4 unidades.",
    steps: [
      "Leyendo el currículo",
      "Revisando el calendario",
      "Distribuyendo unidades",
      "Programando evaluaciones",
    ],
    finalText: "Listo. Plan anual de 4 unidades en 36 semanas.",
    emptyCanvas: "Tu plan aparecerá aquí",
    tabs: ["Año", "Unidades", "Semana"],
    endLabel: "Fin · sem. {n}",
    units: [
      { name: "Fracciones", weeks: 10 },
      { name: "Geometría", weeks: 8 },
      { name: "Medidas", weeks: 8 },
      { name: "Datos y azar", weeks: 10 },
    ],
  },
  a5: {
    toast: "Quiz sem. 8 · 54 % de aciertos",
    quizLabel: "Quiz · 54 %",
    proposalTitle: "Fracciones: 54 % de aciertos",
    proposalBody: "¿Agrego 1 semana de refuerzo y muevo las unidades siguientes?",
    accept: "Aceptar",
    decline: "Ahora no",
    added: "Refuerzo agregado",
    refuerzo: "Refuerzo",
    panelTitle: "Ajustes del agente",
    toggleLabel: "Replanificar automáticamente",
    sliderLabel: "Ritmo",
    tabs: ["Semana", "Mes", "Año"],
  },
  a6: {
    memoryTitle: "Memoria del curso",
    notes: [
      "Grupo 5.ºB: refuerzo en fracciones",
      "Evaluaciones los viernes",
      "Feriado en la semana 12",
      "Ritmo preferido: 65 %",
    ],
    reviewTitle: "Revisión semanal",
    days: ["Lu", "Ma", "Mi", "Ju", "Vi"],
    skillsTitle: "Skills que usa",
    skills: ["plan-de-clase", "rubrica-evaluacion", "cuestionario-rapido"],
  },
  a7: {
    line1: "Planifica a largo plazo.",
    line2: "Ajusta cada semana.",
    subtitle: "Agentes de IA · planificación docente",
  },
};

export type AgentTexts = typeof AGENT_TEXTS;

const seq = (s: { from: number; dur: number }, lead: number) => ({
  from: s.from - lead,
  durationInFrames: s.dur + lead,
  lead,
});

export const AgentPlanner: React.FC = () => {
  const S = AGENT_SCENES;
  const p1 = seq(S.hook, 0);
  const p2 = seq(S.horizon, FADE);
  const p3 = seq(S.loop, FADE);
  const p4 = seq(S.plan, FADE);
  const p5 = seq(S.adapt, FADE);
  const p6 = seq(S.memory, FADE);
  const p7 = seq(S.outro, FADE);

  const mk = (p: ReturnType<typeof seq>, Scene: React.FC<import("./types").AgentSceneProps>) => (
    <Sequence from={p.from} durationInFrames={p.durationInFrames}>
      <Scene texts={AGENT_TEXTS} lead={p.lead} durationInFrames={p.durationInFrames} />
    </Sequence>
  );

  return (
    <AbsoluteFill style={{ backgroundColor: P.bg }}>
      <WaveBg />
      <AgentSound />
      {mk(p1, A1Hook)}
      {mk(p2, A2Horizon)}
      {mk(p3, A3Loop)}
      {mk(p4, A4Plan)}
      {mk(p5, A5Adapt)}
      {mk(p6, A6Memory)}
      {mk(p7, A7Outro)}
    </AbsoluteFill>
  );
};

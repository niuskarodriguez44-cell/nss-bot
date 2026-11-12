import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { COLORS, FADE } from "./theme";
import { SCENES } from "./timeline";
import { BgShapes } from "./components/BgShapes";
import { Soundtrack } from "./Soundtrack";
import { Scene1Hook } from "./scenes/Scene1Hook";
import { Scene2Problem } from "./scenes/Scene2Problem";
import { Scene3Build } from "./scenes/Scene3Build";
import { Scene4Example } from "./scenes/Scene4Example";
import { Scene5Flow } from "./scenes/Scene5Flow";
import { Scene6Result } from "./scenes/Scene6Result";

/** Todos los textos del video, editables en un solo lugar. */
export const TEXTS = {
  s1: {
    title: "¿Qué es una Skill?",
  },
  s2: {
    bubble: "Hazme un plan de clase…",
    caption: "Repites lo mismo cada semana",
  },
  s3: {
    file: "plan-de-clase / SKILL.md",
    rows: ["Cuándo usarla", "Pasos", "Formato", "Ejemplo"],
  },
  s4: {
    // Contenido del SKILL.md de ejemplo (una línea por elemento, máx. ~50 caracteres)
    code: [
      "---",
      "name: plan-de-clase",
      "description: Crea planes de clase de 45 min con",
      "  inicio, desarrollo y cierre. Úsala cuando pidan",
      "  planear una clase.",
      "---",
      "",
      "## Cuándo usarla",
      'Cuando pidan "planea una clase de…".',
      "## Pasos",
      "1. Pregunta grado y objetivo de aprendizaje.",
      "2. Divide en Inicio · Desarrollo · Cierre.",
      "## Formato",
      "Tabla: Momento | Actividad | Tiempo.",
      "## Ejemplo",
      "Fracciones, 5.º grado → 3 momentos.",
    ],
    callouts: [
      { label: "Nombre y descripción", sub: "Así la encuentra Claude" },
      { label: "Cuándo usarla", sub: "El momento de activarse" },
      { label: "Pasos", sub: "Lo que hace, en orden" },
      { label: "Formato", sub: "Cómo entrega el resultado" },
      { label: "Ejemplo", sub: "Un caso para imitar" },
    ],
  },
  s5: {
    label: "Tus skills",
    skills: [
      { name: "plan-de-clase", desc: "Planes de clase de 45 min" },
      { name: "rubrica-evaluacion", desc: "Rúbricas por criterios" },
      { name: "cuestionario-rapido", desc: "Quizzes de 5 preguntas" },
      { name: "retroalimentacion", desc: "Comentarios para tareas" },
    ],
    request: "Planea una clase de fracciones para 5.º",
    panelTitle: "Claude",
    steps: [
      "Lee solo las descripciones",
      "Elige la skill que coincide",
      "Carga solo esa skill",
      "Responde con tu formato",
    ],
  },
  s6: {
    tableHeaders: ["Momento", "Actividad", "Tiempo"],
    topics: [
      {
        name: "Clase de fracciones",
        rows: [
          ["Inicio", "Pizzas y fracciones", "10 min"],
          ["Desarrollo", "Fracciones equivalentes", "30 min"],
          ["Cierre", "Ticket de salida", "10 min"],
        ],
      },
      {
        name: "Clase del ciclo del agua",
        rows: [
          ["Inicio", "Mapa de la lluvia", "10 min"],
          ["Desarrollo", "Maqueta del ciclo", "25 min"],
          ["Cierre", "Dibuja y explica", "15 min"],
        ],
      },
      {
        name: "Clase de verbos en pasado",
        rows: [
          ["Inicio", "Juego de acciones", "10 min"],
          ["Desarrollo", "Línea de tiempo", "30 min"],
          ["Cierre", "Cuento corto", "10 min"],
        ],
      },
    ],
    titleA: "Escríbela una vez.",
    titleB: "Úsala siempre.",
    subtitle: "Skills · IA aplicada a la docencia",
  },
};

export type Texts = typeof TEXTS;

/** Cada escena (2-6) se monta FADE frames antes para solaparse con la anterior. */
const seq = (s: { from: number; dur: number }, lead: number) => ({
  from: s.from - lead,
  durationInFrames: s.dur + lead,
  lead,
});

export const SkillExplainer: React.FC = () => {
  const p1 = seq(SCENES.hook, 0);
  const p2 = seq(SCENES.problem, FADE);
  const p3 = seq(SCENES.build, FADE);
  const p4 = seq(SCENES.example, FADE);
  const p5 = seq(SCENES.flow, FADE);
  const p6 = seq(SCENES.result, FADE);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <BgShapes />
      <Soundtrack />

      <Sequence from={p1.from} durationInFrames={p1.durationInFrames}>
        <Scene1Hook texts={TEXTS} lead={p1.lead} durationInFrames={p1.durationInFrames} />
      </Sequence>
      <Sequence from={p2.from} durationInFrames={p2.durationInFrames}>
        <Scene2Problem texts={TEXTS} lead={p2.lead} durationInFrames={p2.durationInFrames} />
      </Sequence>
      <Sequence from={p3.from} durationInFrames={p3.durationInFrames}>
        <Scene3Build texts={TEXTS} lead={p3.lead} durationInFrames={p3.durationInFrames} />
      </Sequence>
      <Sequence from={p4.from} durationInFrames={p4.durationInFrames}>
        <Scene4Example texts={TEXTS} lead={p4.lead} durationInFrames={p4.durationInFrames} />
      </Sequence>
      <Sequence from={p5.from} durationInFrames={p5.durationInFrames}>
        <Scene5Flow texts={TEXTS} lead={p5.lead} durationInFrames={p5.durationInFrames} />
      </Sequence>
      <Sequence from={p6.from} durationInFrames={p6.durationInFrames}>
        <Scene6Result texts={TEXTS} lead={p6.lead} durationInFrames={p6.durationInFrames} />
      </Sequence>
    </AbsoluteFill>
  );
};

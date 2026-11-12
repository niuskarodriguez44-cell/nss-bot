import React from "react";
import { AbsoluteFill } from "remotion";
import { cameraStyle } from "../camera";
import { ease, hexA, lin, P, SANS, SERIF } from "../theme";
import { Icon, cardStyle } from "../ui";
import { useScene } from "../../theme";
import type { AgentSceneProps } from "../types";

const WEEKS = 36;
const X0 = 150;
const STEP = 46; // 36 semanas * 46 = 1656
const Y_BAR = 560;
const WEEK_W = 34;
const WEEK_H = 120;

// Eventos que "caen" sobre semanas concretas.
const EVENTS = [
  { week: 4, icon: "book", color: P.blue, label: "Unidad 1" },
  { week: 8, icon: "chart", color: P.orange, label: "Quiz" },
  { week: 12, icon: "flag", color: P.green, label: "Feriado" },
  { week: 17, icon: "chart", color: P.orange, label: "Examen" },
  { week: 22, icon: "users", color: P.blue, label: "Reunión" },
  { week: 27, icon: "calendar", color: P.green, label: "Proyecto" },
  { week: 32, icon: "chart", color: P.orange, label: "Examen final" },
];

export const A2Horizon: React.FC<AgentSceneProps> = ({ texts, lead, durationInFrames }) => {
  const { frame, opacity } = useScene(lead, durationInFrames, true);
  const t = texts.a2;

  // Cámara: empieza pegada a la semana 1 y se aleja para revelar el año completo.
  const cam = cameraStyle(frame, [
    { f: 0, x: X0 + 120, y: Y_BAR, s: 2.4, r: -1.5 },
    { f: 70, x: X0 + 160, y: Y_BAR - 10, s: 2.2, r: -1.2 },
    { f: 150, x: 960, y: 520, s: 1.0, r: 0 },
    { f: 240, x: 1010, y: 520, s: 1.04, r: 0.3 },
  ]);

  const counter = (target: number, start: number) =>
    Math.round(ease(frame, [start, start + 40], [0, target]));

  return (
    <AbsoluteFill style={{ opacity }}>
      <div style={cam}>
        {/* Título */}
        <div
          style={{
            position: "absolute",
            left: 150,
            top: 170,
            fontFamily: SERIF,
            fontSize: 84,
            color: P.dark,
            opacity: ease(frame, [60, 100], [0, 1]),
            transform: `translateY(${(1 - ease(frame, [60, 100], [0, 1])) * 30}px)`,
          }}
        >
          {t.title}
        </div>

        {/* Línea base */}
        <div
          style={{
            position: "absolute",
            left: X0,
            top: Y_BAR + WEEK_H + 18,
            width: lin(frame, [4, 110], [0, WEEKS * STEP]),
            height: 2,
            backgroundColor: P.dark,
          }}
        />

        {/* Semanas */}
        {Array.from({ length: WEEKS }, (_, i) => {
          const appear = ease(frame, [6 + i * 2.2, 6 + i * 2.2 + 20], [0, 1]);
          // Lo lejano se vuelve borroso e incierto (más tarde = más tenue).
          const fade = 1 - 0.55 * ease(frame, [150, 210], [0, 1]) * (i / WEEKS);
          const month = Math.floor(i / 4);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: X0 + i * STEP,
                top: Y_BAR + (1 - appear) * 40,
                width: WEEK_W,
                height: WEEK_H,
                borderRadius: 10,
                backgroundColor: month % 2 === 0 ? P.peach : hexA(P.sky, 0.6),
                opacity: appear * fade,
                filter: `blur(${(i / WEEKS) * 2.6 * ease(frame, [150, 210], [0, 1])}px)`,
              }}
            />
          );
        })}

        {/* Meses */}
        {t.months.map((m, i) => (
          <div
            key={m}
            style={{
              position: "absolute",
              left: X0 + i * 4 * STEP,
              top: Y_BAR + WEEK_H + 34,
              fontFamily: SANS,
              fontWeight: 500,
              fontSize: 26,
              color: P.mid,
              opacity: ease(frame, [60 + i * 4, 90 + i * 4], [0, 1]),
            }}
          >
            {m}
          </div>
        ))}

        {/* Eventos que caen sobre las semanas */}
        {EVENTS.map((e, i) => {
          const start = 100 + i * 9;
          const p = ease(frame, [start, start + 24], [0, 1]);
          return (
            <div
              key={e.label}
              style={{
                position: "absolute",
                left: X0 + e.week * STEP + WEEK_W / 2 - 80,
                top: Y_BAR - 150 - (1 - p) * 80,
                width: 160,
                opacity: p,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div
                style={{
                  ...cardStyle({ borderRadius: 18 }),
                  width: 88,
                  height: 88,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon name={e.icon} size={42} color={e.color} />
              </div>
              <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 24, color: P.dark }}>
                {e.label}
              </div>
            </div>
          );
        })}

        {/* Contadores */}
        <div
          style={{
            position: "absolute",
            left: 150,
            top: 770,
            display: "flex",
            gap: 90,
            opacity: ease(frame, [120, 150], [0, 1]),
          }}
        >
          {[
            { v: counter(36, 120), l: t.stats[0] },
            { v: counter(4, 130), l: t.stats[1] },
            { v: counter(12, 140), l: t.stats[2] },
          ].map((s, i) => (
            <div key={i}>
              <div style={{ fontFamily: SERIF, fontSize: 80, lineHeight: "84px", color: P.dark }}>{s.v}</div>
              <div style={{ fontFamily: SANS, fontSize: 26, color: P.mid }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Nota de incertidumbre */}
        <div
          style={{
            position: "absolute",
            left: 900,
            top: 206,
            fontFamily: SERIF,
            fontStyle: "italic",
            fontSize: 44,
            color: P.orange,
            opacity: ease(frame, [170, 205], [0, 1]),
            transform: `translateY(${(1 - ease(frame, [170, 205], [0, 1])) * 20}px)`,
          }}
        >
          {t.uncertain}
        </div>
      </div>
    </AbsoluteFill>
  );
};

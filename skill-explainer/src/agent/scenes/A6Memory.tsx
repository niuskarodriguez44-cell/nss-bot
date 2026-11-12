import React from "react";
import { AbsoluteFill } from "remotion";
import { Cursor, cursorAt } from "../Cursor";
import { cameraStyle } from "../camera";
import { MONO, SANS, SERIF, ease, hexA, P } from "../theme";
import { Icon, Pill, cardStyle } from "../ui";
import { useScene } from "../../theme";
import type { AgentSceneProps } from "../types";

export const MEM = { notes: 20, noteGap: 22, review: 76, chips: 96, clickChip: 128 };

const DOT_COLORS = [P.orange, P.blue, P.green, P.skyDeep];

export const A6Memory: React.FC<AgentSceneProps> = ({ texts, lead, durationInFrames }) => {
  const { frame, opacity } = useScene(lead, durationInFrames, true);
  const t = texts.a6;

  const cam = cameraStyle(frame, [
    { f: 0, x: 700, y: 540, s: 1.15, r: -0.6 },
    { f: 90, x: 1000, y: 530, s: 1.15, r: 0.4 },
    { f: 150, x: 960, y: 540, s: 1.0, r: 0 },
    { f: 180, x: 960, y: 540, s: 1.04, r: 0 },
  ]);

  const keys = [
    { f: 0, x: 400, y: 700 },
    { f: 60, x: 1250, y: 640 },
    { f: 100, x: 1180, y: 700 },
    { f: MEM.clickChip, x: 1180, y: 700 },
    { f: 168, x: 1500, y: 820 },
  ];
  const cur = cursorAt(frame, keys);
  const chipHover = ease(Math.hypot(cur.x - 1180, cur.y - 700), [0, 90], [1, 0]);

  const cardIn = (start: number) => ease(frame, [start, start + 28], [0, 1]);
  const days = t.days;

  return (
    <AbsoluteFill style={{ opacity }}>
      <div style={cam}>
        {/* Memoria del curso */}
        <div
          style={{
            position: "absolute",
            left: 190,
            top: 200,
            width: 780,
            height: 640,
            boxSizing: "border-box",
            padding: "36px 44px",
            ...cardStyle({ borderRadius: 32 }),
            opacity: cardIn(0),
            transform: `translateY(${(1 - cardIn(0)) * 40}px)`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: SERIF, fontSize: 56, color: P.dark }}>
            <Icon name="note" size={46} color={P.orange} />
            {t.memoryTitle}
          </div>
          <div style={{ height: 2, backgroundColor: P.line, margin: "22px 0 18px" }} />
          {t.notes.map((n, i) => {
            const p = ease(frame, [MEM.notes + i * MEM.noteGap, MEM.notes + i * MEM.noteGap + 22], [0, 1]);
            return (
              <div
                key={n}
                style={{
                  height: 98,
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  fontFamily: SANS,
                  fontSize: 30,
                  color: P.dark,
                  opacity: p,
                  transform: `translateX(${(1 - p) * 40}px)`,
                }}
              >
                <div style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: DOT_COLORS[i % 4], flexShrink: 0 }} />
                {n}
              </div>
            );
          })}
        </div>

        {/* Revisión semanal */}
        <div
          style={{
            position: "absolute",
            left: 1020,
            top: 200,
            width: 710,
            height: 300,
            boxSizing: "border-box",
            padding: "30px 40px",
            ...cardStyle({ borderRadius: 32 }),
            opacity: cardIn(MEM.review - 20),
            transform: `translateY(${(1 - cardIn(MEM.review - 20)) * 40}px)`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: SANS, fontWeight: 600, fontSize: 32, color: P.dark }}>
            <Icon
              name="refresh"
              size={40}
              color={P.blue}
              style={{ transform: `rotate(${frame * 6}deg)` }}
            />
            {t.reviewTitle}
          </div>
          <div style={{ display: "flex", gap: 14, marginTop: 34 }}>
            {days.map((d, i) => {
              const on = i === 0;
              const pulse = on ? 0.5 + 0.5 * Math.sin(frame / 7) : 0;
              return (
                <div
                  key={d}
                  style={{
                    width: 104,
                    height: 104,
                    borderRadius: 24,
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    backgroundColor: on ? P.orange : P.bg,
                    border: `2px solid ${on ? P.orange : P.line}`,
                    boxShadow: on ? `0 0 ${20 + 24 * pulse}px ${hexA(P.orange, 0.35)}` : "none",
                    fontFamily: SANS,
                    fontWeight: 600,
                    fontSize: 28,
                    color: on ? "#fff" : P.mid,
                  }}
                >
                  {d}
                  {on ? <Icon name="check" size={26} color="#fff" width={3} /> : null}
                </div>
              );
            })}
          </div>
        </div>

        {/* Skills que usa */}
        <div
          style={{
            position: "absolute",
            left: 1020,
            top: 540,
            width: 710,
            height: 300,
            boxSizing: "border-box",
            padding: "30px 40px",
            ...cardStyle({ borderRadius: 32 }),
            opacity: cardIn(MEM.chips - 20),
            transform: `translateY(${(1 - cardIn(MEM.chips - 20)) * 40}px)`,
          }}
        >
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 32, color: P.dark }}>{t.skillsTitle}</div>
          <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 16 }}>
            {t.skills.map((s, i) => {
              const p = ease(frame, [MEM.chips + i * 12, MEM.chips + i * 12 + 22], [0, 1]);
              return (
                <div
                  key={s}
                  style={{
                    opacity: p,
                    transform: `translateY(${(1 - p) * -30}px)`,
                    alignSelf: "flex-start",
                  }}
                >
                  <Pill
                    label={s}
                    hover={i === 0 ? chipHover : 0}
                    color={P.blue}
                    size={24}
                    style={{ fontFamily: MONO, fontWeight: 400 }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <Cursor frame={frame} keys={keys} clicks={[MEM.clickChip]} visibleFrom={0} />
      </div>
    </AbsoluteFill>
  );
};

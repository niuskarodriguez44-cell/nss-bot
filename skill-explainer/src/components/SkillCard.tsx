import React from "react";
import { COLORS, LINE, MONO, POPPINS, RADIUS } from "../theme";

export const CARD_W = 900;
export const CARD_H = 520;

const DOT_COLORS = [COLORS.orange, COLORS.blue, COLORS.green, COLORS.orange];

type Props = {
  file: string;
  rows: string[];
  /** Progreso de aparición (0-1) de cada fila. */
  rowsProgress: number[];
  /** Progreso (0-1) del contorno naranja dibujado con strokeDashoffset. */
  outlineProgress: number;
  /** Intensidad (0-1) del brillo naranja alrededor de la tarjeta. */
  glow: number;
};

/** Tarjeta "SKILL.md" compartida por las escenas 3 y 4. */
export const SkillCard: React.FC<Props> = ({
  file,
  rows,
  rowsProgress,
  outlineProgress,
  glow,
}) => {
  return (
    <div
      style={{
        position: "relative",
        width: CARD_W,
        height: CARD_H,
        boxSizing: "border-box",
        padding: 48,
        borderRadius: RADIUS,
        backgroundColor: COLORS.lightGray,
        boxShadow: `0 0 ${80 * glow}px ${14 * glow}px rgba(217, 119, 87, ${
          0.5 * glow
        })`,
      }}
    >
      <div
        style={{
          fontFamily: MONO,
          fontSize: 44,
          lineHeight: "58px",
          color: COLORS.dark,
          paddingBottom: 26,
          borderBottom: `${LINE}px solid ${COLORS.midGray}`,
          whiteSpace: "nowrap",
        }}
      >
        {file}
      </div>
      <div style={{ paddingTop: 12 }}>
        {rows.map((label, i) => {
          const p = rowsProgress[i] ?? 0;
          return (
            <div
              key={label}
              style={{
                height: 84,
                display: "flex",
                alignItems: "center",
                gap: 28,
                opacity: p,
                transform: `translateX(${(1 - p) * 40}px)`,
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: DOT_COLORS[i % DOT_COLORS.length],
                  flexShrink: 0,
                }}
              />
              <div
                style={{
                  fontFamily: POPPINS,
                  fontWeight: 600,
                  fontSize: 40,
                  color: COLORS.dark,
                }}
              >
                {label}
              </div>
            </div>
          );
        })}
      </div>
      {/* Contorno naranja que se dibuja alrededor de la tarjeta */}
      <svg
        width={CARD_W + 16}
        height={CARD_H + 16}
        viewBox={`0 0 ${CARD_W + 16} ${CARD_H + 16}`}
        style={{ position: "absolute", left: -8, top: -8, overflow: "visible" }}
      >
        <rect
          x={1.5}
          y={1.5}
          width={CARD_W + 13}
          height={CARD_H + 13}
          rx={RADIUS + 8}
          fill="none"
          stroke={COLORS.orange}
          strokeWidth={3}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - outlineProgress}
          opacity={outlineProgress > 0 ? 1 : 0}
        />
      </svg>
    </div>
  );
};

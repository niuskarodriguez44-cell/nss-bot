import React from "react";
import { SOFT, ease, hexA, P } from "./theme";

export type CurKey = { f: number; x: number; y: number };

/** Posición del cursor: recorre los puntos con curvas suaves (arco lateral sutil). */
export const cursorAt = (frame: number, keys: CurKey[]) => {
  if (frame <= keys[0].f) return { x: keys[0].x, y: keys[0].y };
  const last = keys[keys.length - 1];
  if (frame >= last.f) return { x: last.x, y: last.y };
  let i = 0;
  while (i < keys.length - 2 && frame > keys[i + 1].f) i++;
  const a = keys[i];
  const b = keys[i + 1];
  const t = ease(frame, [a.f, b.f], [0, 1], SOFT);
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const arc = Math.min(40, len * 0.12) * Math.sin(Math.PI * t) * (i % 2 === 0 ? 1 : -1);
  return {
    x: a.x + dx * t + (-dy / len) * arc,
    y: a.y + dy * t + (dx / len) * arc,
  };
};

/** 0 -> 1 -> 0 alrededor de cada clic (para el "apretón" del cursor y las ondas). */
export const pressAt = (frame: number, clicks: number[]) =>
  Math.max(
    0,
    ...clicks.map((c) => ease(frame, [c - 4, c], [0, 1]) * (1 - ease(frame, [c, c + 8], [0, 1]))),
  );

type Props = { frame: number; keys: CurKey[]; clicks?: number[]; visibleFrom?: number };

/** Cursor tipo puntero con ondas naranjas en cada clic. Va en coordenadas del mundo. */
export const Cursor: React.FC<Props> = ({ frame, keys, clicks = [], visibleFrom = 0 }) => {
  const { x, y } = cursorAt(frame, keys);
  const press = pressAt(frame, clicks);
  const vis = ease(frame, [visibleFrom, visibleFrom + 10], [0, 1]);
  return (
    <>
      {clicks.map((c, i) => {
        const p = ease(frame, [c, c + 22], [0, 1]);
        if (p <= 0 || p >= 1) return null;
        const pos = cursorAt(c, keys);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: pos.x - 40,
              top: pos.y - 40,
              width: 80,
              height: 80,
              borderRadius: 40,
              border: `3px solid ${hexA(P.orange, 1 - p)}`,
              transform: `scale(${0.2 + 0.8 * p})`,
            }}
          />
        );
      })}
      <svg
        width={40}
        height={44}
        viewBox="0 0 28 32"
        style={{
          position: "absolute",
          left: x - 3,
          top: y - 2,
          opacity: vis,
          transform: `scale(${1 - 0.12 * press})`,
          transformOrigin: "3px 2px",
          filter: "drop-shadow(0 3px 5px rgba(20,20,19,0.25))",
        }}
      >
        <path
          d="M3 2 L3 24 L9 18.5 L13.5 28 L17.5 26 L13 16.8 L21.5 16.8 Z"
          fill={P.dark}
          stroke="#ffffff"
          strokeWidth={2}
          strokeLinejoin="round"
        />
      </svg>
    </>
  );
};

import React from "react";
import { B } from "./brand";

export type Mascot = "cubi" | "chispa" | "byte" | "lupa" | "nexo" | "pulso";

const COLOR: Record<Mascot, string> = {
  cubi: B.teal,
  chispa: B.orange,
  byte: B.blue,
  lupa: B.purple,
  nexo: B.yellow,
  pulso: B.pink,
};

const starPath = (r: number, ri: number) =>
  Array.from({ length: 10 }, (_, i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 === 0 ? r : ri;
    return `${i === 0 ? "M" : "L"} ${rr * Math.cos(a)} ${rr * Math.sin(a)}`;
  }).join(" ") + " Z";

const hexPath = (r: number) =>
  Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i;
    return `${i === 0 ? "M" : "L"} ${r * Math.cos(a)} ${r * Math.sin(a) * 0.92}`;
  }).join(" ") + " Z";

/**
 * Mascotas de CubanBot (mismas formas y colores que el póster).
 * size = alto aproximado en px; blink 0-1 cierra los ojos; look desplaza las pupilas.
 */
export const MascotSvg: React.FC<{
  kind: Mascot;
  size: number;
  blink?: number;
  look?: number;
  style?: React.CSSProperties;
}> = ({ kind, size, blink = 0, look = 0, style }) => {
  const c = COLOR[kind];
  const eyeH = (h: number) => Math.max(h * 0.12, h * (1 - blink));
  const eyes = (sep: number, w: number, h: number, cy: number) => (
    <g>
      {[-1, 1].map((s) => (
        <rect
          key={s}
          x={s * sep - w / 2 + look * 6}
          y={cy - eyeH(h) / 2}
          width={w}
          height={eyeH(h)}
          rx={w / 2}
          fill="#fff"
        />
      ))}
    </g>
  );
  let body: React.ReactNode;
  if (kind === "cubi") {
    body = (
      <>
        <path
          d="M -100 40 L -100 -20 A 100 100 0 0 1 100 -20 L 100 40 A 60 60 0 0 1 40 100 L -40 100 A 60 60 0 0 1 -100 40 Z"
          fill={c}
        />
        {eyes(38, 34, 66, -10)}
      </>
    );
  } else if (kind === "chispa") {
    body = (
      <>
        <path
          d={starPath(100, 52)}
          fill={c}
          stroke={c}
          strokeWidth={26}
          strokeLinejoin="round"
        />
        {eyes(22, 18, 34, 6)}
      </>
    );
  } else if (kind === "byte") {
    body = (
      <>
        <rect x={-95} y={-95} width={190} height={190} rx={46} fill={c} />
        {eyes(32, 26, 48, 0)}
      </>
    );
  } else if (kind === "lupa") {
    body = (
      <>
        <circle r={98} fill={c} />
        {eyes(30, 24, 44, 4)}
      </>
    );
  } else if (kind === "nexo") {
    body = (
      <>
        <path
          d={hexPath(100)}
          fill={c}
          stroke={c}
          strokeWidth={22}
          strokeLinejoin="round"
        />
        {eyes(30, 24, 44, 0)}
      </>
    );
  } else {
    body = (
      <>
        <circle r={98} fill={c} />
        {[-1, 1].map((s) => (
          <path
            key={s}
            d={`M ${s * 34 - 20} 2 A 20 20 0 0 1 ${s * 34 + 20} 2`}
            fill="none"
            stroke="#fff"
            strokeWidth={11}
            strokeLinecap="round"
          />
        ))}
      </>
    );
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="-125 -125 250 250"
      style={{ overflow: "visible", ...style }}
    >
      <ellipse cx={0} cy={118} rx={80} ry={10} fill="rgba(0,0,0,0.08)" />
      {body}
    </svg>
  );
};

/** Parpadeo determinista: cierra los ojos unos frames de vez en cuando. */
export const blinkAt = (frame: number, seed: number) => {
  const t = (frame + seed * 37) % 110;
  return t < 3 ? t / 3 : t < 6 ? (6 - t) / 3 : 0;
};

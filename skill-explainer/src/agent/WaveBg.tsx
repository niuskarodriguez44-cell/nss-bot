import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { hexA, P } from "./theme";
import { AGENT_TOTAL } from "./theme";

const smoothWave = (
  frame: number,
  baseY: number,
  amp: number,
  speed: number,
  phase: number,
) => {
  const seg = 8;
  const w = 2160 / seg;
  const pts = Array.from({ length: seg + 1 }, (_, i) => ({
    x: -120 + i * w,
    y:
      baseY +
      amp * Math.sin(frame * speed + i * 1.1 + phase) +
      amp * 0.5 * Math.sin(frame * speed * 0.6 + i * 2.3 + phase),
  }));
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const mx = (pts[i - 1].x + pts[i].x) / 2;
    const my = (pts[i - 1].y + pts[i].y) / 2;
    d += ` Q ${pts[i - 1].x} ${pts[i - 1].y} ${mx} ${my}`;
  }
  d += ` L ${pts[pts.length - 1].x} ${pts[pts.length - 1].y} L 2040 1080 L -120 1080 Z`;
  return d;
};

/**
 * Fondo editorial: crema con colina durazno arriba a la derecha y olas azules
 * que suben poco a poco durante el video (la "planificación" va tomando forma).
 */
export const WaveBg: React.FC = () => {
  const frame = useCurrentFrame();
  const level = interpolate(
    frame,
    [0, 420, 720, 1140, 1500, AGENT_TOTAL],
    [0.05, 0.14, 0.2, 0.38, 0.55, 0.9],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const base = 1080 - (70 + 380 * level);
  const dx = 40 * Math.sin(frame / 120);
  const dy = 24 * Math.cos(frame / 150);

  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        <defs>
          <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fcf6ee" />
            <stop offset="1" stopColor="#f8e9da" />
          </linearGradient>
          <linearGradient id="peach" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={P.peachLight} />
            <stop offset="1" stopColor={P.peach} />
          </linearGradient>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={P.sky} stopOpacity={0.75} />
            <stop offset="1" stopColor={P.skyDeep} stopOpacity={0.9} />
          </linearGradient>
        </defs>
        <rect width={1920} height={1080} fill="url(#bgGrad)" />
        <path
          d={`M ${1180 + dx} 0 C ${1440 + dx} ${90 + dy}, ${1660} ${250 + dy}, 1920 ${330 + dy} L 1920 0 Z`}
          fill="url(#peach)"
          opacity={0.55}
        />
        <path
          d={`M ${1500 + dx} 0 C ${1650} ${80 + dy}, ${1790} ${150 + dy}, 1920 ${190 + dy} L 1920 0 Z`}
          fill="url(#peach)"
          opacity={0.6}
        />
        <path
          d={smoothWave(frame, base - 46, 22, 0.018, 1.2)}
          fill={hexA(P.peach, 0.55)}
        />
        <path d={smoothWave(frame, base, 26, 0.022, 0)} fill="url(#sky)" opacity={0.85} />
        <path
          d={smoothWave(frame, base + 60, 20, 0.026, 2.4)}
          fill={hexA(P.skyDeep, 0.55)}
        />
      </svg>
    </AbsoluteFill>
  );
};

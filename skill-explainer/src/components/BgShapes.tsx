import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, hexA, lin } from "../theme";
import { TOTAL_FRAMES } from "../timeline";

/**
 * Formas geométricas discretas (estilo editorial) que derivan lentamente,
 * más una barra de progreso fina abajo. Todo depende solo del frame.
 */
export const BgShapes: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = (seed: number, ax: number, ay: number) => ({
    x: ax * Math.sin(frame / 70 + seed),
    y: ay * Math.cos(frame / 90 + seed * 1.7),
  });

  const ring = drift(0.4, 16, 12);
  const disc = drift(2.1, 12, 16);
  const half = drift(4.2, 14, 10);
  const spin = frame * 0.35;

  // Asterisco de 8 puntas (naranja)
  const rays = Array.from({ length: 4 }, (_, i) => (i * 180) / 4);

  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        <circle
          cx={1850 + ring.x}
          cy={60 + ring.y}
          r={74}
          fill="none"
          stroke={COLORS.lightGray}
          strokeWidth={2}
        />
        <circle
          cx={60 + disc.x}
          cy={1020 + disc.y}
          r={78}
          fill={hexA(COLORS.lightGray, 0.7)}
        />
        <path
          d={`M ${40 + half.x} ${120 + half.y} a 46 46 0 0 1 92 0 z`}
          fill={hexA(COLORS.blue, 0.35)}
        />
        <g
          transform={`translate(${1860 + half.x} ${990 + half.y}) rotate(${spin})`}
          stroke={hexA(COLORS.orange, 0.7)}
          strokeWidth={4}
          strokeLinecap="round"
        >
          {rays.map((a) => (
            <line key={a} x1={0} y1={-26} x2={0} y2={26} transform={`rotate(${a})`} />
          ))}
        </g>
        {/* Barra de progreso */}
        <rect x={0} y={1076} width={1920} height={4} fill={hexA(COLORS.lightGray, 0.8)} />
        <rect
          x={0}
          y={1076}
          width={lin(frame, [0, TOTAL_FRAMES], [0, 1920])}
          height={4}
          fill={COLORS.orange}
        />
      </svg>
    </AbsoluteFill>
  );
};

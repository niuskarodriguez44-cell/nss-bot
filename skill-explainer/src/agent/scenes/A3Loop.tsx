import React from "react";
import { AbsoluteFill } from "remotion";
import { evolvePath, getLength, getPointAtLength } from "@remotion/paths";
import { cameraStyle } from "../camera";
import { ease, hexA, P, SANS, SERIF } from "../theme";
import { Icon, cardStyle } from "../ui";
import { useScene } from "../../theme";
import type { AgentSceneProps } from "../types";

const CX = 960;
const CY = 520;
const RX = 540;
const RY = 270;
const NODE_W = 270;
const NODE_H = 100;
const ICONS = ["target", "note", "spark", "search", "refresh"];
const COLORS = [P.dark, P.blue, P.orange, P.green, P.skyDeep];
const START = 44;
const SEG = 30; // frames por tramo

const pt = (deg: number) => {
  const a = (deg * Math.PI) / 180;
  return { x: CX + RX * Math.cos(a), y: CY + RY * Math.sin(a) };
};
const ANGLES = [-90, -18, 54, 126, 198];
const NODES = ANGLES.map(pt);
const segPath = (i: number) => {
  const a = pt(ANGLES[i]);
  const b = pt(ANGLES[(i + 1) % 5] + (i === 4 ? 360 : 0));
  return `M ${a.x} ${a.y} A ${RX} ${RY} 0 0 1 ${b.x} ${b.y}`;
};
const SEGS = Array.from({ length: 5 }, (_, i) => segPath(i));
const LENS = SEGS.map((d) => getLength(d));

// Chips de herramientas a la derecha del nodo "Actuar".
const CHIP_ICONS = ["calendar", "book", "note", "chart"];

export const A3Loop: React.FC<AgentSceneProps> = ({ texts, lead, durationInFrames }) => {
  const { frame, opacity } = useScene(lead, durationInFrames, true);
  const t = texts.a3;

  const u = Math.max(0, (frame - START) / SEG); // segmentos recorridos (continuo)
  const segIdx = Math.floor(u) % 5;
  const local = u - Math.floor(u);
  const dot = frame >= START ? getPointAtLength(SEGS[segIdx], LENS[segIdx] * local) : null;

  const cam = cameraStyle(frame, [
    { f: 0, x: 960, y: 520, s: 1.0, r: -1.2 },
    { f: 100, x: 1010, y: 560, s: 1.1, r: 0 },
    { f: 130, x: 1330, y: 700, s: 1.55, r: 1.0 },
    { f: 200, x: 1330, y: 690, s: 1.5, r: 1.0 },
    { f: 250, x: 960, y: 530, s: 1.05, r: -0.8 },
    { f: 300, x: 960, y: 520, s: 1.0, r: 0 },
  ]);

  // Pulso de cada nodo cuando el punto llega a él (en cualquier vuelta).
  const pulseOf = (node: number) => {
    let best = 0;
    for (let lap = 0; lap < 6; lap++) {
      const arrive = START + (lap * 5 + ((node + 4) % 5) + 1) * SEG - (node === 0 && lap === 0 ? 0 : 0);
      if (node === 0 && lap === 0) continue;
      const v = ease(frame, [arrive, arrive + 8], [0, 1]) * (1 - ease(frame, [arrive + 8, arrive + 34], [0, 1]));
      best = Math.max(best, v);
    }
    return best;
  };

  return (
    <AbsoluteFill style={{ opacity }}>
      <div style={cam}>
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
          {SEGS.map((d, i) => {
            const startF = START + i * SEG;
            const drawn = ease(frame, [startF, startF + SEG], [0, 1], (x) => x);
            const settled = frame > START + 5 * SEG ? 1 : drawn;
            return (
              <path
                key={i}
                d={d}
                fill="none"
                stroke={P.dark}
                strokeWidth={2.5}
                strokeLinecap="round"
                opacity={0.55}
                {...evolvePath(settled, d)}
              />
            );
          })}
          {/* Cuerda de retroalimentación: Ajustar -> Plan */}
          <path
            d={`M ${NODES[4].x + 30} ${NODES[4].y - 52} C ${CX - 330} ${CY - 250}, ${CX + 330} ${CY - 250}, ${NODES[1].x - 30} ${NODES[1].y - 52}`}
            fill="none"
            stroke={P.orange}
            strokeWidth={3}
            strokeDasharray="10 12"
            strokeLinecap="round"
            opacity={ease(frame, [210, 240], [0, 1])}
          />
          {dot ? (
            <>
              <circle cx={dot.x} cy={dot.y} r={22} fill={hexA(P.orange, 0.25)} />
              <circle cx={dot.x} cy={dot.y} r={10} fill={P.orange} />
            </>
          ) : null}
        </svg>

        {/* Centro */}
        <div
          style={{
            position: "absolute",
            left: CX - 300,
            top: CY - 110,
            width: 600,
            textAlign: "center",
            opacity: ease(frame, [10, 40], [0, 1]),
          }}
        >
          <div style={{ fontFamily: SERIF, fontSize: 120, lineHeight: "124px", color: P.dark }}>{t.center}</div>
          <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 38, color: P.mid, marginTop: 8 }}>
            {t.centerSub}
          </div>
        </div>

        {/* Nodos del ciclo */}
        {t.nodes.map((n, i) => {
          const appear = ease(frame, [6 + i * 6, 30 + i * 6], [0, 1]);
          const pulse = pulseOf(i);
          return (
            <div
              key={n.label}
              style={{
                position: "absolute",
                left: NODES[i].x - NODE_W / 2,
                top: NODES[i].y - NODE_H / 2,
                width: NODE_W,
                height: NODE_H,
                boxSizing: "border-box",
                padding: "0 24px",
                display: "flex",
                alignItems: "center",
                gap: 16,
                ...cardStyle({
                  borderRadius: 28,
                  border: `2px solid ${pulse > 0.05 ? COLORS[i] : P.line}`,
                  boxShadow: `0 ${20 + 10 * pulse}px 50px ${hexA(COLORS[i], 0.12 + 0.25 * pulse)}`,
                }),
                opacity: appear,
                transform: `translateY(${(1 - appear) * 30}px) scale(${1 + 0.06 * pulse})`,
              }}
            >
              <div
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: 27,
                  backgroundColor: hexA(COLORS[i], 0.14),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon name={ICONS[i]} size={30} color={COLORS[i]} />
              </div>
              <div>
                <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 30, color: P.dark, lineHeight: "34px" }}>
                  {n.label}
                </div>
                <div style={{ fontFamily: SANS, fontSize: 20, color: P.mid, lineHeight: "24px", whiteSpace: "nowrap" }}>
                  {n.sub}
                </div>
              </div>
            </div>
          );
        })}

        {/* Herramientas que usa el agente en "Actuar" */}
        {t.tools.map((tool, i) => {
          const start = 112 + i * 14;
          const p = ease(frame, [start, start + 26], [0, 1]);
          const x = 1500;
          const y = 600 + i * 86;
          return (
            <div key={tool}>
              <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
                <path
                  d={`M ${NODES[2].x + NODE_W / 2} ${NODES[2].y} C ${NODES[2].x + NODE_W / 2 + 90} ${NODES[2].y}, ${x - 90} ${y + 33}, ${x} ${y + 33}`}
                  fill="none"
                  stroke={P.orange}
                  strokeWidth={2}
                  {...evolvePath(p, `M ${NODES[2].x + NODE_W / 2} ${NODES[2].y} C ${NODES[2].x + NODE_W / 2 + 90} ${NODES[2].y}, ${x - 90} ${y + 33}, ${x} ${y + 33}`)}
                />
              </svg>
              <div
                style={{
                  position: "absolute",
                  left: x,
                  top: y,
                  height: 66,
                  padding: "0 26px",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  ...cardStyle({ borderRadius: 33, boxShadow: "0 10px 26px rgba(120,88,56,0.10)" }),
                  fontFamily: SANS,
                  fontWeight: 500,
                  fontSize: 26,
                  color: P.dark,
                  whiteSpace: "nowrap",
                  opacity: p,
                  transform: `translateX(${(1 - p) * 60}px)`,
                }}
              >
                <Icon name={CHIP_ICONS[i]} size={28} color={P.orange} />
                {tool}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

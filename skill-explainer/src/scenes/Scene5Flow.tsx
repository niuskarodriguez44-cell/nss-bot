import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useVideoConfig } from "remotion";
import { evolvePath, getLength, getPointAtLength } from "@remotion/paths";
import { MaskSwap } from "../components/MaskSwap";
import { COLORS, ease, LINE, LORA, MONO, POPPINS, RADIUS, EASE, useScene } from "../theme";
import type { SceneProps } from "./types";

// Lista de skills (izquierda)
const ROW_X = 140;
const ROW_W = 640;
const ROW_H = 112;
const ROW_Y0 = 210;
const ROW_STEP = 140;
const rowY = (i: number) => ROW_Y0 + i * ROW_STEP;

// Petición del docente y panel de Claude (derecha)
const REQ = { x: 1020, y: 190, w: 760, h: 104 };
const PANEL = { x: 1020, y: 420, w: 760, h: 420 };

// Frames nominales clave (también los usa Soundtrack.tsx)
export const FLOW = {
  rowsIn: 0,
  requestIn: 18,
  pathRequest: 40,
  scanStart: 52,
  scanStops: [52, 58, 64, 70, 76, 82, 88, 94, 124],
  match: 124,
  pathLoad: 128,
  panelIn: 126,
  tableStart: 175,
  checkStart: 215,
  steps: [48, 100, 132, 172],
};

const PATH_REQUEST = `M ${REQ.x} ${REQ.y + REQ.h / 2} C ${REQ.x - 100} ${REQ.y + REQ.h / 2}, ${ROW_X + ROW_W + 110} ${rowY(0) + ROW_H / 2}, ${ROW_X + ROW_W} ${rowY(0) + ROW_H / 2}`;
const PATH_LOAD = `M ${ROW_X + ROW_W} ${rowY(0) + ROW_H - 12} C ${ROW_X + ROW_W + 140} ${rowY(0) + ROW_H - 12}, ${PANEL.x - 140} ${PANEL.y + 150}, ${PANEL.x} ${PANEL.y + 150}`;

const TABLE_X = PANEL.x + 36;
const TABLE_Y = PANEL.y + 100;
const COLS = [180, 340, 150];
const T_ROW_H = 64;

export const Scene5Flow: React.FC<SceneProps> = ({ texts, lead, durationInFrames }) => {
  const { frame, opacity } = useScene(lead, durationInFrames, true);
  const { fps } = useVideoConfig();
  const t = texts.s5;
  const topic = texts.s6.topics[0];

  // Cámara: empuje muy suave durante toda la escena.
  const push = ease(frame, [0, 270], [1, 1.035], Easing.inOut(Easing.sin));
  const panX = ease(frame, [0, 270], [0, -14], Easing.inOut(Easing.sin));

  // Resaltado que recorre las skills y vuelve a la primera.
  const scanIdx = interpolate(
    frame,
    FLOW.scanStops,
    [0, 0, 1, 1, 2, 2, 3, 3, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE },
  );
  const scanOpacity = ease(frame, [FLOW.scanStart - 4, FLOW.scanStart + 4], [0, 1]);
  const dim = ease(frame, [FLOW.match - 12, FLOW.match + 6], [0, 1]);

  // Petición del docente.
  const reqS = spring({ frame: frame - FLOW.requestIn, fps, config: { damping: 200 } });

  // Trazos y puntos viajeros.
  const drawReq = ease(frame, [FLOW.pathRequest, FLOW.pathRequest + 22], [0, 1]);
  const lenReq = getLength(PATH_REQUEST);
  const dotReq = getPointAtLength(PATH_REQUEST, lenReq * drawReq) ?? { x: 0, y: 0 };

  const drawLoad = ease(frame, [FLOW.pathLoad, FLOW.pathLoad + 28], [0, 1]);
  const lenLoad = getLength(PATH_LOAD);

  // Panel de Claude.
  const panelDraw = ease(frame, [FLOW.panelIn, FLOW.panelIn + 28], [0, 1]);
  const panelFill = ease(frame, [FLOW.panelIn + 14, FLOW.panelIn + 34], [0, 1]);

  // Pasos (mensaje inferior) con cambio enmascarado.
  const stepPos = FLOW.steps.slice(1).reduce(
    (acc, start) => acc + ease(frame, [start, start + 14], [0, 1]),
    0,
  );
  const stepsVisible = ease(frame, [FLOW.steps[0], FLOW.steps[0] + 14], [0, 1]);

  const rowProgress = (r: number) => {
    const start = FLOW.tableStart + r * 8;
    return ease(frame, [start, start + 16], [0, 1]);
  };

  const check = ease(frame, [FLOW.checkStart, FLOW.checkStart + 20], [0, 1]);
  const checkRow0 = ease(frame, [FLOW.match, FLOW.match + 16], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: `translateX(${panX}px) scale(${push})`,
        transformOrigin: "960px 540px",
      }}
    >
      {/* Etiqueta */}
      <div
        style={{
          position: "absolute",
          left: ROW_X,
          top: 140,
          fontFamily: LORA,
          fontStyle: "italic",
          fontSize: 34,
          color: COLORS.midGray,
          opacity: ease(frame, [0, 18], [0, 1]),
        }}
      >
        {t.label}
      </div>

      {/* Lista de skills */}
      {t.skills.map((s, i) => {
        const p = spring({ frame: frame - i * 5, fps, config: { damping: 200 } });
        const dimmed = i === 0 ? 1 : 1 - 0.62 * dim;
        return (
          <div
            key={s.name}
            style={{
              position: "absolute",
              left: ROW_X,
              top: rowY(i),
              width: ROW_W,
              height: ROW_H,
              boxSizing: "border-box",
              padding: "0 32px",
              borderRadius: RADIUS,
              backgroundColor: COLORS.lightGray,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              opacity: p * dimmed,
              transform: `translateX(${(1 - p) * -80}px)`,
            }}
          >
            <div style={{ fontFamily: MONO, fontSize: 30, color: COLORS.dark }}>{s.name}</div>
            <div style={{ fontFamily: LORA, fontSize: 26, color: COLORS.midGray }}>{s.desc}</div>
            {i === 0 ? (
              <svg
                width={44}
                height={44}
                viewBox="0 0 44 44"
                style={{ position: "absolute", right: 28, top: ROW_H / 2 - 22 }}
              >
                <circle cx={22} cy={22} r={20} fill={COLORS.green} opacity={checkRow0} />
                <path
                  d="M 12 23 L 19 30 L 32 15"
                  fill="none"
                  stroke={COLORS.bg}
                  strokeWidth={4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={1 - checkRow0}
                />
              </svg>
            ) : null}
          </div>
        );
      })}

      {/* Resaltado "escáner" */}
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        <rect
          x={ROW_X - 10}
          y={rowY(0) + scanIdx * ROW_STEP - 10}
          width={ROW_W + 20}
          height={ROW_H + 20}
          rx={RADIUS + 6}
          fill="none"
          stroke={COLORS.orange}
          strokeWidth={3}
          opacity={scanOpacity}
        />
        {/* Petición -> lista */}
        <path
          d={PATH_REQUEST}
          fill="none"
          stroke={COLORS.midGray}
          strokeWidth={LINE}
          strokeLinecap="round"
          {...evolvePath(drawReq, PATH_REQUEST)}
        />
        <circle
          cx={dotReq.x}
          cy={dotReq.y}
          r={8}
          fill={COLORS.orange}
          opacity={drawReq > 0 && drawReq < 1 ? 1 : 0}
        />
        {/* Skill elegida -> panel */}
        <path
          d={PATH_LOAD}
          fill="none"
          stroke={COLORS.orange}
          strokeWidth={LINE}
          strokeLinecap="round"
          {...evolvePath(drawLoad, PATH_LOAD)}
        />
        {[0, 1, 2].map((k) => {
          const d = ease(frame, [FLOW.pathLoad + 6 + k * 8, FLOW.pathLoad + 38 + k * 8], [0, 1]);
          const pt = getPointAtLength(PATH_LOAD, lenLoad * d) ?? { x: 0, y: 0 };
          return (
            <circle
              key={k}
              cx={pt.x}
              cy={pt.y}
              r={9}
              fill={[COLORS.orange, COLORS.blue, COLORS.green][k]}
              opacity={d > 0 && d < 1 ? 1 : 0}
            />
          );
        })}
        {/* Contorno del panel de Claude */}
        <rect
          x={PANEL.x}
          y={PANEL.y}
          width={PANEL.w}
          height={PANEL.h}
          rx={RADIUS}
          fill="none"
          stroke={COLORS.midGray}
          strokeWidth={LINE}
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - panelDraw}
        />
      </svg>

      {/* Petición del docente */}
      <div
        style={{
          position: "absolute",
          left: REQ.x,
          top: REQ.y,
          width: REQ.w,
          height: REQ.h,
          boxSizing: "border-box",
          padding: "0 36px",
          borderRadius: RADIUS,
          backgroundColor: COLORS.lightGray,
          display: "flex",
          alignItems: "center",
          fontFamily: LORA,
          fontSize: 34,
          color: COLORS.dark,
          whiteSpace: "nowrap",
          opacity: reqS,
          transform: `translateX(${(1 - reqS) * 140}px)`,
        }}
      >
        {t.request}
      </div>

      {/* Panel de Claude */}
      <div
        style={{
          position: "absolute",
          left: PANEL.x,
          top: PANEL.y,
          width: PANEL.w,
          height: PANEL.h,
          borderRadius: RADIUS,
          backgroundColor: COLORS.lightGray,
          opacity: panelFill * 0.45,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: PANEL.x + 36,
          top: PANEL.y + 28,
          display: "flex",
          alignItems: "center",
          gap: 16,
          fontFamily: POPPINS,
          fontWeight: 600,
          fontSize: 30,
          color: COLORS.dark,
          opacity: panelFill,
        }}
      >
        <div style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: COLORS.orange }} />
        {t.panelTitle}
      </div>
      <svg
        width={48}
        height={48}
        viewBox="0 0 44 44"
        style={{ position: "absolute", left: PANEL.x + PANEL.w - 84, top: PANEL.y + 22 }}
      >
        <circle cx={22} cy={22} r={20} fill="none" stroke={COLORS.green} strokeWidth={3} opacity={check} />
        <path
          d="M 12 23 L 19 30 L 32 15"
          fill="none"
          stroke={COLORS.green}
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - check}
        />
      </svg>

      {/* Tabla dentro del panel */}
      {[texts.s6.tableHeaders, ...topic.rows].map((row, r) => {
        const p = rowProgress(r);
        return (
          <div
            key={r}
            style={{
              position: "absolute",
              left: TABLE_X,
              top: TABLE_Y + r * T_ROW_H,
              height: T_ROW_H,
              display: "flex",
              alignItems: "center",
              borderTop: r === 0 ? undefined : `${LINE}px solid ${COLORS.bg}`,
              fontFamily: r === 0 ? POPPINS : LORA,
              fontWeight: r === 0 ? 600 : 400,
              fontSize: r === 0 ? 24 : 28,
              color: r === 0 ? COLORS.midGray : COLORS.dark,
              opacity: p,
              transform: `translateX(${(1 - p) * 30}px)`,
            }}
          >
            {row.map((cellText, c) => (
              <div
                key={c}
                style={{
                  width: COLS[c],
                  whiteSpace: "nowrap",
                  fontFamily: r > 0 && c === 0 ? POPPINS : undefined,
                  fontWeight: r > 0 && c === 0 ? 600 : undefined,
                  color: r > 0 && c === 2 ? COLORS.orange : undefined,
                }}
              >
                {cellText}
              </div>
            ))}
          </div>
        );
      })}

      {/* Paso actual */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 910, opacity: stepsVisible }}>
        <MaskSwap
          items={t.steps.map((s, i) => (
            <span key={i} style={{ fontFamily: LORA, fontStyle: "italic", fontSize: 40, color: COLORS.midGray }}>
              <span style={{ color: COLORS.orange, fontFamily: POPPINS, fontStyle: "normal", fontWeight: 600 }}>
                {i + 1}
              </span>
              {"  ·  "}
              {s}
            </span>
          ))}
          pos={stepPos}
          height={64}
          justify="center"
        />
      </div>
    </AbsoluteFill>
  );
};


import React from "react";
import { AbsoluteFill } from "remotion";
import { evolvePath, getLength, getPointAtLength } from "@remotion/paths";
import { CARD_H, CARD_W, SkillCard } from "../components/SkillCard";
import {
  COLORS,
  CX,
  CY,
  ease,
  hexA,
  LINE,
  LORA,
  MONO,
  POPPINS,
  RADIUS,
  useScene,
} from "../theme";
import type { SceneProps } from "./types";

// Ventana final del editor.
const WIN = { x: 90, y: 130, w: 1200, h: 780 };
const START_W = CARD_W * 1.05;
const START_H = CARD_H * 1.05;
const LINE_H = 38;
const CODE_TOP = 120;
const CODE_LEFT = 112;

// Frames (nominales) de la escena.
export const TYPE_START = 40;
export const TYPE_SPEED = 3.2; // caracteres por frame
export const CALLOUT_START = 168;
export const CALLOUT_STEP = 34;

// Secciones del SKILL.md: líneas [desde, hasta] (0-based) y color.
const SECTIONS = [
  { lines: [0, 5], color: COLORS.dark },
  { lines: [7, 8], color: COLORS.orange },
  { lines: [9, 11], color: COLORS.blue },
  { lines: [12, 13], color: COLORS.green },
  { lines: [14, 15], color: COLORS.orange },
];

const PILL_X = 1370;
const PILL_W = 480;
const PILL_H = 100;
const PILL_CY = [190, 340, 490, 640, 790];

const lineY = (i: number) => WIN.y + CODE_TOP + i * LINE_H + LINE_H / 2;

const tokenColor = (line: string, part: "key" | "value" | "all") => {
  if (line === "---") return COLORS.midGray;
  if (line.startsWith("## ")) return COLORS.orange;
  if (part === "key") return COLORS.blue;
  return COLORS.dark;
};

/** Pinta una línea de código con colores sencillos de sintaxis. */
const renderLine = (full: string, shown: number): React.ReactNode => {
  const text = full.slice(0, shown);
  const m = full.match(/^(name|description):/);
  if (m) {
    const keyLen = m[0].length;
    return (
      <>
        <span style={{ color: tokenColor(full, "key") }}>
          {text.slice(0, keyLen)}
        </span>
        <span style={{ color: tokenColor(full, "value") }}>
          {text.slice(keyLen)}
        </span>
      </>
    );
  }
  const n = full.match(/^(\d+\.)/);
  if (n) {
    return (
      <>
        <span style={{ color: COLORS.green }}>{text.slice(0, n[0].length)}</span>
        <span style={{ color: COLORS.dark }}>{text.slice(n[0].length)}</span>
      </>
    );
  }
  return <span style={{ color: tokenColor(full, "all") }}>{text}</span>;
};

const connectorPath = (i: number) => {
  const [a, b] = SECTIONS[i].lines;
  const y0 = (lineY(a) + lineY(b)) / 2;
  const x0 = WIN.x + WIN.w + 6;
  const y1 = PILL_CY[i];
  return `M ${x0} ${y0} C ${x0 + 44} ${y0}, ${PILL_X - 44} ${y1}, ${PILL_X} ${y1}`;
};

export const Scene4Example: React.FC<SceneProps> = ({
  texts,
  lead,
  durationInFrames,
}) => {
  const { frame, opacity } = useScene(lead, durationInFrames, true);
  const code = texts.s4.code;

  // La tarjeta de la escena 3 se expande y se convierte en la ventana del archivo.
  const morph = ease(frame, [0, 46], [0, 1]);
  const left = CX - START_W / 2 + (WIN.x - (CX - START_W / 2)) * morph;
  const top = CY - START_H / 2 + (WIN.y - (CY - START_H / 2)) * morph;
  const width = START_W + (WIN.w - START_W) * morph;
  const height = START_H + (WIN.h - START_H) * morph;

  const cardOpacity = 1 - ease(frame, [2, 22], [0, 1]);
  const contentIn = ease(frame, [16, 40], [0, 1]);

  // Escritura del código, carácter a carácter (acumulado entre líneas).
  const totalChars = code.reduce((acc, l) => acc + l.length, 0);
  const typed = Math.min(
    totalChars,
    Math.max(0, Math.floor((frame - TYPE_START) * TYPE_SPEED)),
  );
  const typing = frame >= TYPE_START && typed < totalChars;
  let consumed = 0;
  let cursorLine = -1;
  let cursorCol = 0;
  const shownPerLine = code.map((line, i) => {
    const shown = Math.min(line.length, Math.max(0, typed - consumed));
    if (typing && cursorLine === -1 && shown < line.length) {
      cursorLine = i;
      cursorCol = shown;
    }
    consumed += line.length;
    return shown;
  });
  if (typing && cursorLine === -1) {
    cursorLine = code.length - 1;
    cursorCol = code[cursorLine].length;
  }
  const cursorOn = Math.floor(frame / 8) % 2 === 0;

  const calloutStart = (i: number) => CALLOUT_START + i * CALLOUT_STEP;

  return (
    <AbsoluteFill style={{ opacity }}>
      {/* Ventana */}
      <div
        style={{
          position: "absolute",
          left,
          top,
          width,
          height,
          borderRadius: RADIUS,
          backgroundColor: COLORS.lightGray,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 48,
            top: 34,
            right: 48,
            fontFamily: MONO,
            fontSize: 30,
            lineHeight: "44px",
            color: COLORS.dark,
            paddingBottom: 20,
            borderBottom: `${LINE}px solid ${COLORS.midGray}`,
            opacity: contentIn,
            whiteSpace: "nowrap",
          }}
        >
          {texts.s3.file}
        </div>

        {/* Bandas de resalte de cada sección */}
        {SECTIONS.map((sec, i) => {
          const start = calloutStart(i);
          const on =
            ease(frame, [start, start + 10], [0, 1]) *
            (1 - ease(frame, [start + CALLOUT_STEP, start + CALLOUT_STEP + 10], [0, 1]) * (i < 4 ? 1 : 0));
          const [a, b] = sec.lines;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 24,
                right: 24,
                top: CODE_TOP + a * LINE_H,
                height: (b - a + 1) * LINE_H,
                borderRadius: 8,
                backgroundColor: hexA(sec.color, 0.13),
                opacity: on,
              }}
            />
          );
        })}

        {/* Código */}
        {code.map((line, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 0,
              top: CODE_TOP + i * LINE_H,
              height: LINE_H,
              display: "flex",
              alignItems: "center",
              fontFamily: MONO,
              fontSize: 28,
              whiteSpace: "pre",
              opacity: contentIn,
            }}
          >
            <span
              style={{
                width: CODE_LEFT - 40,
                textAlign: "right",
                color: COLORS.midGray,
                fontSize: 22,
              }}
            >
              {i + 1}
            </span>
            <span style={{ marginLeft: 28, position: "relative" }}>
              {renderLine(line, shownPerLine[i])}
              {typing && cursorLine === i && cursorOn ? (
                <span
                  style={{
                    position: "absolute",
                    left: cursorCol * 16.8 + 2,
                    top: 5,
                    width: 12,
                    height: 28,
                    backgroundColor: COLORS.orange,
                  }}
                />
              ) : null}
            </span>
          </div>
        ))}
      </div>

      {/* Tarjeta de la escena anterior que se desvanece mientras se expande */}
      <div
        style={{
          position: "absolute",
          left: CX - CARD_W / 2,
          top: CY - CARD_H / 2,
          opacity: cardOpacity,
          transform: "scale(1.05)",
        }}
      >
        <SkillCard
          file={texts.s3.file}
          rows={texts.s3.rows}
          rowsProgress={[1, 1, 1, 1]}
          outlineProgress={1}
          glow={0}
        />
      </div>

      {/* Anotaciones: línea que se dibuja, punto viajero y etiqueta */}
      {SECTIONS.map((sec, i) => {
        const start = calloutStart(i);
        const path = connectorPath(i);
        const draw = ease(frame, [start, start + 16], [0, 1]);
        const pillIn = ease(frame, [start + 8, start + 26], [0, 1]);
        const len = getLength(path);
        const dot = getPointAtLength(path, len * draw) ?? { x: 0, y: 0 };
        const dotOpacity = draw > 0 && draw < 1 ? 1 : 0;
        const callout = texts.s4.callouts[i];
        return (
          <React.Fragment key={i}>
            <svg
              width={1920}
              height={1080}
              style={{ position: "absolute", left: 0, top: 0 }}
            >
              <path
                d={path}
                fill="none"
                stroke={sec.color}
                strokeWidth={LINE}
                strokeLinecap="round"
                {...evolvePath(draw, path)}
              />
              <circle
                cx={dot.x}
                cy={dot.y}
                r={7}
                fill={sec.color}
                opacity={dotOpacity}
              />
            </svg>
            <div
              style={{
                position: "absolute",
                left: PILL_X,
                top: PILL_CY[i] - PILL_H / 2,
                width: PILL_W,
                height: PILL_H,
                boxSizing: "border-box",
                padding: "0 28px",
                borderRadius: RADIUS,
                backgroundColor: COLORS.lightGray,
                display: "flex",
                alignItems: "center",
                gap: 20,
                opacity: pillIn,
                transform: `translateX(${(1 - pillIn) * 40}px)`,
              }}
            >
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 9,
                  backgroundColor: sec.color,
                  flexShrink: 0,
                }}
              />
              <div>
                <div
                  style={{
                    fontFamily: POPPINS,
                    fontWeight: 600,
                    fontSize: 32,
                    lineHeight: "40px",
                    color: COLORS.dark,
                    whiteSpace: "nowrap",
                  }}
                >
                  {callout.label}
                </div>
                <div
                  style={{
                    fontFamily: LORA,
                    fontSize: 26,
                    lineHeight: "34px",
                    color: COLORS.midGray,
                    whiteSpace: "nowrap",
                  }}
                >
                  {callout.sub}
                </div>
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

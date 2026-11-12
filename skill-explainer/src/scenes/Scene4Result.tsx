import React from "react";
import { AbsoluteFill } from "remotion";
import { Bubble } from "../components/Bubble";
import { CARD_H, CARD_W, SkillCard } from "../components/SkillCard";
import {
  COLORS,
  CX,
  CY,
  ease,
  LINE,
  LORA,
  POPPINS,
  RADIUS,
  useScene,
} from "../theme";
import type { SceneProps } from "./types";

// Posición final de la tarjeta (encogida, a la izquierda).
const CARD_END_X = 470;
const CARD_END_Y = 360;
const CARD_END_SCALE = 0.64;

// Tabla a la derecha.
const TABLE_LEFT = 870;
const TABLE_W = 860;
const TABLE_TOP = 214;
const ROW_H = 72;
const COLS = [220, 460, 180];

export const Scene4Result: React.FC<SceneProps> = ({
  texts,
  lead,
  durationInFrames,
}) => {
  // Última escena: sin fade out, el cierre se queda en pantalla.
  const { frame, opacity } = useScene(lead, durationInFrames, false);
  const t = texts.s4;

  // Burbuja "Clase de fracciones": vuela en arco desde la izquierda hasta la tarjeta.
  const fly = ease(frame, [0, 40], [0, 1]);
  const bubbleX = 160 + (CX - 160) * fly;
  const bubbleY = 820 + (CY - 820) * fly - 190 * Math.sin(Math.PI * fly);
  const bubbleOpacity =
    ease(frame, [0, 8], [0, 1]) * (1 - ease(frame, [34, 44], [0, 1]));
  const bubbleScale = 1 - 0.35 * fly;

  // Brillo: sube cuando llega la burbuja y se queda como halo suave.
  const glowIn = ease(frame, [36, 52], [0, 1]);
  const glowOut = ease(frame, [60, 100], [0, 0.55]);
  const glow = glowIn - glowOut;

  // La tarjeta se encoge hacia la izquierda.
  const shrink = ease(frame, [46, 86], [0, 1]);
  const cardX = (CARD_END_X - CX) * shrink;
  const cardY = (CARD_END_Y - CY) * shrink;
  const cardScale = 1.05 + (CARD_END_SCALE - 1.05) * shrink;

  // Tabla: encabezado + 3 filas, una cada 8 frames.
  const rowProgress = (i: number) => {
    const start = 64 + i * 8;
    return ease(frame, [start, start + 16], [0, 1]);
  };

  // Frame global 540 = frame 90 de la escena (450 + 90).
  const titleP = ease(frame, [90, 116], [0, 1]);
  const subtitleP = ease(frame, [104, 130], [0, 1]);

  const cell = (
    text: string,
    width: number,
    style: React.CSSProperties,
  ): React.ReactNode => (
    <div
      style={{
        width,
        boxSizing: "border-box",
        padding: "0 28px",
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {text}
    </div>
  );

  const rowBase = (i: number): React.CSSProperties => ({
    height: ROW_H,
    display: "flex",
    alignItems: "center",
    opacity: rowProgress(i),
    transform: `translateX(${(1 - rowProgress(i)) * 36}px)`,
  });

  return (
    <AbsoluteFill style={{ opacity }}>
      {/* Tarjeta SKILL.md (continúa desde la escena 3) */}
      <div
        style={{
          position: "absolute",
          left: CX - CARD_W / 2,
          top: CY - CARD_H / 2,
          transform: `translate(${cardX}px, ${cardY}px) scale(${cardScale})`,
        }}
      >
        <SkillCard
          file={texts.s3.file}
          rows={texts.s3.rows}
          rowsProgress={[1, 1, 1, 1]}
          outlineProgress={1}
          glow={glow}
        />
      </div>

      {/* Tabla del plan de clase */}
      <div
        style={{
          position: "absolute",
          left: TABLE_LEFT,
          top: TABLE_TOP,
          width: TABLE_W,
          boxSizing: "border-box",
          border: `${LINE}px solid ${COLORS.lightGray}`,
          borderRadius: RADIUS,
          overflow: "hidden",
          opacity: rowProgress(0),
        }}
      >
        <div
          style={{
            ...rowBase(0),
            backgroundColor: COLORS.lightGray,
            fontFamily: POPPINS,
            fontWeight: 600,
            fontSize: 28,
            color: COLORS.dark,
          }}
        >
          {t.tableHeaders.map((h, c) => (
            <React.Fragment key={h}>{cell(h, COLS[c], {})}</React.Fragment>
          ))}
        </div>
        {t.tableRows.map((row, r) => (
          <div
            key={row[0]}
            style={{
              ...rowBase(r + 1),
              borderTop: `${LINE}px solid ${COLORS.lightGray}`,
              fontFamily: LORA,
              fontWeight: 400,
              fontSize: 30,
              color: COLORS.dark,
            }}
          >
            {row.map((value, c) => (
              <React.Fragment key={c}>
                {cell(
                  value,
                  COLS[c],
                  c === 0
                    ? { fontFamily: POPPINS, fontWeight: 600, fontSize: 28 }
                    : c === 2
                      ? { color: COLORS.orange }
                      : {},
                )}
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>

      {/* Burbuja que vuela hacia la tarjeta */}
      <div
        style={{
          position: "absolute",
          left: bubbleX,
          top: bubbleY,
          opacity: bubbleOpacity,
          transform: `translate(-50%, -50%) scale(${bubbleScale})`,
        }}
      >
        <Bubble
          text={t.bubble}
          style={{ width: 460, height: 92, backgroundColor: COLORS.lightGray }}
        />
      </div>

      {/* Título final */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 650,
          textAlign: "center",
          fontFamily: POPPINS,
          fontWeight: 600,
          fontSize: 80,
          lineHeight: "100px",
          color: COLORS.dark,
          whiteSpace: "nowrap",
          opacity: titleP,
          transform: `translateY(${(1 - titleP) * 50}px)`,
        }}
      >
        {t.titleA} <span style={{ color: COLORS.orange }}>{t.titleB}</span>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 786,
          textAlign: "center",
          fontFamily: LORA,
          fontWeight: 400,
          fontSize: 32,
          color: COLORS.midGray,
          opacity: subtitleP,
          transform: `translateY(${(1 - subtitleP) * 30}px)`,
        }}
      >
        {t.subtitle}
      </div>
    </AbsoluteFill>
  );
};

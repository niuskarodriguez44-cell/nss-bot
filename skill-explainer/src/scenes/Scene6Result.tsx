import React from "react";
import { AbsoluteFill, spring, useVideoConfig } from "remotion";
import { Bubble } from "../components/Bubble";
import { MaskSwap } from "../components/MaskSwap";
import { SkillCard, CARD_H, CARD_W } from "../components/SkillCard";
import { COLORS, CX, CY, ease, LINE, LORA, POPPINS, RADIUS, useScene } from "../theme";
import type { SceneProps } from "./types";

const CARD_END = { x: 470, y: 360, scale: 0.64 };
const TABLE_LEFT = 870;
const TABLE_W = 860;
const TABLE_TOP = 214;
const ROW_H = 72;
const COLS = [220, 460, 180];

// Frames nominales (también los usa Soundtrack.tsx).
export const RESULT = {
  cardIn: 0,
  // Vuelos de burbujas: inicio, duración, punto de partida, destino
  flights: [
    { s: 14, d: 40, from: { x: 160, y: 820 }, to: { x: CX, y: CY } },
    { s: 126, d: 30, from: { x: 140, y: 880 }, to: { x: CARD_END.x, y: CARD_END.y } },
    { s: 176, d: 30, from: { x: 140, y: 880 }, to: { x: CARD_END.x, y: CARD_END.y } },
  ],
  shrink: 60,
  tableStart: 78,
  swaps: [156, 206],
  title: 214,
  subtitle: 228,
};

export const Scene6Result: React.FC<SceneProps> = ({ texts, lead, durationInFrames }) => {
  // Última escena: sin fade out; el cierre se queda en pantalla.
  const { frame, opacity } = useScene(lead, durationInFrames, false);
  const { fps } = useVideoConfig();
  const t = texts.s6;

  // Entrada de la tarjeta (sin rebote).
  const cardS = spring({ frame: frame - RESULT.cardIn, fps, config: { damping: 200 } });

  // Brillos: uno por cada burbuja que llega a la tarjeta.
  const glow = Math.max(
    ...RESULT.flights.map((fl) => {
      const s = fl.s + fl.d - 4;
      return (
        ease(frame, [s, s + 10], [0, 1]) *
        (1 - 0.75 * ease(frame, [s + 10, s + 46], [0, 1]))
      );
    }),
  );

  // La tarjeta se encoge hacia la izquierda y arriba.
  const shrink = ease(frame, [RESULT.shrink, RESULT.shrink + 40], [0, 1]);
  const cardX = (CARD_END.x - CX) * shrink;
  const cardY = (CARD_END.y - CY) * shrink;
  const cardScale = 1 + (CARD_END.scale - 1) * shrink;

  const rowProgress = (r: number) => {
    const start = RESULT.tableStart + r * 8;
    return ease(frame, [start, start + 16], [0, 1]);
  };

  // Posición continua del tema mostrado (0, 1, 2) por fila, con retardo escalonado.
  const topicPos = (r: number) =>
    RESULT.swaps.reduce(
      (acc, s) => acc + ease(frame, [s + r * 5, s + r * 5 + 16], [0, 1]),
      0,
    );
  const labelPos = RESULT.swaps.reduce(
    (acc, s) => acc + ease(frame, [s - 4, s + 12], [0, 1]),
    0,
  );

  const titleP = ease(frame, [RESULT.title, RESULT.title + 26], [0, 1]);
  const subtitleP = ease(frame, [RESULT.subtitle, RESULT.subtitle + 26], [0, 1]);

  const rowStyle = (r: number): React.CSSProperties => ({
    height: ROW_H,
    display: "flex",
    alignItems: "center",
    opacity: rowProgress(r),
    transform: `translateX(${(1 - rowProgress(r)) * 36}px)`,
  });

  const cellBase: React.CSSProperties = {
    boxSizing: "border-box",
    padding: "0 28px",
    whiteSpace: "nowrap",
  };

  return (
    <AbsoluteFill style={{ opacity }}>
      {/* Tarjeta SKILL.md */}
      <div
        style={{
          position: "absolute",
          left: CX - CARD_W / 2,
          top: CY - CARD_H / 2,
          opacity: cardS,
          transform: `translate(${cardX}px, ${cardY}px) scale(${cardScale * (0.9 + 0.1 * cardS)})`,
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

      {/* Etiqueta del tema actual */}
      <div
        style={{
          position: "absolute",
          left: TABLE_LEFT,
          top: TABLE_TOP - 58,
          width: TABLE_W,
          opacity: rowProgress(0),
        }}
      >
        <MaskSwap
          items={t.topics.map((tp) => (
            <span
              key={tp.name}
              style={{ fontFamily: LORA, fontStyle: "italic", fontSize: 32, color: COLORS.midGray }}
            >
              {tp.name}
            </span>
          ))}
          pos={labelPos}
          height={48}
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
            ...rowStyle(0),
            backgroundColor: COLORS.lightGray,
            fontFamily: POPPINS,
            fontWeight: 600,
            fontSize: 28,
            color: COLORS.dark,
          }}
        >
          {t.tableHeaders.map((h, c) => (
            <div key={h} style={{ ...cellBase, width: COLS[c] }}>
              {h}
            </div>
          ))}
        </div>
        {[0, 1, 2].map((r) => (
          <div
            key={r}
            style={{
              ...rowStyle(r + 1),
              borderTop: `${LINE}px solid ${COLORS.lightGray}`,
              fontFamily: LORA,
              fontSize: 30,
              color: COLORS.dark,
            }}
          >
            <div
              style={{
                ...cellBase,
                width: COLS[0],
                fontFamily: POPPINS,
                fontWeight: 600,
                fontSize: 28,
              }}
            >
              {t.topics[0].rows[r][0]}
            </div>
            <div style={{ width: COLS[1] }}>
              <MaskSwap
                items={t.topics.map((tp) => (
                  <span style={{ ...cellBase }}>{tp.rows[r][1]}</span>
                ))}
                pos={topicPos(r)}
                height={ROW_H - 4}
              />
            </div>
            <div style={{ width: COLS[2], color: COLORS.orange }}>
              <MaskSwap
                items={t.topics.map((tp) => (
                  <span style={{ ...cellBase }}>{tp.rows[r][2]}</span>
                ))}
                pos={topicPos(r)}
                height={ROW_H - 4}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Burbujas que vuelan hacia la tarjeta */}
      {RESULT.flights.map((fl, i) => {
        const p = ease(frame, [fl.s, fl.s + fl.d], [0, 1]);
        const x = fl.from.x + (fl.to.x - fl.from.x) * p;
        const y = fl.from.y + (fl.to.y - fl.from.y) * p - 190 * Math.sin(Math.PI * p);
        const o =
          ease(frame, [fl.s, fl.s + 8], [0, 1]) *
          (1 - ease(frame, [fl.s + fl.d - 6, fl.s + fl.d + 4], [0, 1]));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              opacity: o,
              transform: `translate(-50%, -50%) scale(${1 - 0.35 * p})`,
            }}
          >
            <Bubble
              text={t.topics[i].name}
              fontSize={30}
              style={{
                width: 520,
                height: 92,
                backgroundColor: COLORS.bg,
                border: `${LINE}px solid ${COLORS.orange}`,
              }}
            />
          </div>
        );
      })}

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

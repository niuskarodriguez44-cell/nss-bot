import React from "react";
import { P, SANS, hexA, lin } from "./theme";
import { Icon, Pill, Tabs, cardStyle } from "./ui";

/** Geometría de la ventana del asistente (coordenadas del mundo, 1920x1080). */
export const WIN = { x: 90, y: 100, w: 1740, h: 880 };
export const CHAT = { x: 90, y: 190, w: 600, h: 640 };
export const INPUT = { x: 120, y: 850, w: 540, h: 100 };
export const SEND = { x: 600, y: 870, r: 30 };
export const GX0 = 770;
export const WEEK_W = 26;
export const ROW_Y0 = 340;
export const ROW_STEP = 100;
export const BAR_H = 64;
export const PROPOSAL = { left: 30, top: 640, w: 540, h: 250 };
export const PROMPT_SCROLL = 300;

export type Unit = { name: string; weeks: number; color: string };

export type PlannerState = {
  intro: number;
  typed: string;
  caret: boolean;
  sent: number;
  steps: number[];
  stepsDone: number[];
  finalMsg: number;
  bars: number[];
  evals: number[];
  ins: number;
  compress: number;
  quizMark: number;
  chatScroll: number;
  proposal: number;
  hoverAccept: number;
  hoverDecline: number;
  accepted: number;
  bell: number;
  sendHover: number;
  frame: number;
};

export const PLANNER_INIT: PlannerState = {
  intro: 1,
  typed: "",
  caret: false,
  sent: 0,
  steps: [0, 0, 0, 0],
  stepsDone: [0, 0, 0, 0],
  finalMsg: 0,
  bars: [0, 0, 0, 0],
  evals: [0, 0, 0, 0],
  ins: 0,
  compress: 0,
  quizMark: 0,
  chatScroll: 0,
  proposal: 0,
  hoverAccept: 0,
  hoverDecline: 0,
  accepted: 0,
  bell: 0,
  sendHover: 0,
  frame: 0,
};

type Props = {
  state: PlannerState;
  prompt: string;
  placeholder: string;
  chatTitle: string;
  steps: string[];
  finalText: string;
  units: Unit[];
  months: string[];
  emptyCanvas: string;
  tabs: string[];
  refuerzoLabel: string;
  endLabel: string;
  quizLabel: string;
  proposalTitle: string;
  proposalBody: string;
  accept: string;
  decline: string;
  addedText: string;
};

export const Planner: React.FC<Props> = (p) => {
  const s = p.state;
  const k = 1 - 0.054 * s.compress;
  const wk = WEEK_W * k;
  const totalWeeks = p.units.reduce((a, u) => a + u.weeks, 0);
  const xOf = (week: number) => GX0 + week * wk;
  const anyBars = Math.max(...s.bars);
  const rowY = (row: number) => ROW_Y0 + row * ROW_STEP;

  // Las unidades siguientes se desplazan al insertar la semana de refuerzo.
  let acc = 0;
  const layout = p.units.map((u, j) => {
    const start = acc + (j >= 1 ? s.ins : 0);
    acc += u.weeks;
    return { u, start, row: j === 0 ? 0 : j + s.ins };
  });
  const endWeek = totalWeeks + s.ins;
  const endX = xOf(endWeek);
  const endNumber = Math.round(endWeek * k);
  const bellShake = s.bell > 0 && s.bell < 1 ? Math.sin(s.frame * 1.1) * 14 * (1 - s.bell) : 0;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: s.intro,
        transform: `translateY(${(1 - s.intro) * 50}px)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: WIN.x,
          top: WIN.y,
          width: WIN.w,
          height: WIN.h,
          ...cardStyle({ borderRadius: 32 }),
        }}
      />
      <div
        style={{
          position: "absolute",
          left: CHAT.x + CHAT.w,
          top: WIN.y + 2,
          width: 2,
          height: WIN.h - 4,
          backgroundColor: P.line,
        }}
      />

      {/* Cabecera del chat */}
      <div
        style={{
          position: "absolute",
          left: 130,
          top: 128,
          display: "flex",
          alignItems: "center",
          gap: 14,
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 30,
          color: P.dark,
        }}
      >
        <Icon name="spark" size={34} color={P.orange} />
        {p.chatTitle}
      </div>
      <div style={{ position: "absolute", left: 90, top: 184, width: 600, height: 2, backgroundColor: P.line }} />

      {/* Conversación */}
      <div
        style={{
          position: "absolute",
          left: CHAT.x,
          top: CHAT.y,
          width: CHAT.w,
          height: CHAT.h,
          overflow: "hidden",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0px, black 46px, black calc(100% - 20px), transparent 100%)",
        }}
      >
        <div style={{ position: "absolute", inset: 0, transform: `translateY(${-s.chatScroll}px)` }}>
          {/* Mensaje del docente */}
          <div
            style={{
              position: "absolute",
              left: 130,
              top: 24,
              width: 440,
              boxSizing: "border-box",
              padding: "20px 24px",
              borderRadius: 24,
              backgroundColor: P.peachLight,
              fontFamily: SANS,
              fontSize: 26,
              lineHeight: "36px",
              color: P.dark,
              opacity: s.sent,
              transform: `translateY(${(1 - s.sent) * 40}px)`,
            }}
          >
            {p.prompt}
          </div>

          {/* Pasos del agente */}
          <div
            style={{
              position: "absolute",
              left: 30,
              top: 196,
              width: 540,
              ...cardStyle({ borderRadius: 22, boxShadow: "none" }),
              padding: "18px 24px",
              boxSizing: "border-box",
              opacity: s.steps[0],
            }}
          >
            {p.steps.map((label, i) => {
              const done = s.stepsDone[i];
              return (
                <div
                  key={label}
                  style={{
                    height: 56,
                    display: "flex",
                    alignItems: "center",
                    gap: 18,
                    fontFamily: SANS,
                    fontSize: 26,
                    color: done > 0.5 ? P.dark : P.mid,
                    opacity: s.steps[i],
                    transform: `translateX(${(1 - s.steps[i]) * 24}px)`,
                  }}
                >
                  <div style={{ position: "relative", width: 32, height: 32 }}>
                    <svg
                      width={32}
                      height={32}
                      viewBox="0 0 32 32"
                      style={{
                        position: "absolute",
                        opacity: 1 - done,
                        transform: `rotate(${s.frame * 14}deg)`,
                      }}
                    >
                      <circle cx={16} cy={16} r={11} fill="none" stroke={P.line} strokeWidth={4} />
                      <path d="M16 5 a11 11 0 0 1 11 11" fill="none" stroke={P.orange} strokeWidth={4} strokeLinecap="round" />
                    </svg>
                    <div style={{ position: "absolute", opacity: done, transform: `scale(${0.6 + 0.4 * done})` }}>
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 16,
                          backgroundColor: P.green,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Icon name="check" size={20} color="#fff" width={3} />
                      </div>
                    </div>
                  </div>
                  {label}
                </div>
              );
            })}
          </div>

          {/* Mensaje final */}
          <div
            style={{
              position: "absolute",
              left: 30,
              top: 470,
              width: 540,
              fontFamily: SANS,
              fontSize: 26,
              lineHeight: "36px",
              color: P.dark,
              opacity: s.finalMsg,
              transform: `translateY(${(1 - s.finalMsg) * 24}px)`,
            }}
          >
            {p.finalText}
          </div>

          {/* Propuesta del agente */}
          <div
            style={{
              position: "absolute",
              left: PROPOSAL.left,
              top: PROPOSAL.top,
              width: PROPOSAL.w,
              height: PROPOSAL.h,
              boxSizing: "border-box",
              padding: "22px 26px",
              ...cardStyle({ borderRadius: 24, border: `2px solid ${hexA(P.orange, 0.55)}` }),
              opacity: s.proposal,
              transform: `translateY(${(1 - s.proposal) * 40}px)`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: SANS, fontWeight: 600, fontSize: 26, color: P.dark }}>
              <Icon name="chart" size={30} color={P.orange} />
              {p.proposalTitle}
            </div>
            <div style={{ marginTop: 10, fontFamily: SANS, fontSize: 25, lineHeight: "34px", color: P.mid, opacity: 1 - s.accepted }}>
              {p.proposalBody}
            </div>
            <div style={{ position: "absolute", left: 26, top: 168, display: "flex", gap: 16, opacity: 1 - s.accepted }}>
              <Pill label={p.accept} filled hover={s.hoverAccept} size={24} />
              <Pill label={p.decline} hover={s.hoverDecline} color={P.dark} size={24} />
            </div>
            <div
              style={{
                position: "absolute",
                left: 26,
                top: 108,
                display: "flex",
                alignItems: "center",
                gap: 12,
                fontFamily: SANS,
                fontWeight: 500,
                fontSize: 26,
                color: P.green,
                opacity: s.accepted,
              }}
            >
              <Icon name="check" size={28} color={P.green} width={3} />
              {p.addedText}
            </div>
          </div>
        </div>
      </div>

      {/* Campo de texto */}
      <div
        style={{
          position: "absolute",
          left: INPUT.x,
          top: INPUT.y,
          width: INPUT.w,
          height: INPUT.h,
          boxSizing: "border-box",
          padding: "14px 96px 14px 28px",
          borderRadius: 30,
          backgroundColor: "#fff",
          border: `2px solid ${s.caret ? P.orange : P.line}`,
          fontFamily: SANS,
          fontSize: 24,
          lineHeight: "34px",
          color: P.dark,
          overflow: "hidden",
        }}
      >
        {s.typed.length === 0 && s.sent < 0.5 ? (
          <span style={{ color: P.soft }}>{p.placeholder}</span>
        ) : (
          s.typed
        )}
        {s.caret ? (
          <span style={{ display: "inline-block", width: 3, height: 28, marginLeft: 2, verticalAlign: "middle", backgroundColor: P.orange }} />
        ) : null}
      </div>
      <div
        style={{
          position: "absolute",
          left: SEND.x,
          top: SEND.y,
          width: SEND.r * 2,
          height: SEND.r * 2,
          borderRadius: SEND.r,
          backgroundColor: s.typed.length > 0 ? P.orange : P.line,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${1 + 0.08 * s.sendHover})`,
        }}
      >
        <Icon name="send" size={30} color="#fff" width={3} />
      </div>

      {/* Lienzo: cabecera */}
      <div style={{ position: "absolute", left: 730, top: 124 }}>
        <Tabs options={p.tabs} pos={0} w={440} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 1722,
          top: 124,
          width: 62,
          height: 62,
          borderRadius: 31,
          border: `2px solid ${P.line}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `rotate(${bellShake}deg)`,
        }}
      >
        <Icon name="bell" size={30} color={P.dark} />
        <div
          style={{
            position: "absolute",
            right: 8,
            top: 8,
            width: 16,
            height: 16,
            borderRadius: 8,
            backgroundColor: P.orange,
            transform: `scale(${Math.min(1, s.quizMark * 2)})`,
          }}
        />
      </div>

      {/* Lienzo: meses y cuadrícula */}
      {p.months.map((m, i) => {
        const a = lin(anyBars, [0, 0.4], [0, 1]);
        return (
          <React.Fragment key={m}>
            <div
              style={{
                position: "absolute",
                left: xOf(i * 4) + 4,
                top: 236,
                fontFamily: SANS,
                fontWeight: 500,
                fontSize: 22,
                color: P.mid,
                opacity: a,
              }}
            >
              {m}
            </div>
            <div
              style={{
                position: "absolute",
                left: xOf(i * 4),
                top: 276,
                width: 2,
                height: 560,
                backgroundColor: P.line,
                opacity: a,
              }}
            />
          </React.Fragment>
        );
      })}

      {anyBars < 0.02 ? (
        <div
          style={{
            position: "absolute",
            left: 730,
            top: 520,
            width: 1040,
            textAlign: "center",
            fontFamily: SANS,
            fontSize: 28,
            color: P.soft,
          }}
        >
          {p.emptyCanvas}
        </div>
      ) : null}

      {/* Barras de las unidades */}
      {layout.map(({ u, start, row }, j) => {
        const full = u.weeks * wk - 6;
        return (
          <React.Fragment key={u.name}>
            <div
              style={{
                position: "absolute",
                left: xOf(start),
                top: rowY(row),
                width: Math.max(0, full * s.bars[j]),
                height: BAR_H,
                borderRadius: BAR_H / 2,
                backgroundColor: u.color,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: full,
                  height: BAR_H,
                  boxSizing: "border-box",
                  paddingLeft: 22,
                  display: "flex",
                  alignItems: "center",
                  fontFamily: SANS,
                  fontWeight: 500,
                  fontSize: 24,
                  color: "#fff",
                  whiteSpace: "nowrap",
                }}
              >
                {u.name}
              </div>
            </div>
            <div
              style={{
                position: "absolute",
                left: xOf(start) + full - 14,
                top: rowY(row) + BAR_H / 2 - 14,
                width: 28,
                height: 28,
                backgroundColor: P.paper,
                border: `4px solid ${P.dark}`,
                boxSizing: "border-box",
                transform: `rotate(45deg) scale(${s.evals[j]})`,
              }}
            />
          </React.Fragment>
        );
      })}

      {/* Semana de refuerzo */}
      {s.ins > 0 ? (
        <>
          <div
            style={{
              position: "absolute",
              left: xOf(p.units[0].weeks),
              top: rowY(1),
              width: Math.max(0, s.ins * wk - 6),
              height: BAR_H,
              borderRadius: BAR_H / 2,
              backgroundColor: hexA(P.orange, 0.25),
              border: `3px dashed ${P.orange}`,
              boxSizing: "border-box",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: xOf(p.units[0].weeks) + wk + 12,
              top: rowY(1) + 18,
              fontFamily: SANS,
              fontWeight: 500,
              fontSize: 24,
              color: P.orange,
              whiteSpace: "nowrap",
              opacity: s.ins,
            }}
          >
            {p.refuerzoLabel}
          </div>
        </>
      ) : null}

      {/* Marca del quiz (semana 8) */}
      <div
        style={{
          position: "absolute",
          left: xOf(8.5),
          top: 276,
          width: 3,
          height: 560 * s.quizMark,
          backgroundColor: P.orange,
          opacity: 0.8,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: xOf(8.5) - 80,
          top: 836,
          width: 160,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 22,
          color: P.orange,
          opacity: s.quizMark,
        }}
      >
        {p.quizLabel}
      </div>

      {/* Fin del curso */}
      <div
        style={{
          position: "absolute",
          left: endX,
          top: 232,
          height: 604,
          borderLeft: `3px dashed ${P.dark}`,
          opacity: anyBars > 0.9 ? 0.55 : 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: endX - 70,
          top: 196,
          width: 140,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 22,
          color: P.dark,
          opacity: anyBars > 0.9 ? 1 : 0,
          whiteSpace: "nowrap",
        }}
      >
        {p.endLabel.replace("{n}", String(endNumber))}
      </div>
    </div>
  );
};

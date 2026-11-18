import React from "react";
import {
  AbsoluteFill,
  Img,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { cameraStyle } from "../agent/camera";
import { Cursor } from "../agent/Cursor";
import { B, CAPTIONS, INTER } from "./brand";
import { MascotSvg, blinkAt, Mascot } from "./Characters";
import {
  BrowserFrame,
  Caption,
  Chip,
  K,
  Ring,
  S,
  StageBg,
  easeOut,
  lerp,
} from "./ui";

type P = { dur: number };
const at = (dur: number, x: number) => Math.round(dur * x);
const pt = (px: number, py: number) => S(px, py);

// ------------------------------------------------------------ 1 · Presentación
const CAST: {
  kind: Mascot;
  x: number;
  y: number;
  size: number;
  delay: number;
}[] = [
  { kind: "cubi", x: 1180, y: 610, size: 430, delay: 18 },
  { kind: "chispa", x: 900, y: 760, size: 250, delay: 26 },
  { kind: "pulso", x: 1470, y: 720, size: 250, delay: 30 },
  { kind: "byte", x: 1000, y: 900, size: 230, delay: 34 },
  { kind: "lupa", x: 1220, y: 950, size: 220, delay: 38 },
  { kind: "nexo", x: 1430, y: 920, size: 220, delay: 42 },
];

const Cast: React.FC<{
  frame: number;
  fps: number;
  scale?: number;
  dx?: number;
  dy?: number;
}> = ({ frame, fps, scale = 1, dx = 0, dy = 0 }) => (
  <>
    {CAST.map((m, i) => {
      const s = spring({
        frame: frame - m.delay,
        fps,
        config: { damping: 11, stiffness: 120 },
      });
      const bob = Math.sin((frame + i * 13) / 18) * 6;
      const size = m.size * scale;
      return (
        <div
          key={m.kind}
          style={{
            position: "absolute",
            left: dx + m.x * scale - size / 2,
            top: dy + m.y * scale - size / 2 + bob + (1 - s) * 260,
            opacity: Math.min(1, s * 1.5),
            transform: `scale(${0.6 + 0.4 * s})`,
          }}
        >
          <MascotSvg
            kind={m.kind}
            size={size}
            blink={blinkAt(frame, i)}
            look={Math.sin(frame / 40 + i)}
          />
        </div>
      );
    })}
  </>
);

export const C1Intro: React.FC<P> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const title = ["Presentamos", "CubanBot."];
  const cam = cameraStyle(frame, [
    { f: 0, x: 960, y: 560, s: 1.08 },
    { f: dur, x: 960, y: 540, s: 1.0 },
  ]);
  return (
    <AbsoluteFill style={{ backgroundColor: B.paper }}>
      <div style={cam}>
        <div style={{ position: "absolute", left: 120, top: 150 }}>
          {title.map((t, i) => {
            const p = easeOut(lerp(frame, 4 + i * 8, 26 + i * 8));
            return (
              <div key={t} style={{ overflow: "hidden", height: 170 }}>
                <div
                  style={{
                    fontFamily: INTER,
                    fontWeight: 800,
                    fontSize: 156,
                    letterSpacing: -6,
                    lineHeight: "170px",
                    color: B.ink,
                    transform: `translateY(${(1 - p) * 170}px)`,
                  }}
                >
                  {t}
                </div>
              </div>
            );
          })}
          <div
            style={{
              marginTop: 18,
              fontFamily: INTER,
              fontWeight: 500,
              fontSize: 48,
              letterSpacing: -1,
              color: B.ink,
              opacity: lerp(frame, 40, 58),
              transform: `translateY(${(1 - easeOut(lerp(frame, 40, 58))) * 20}px)`,
            }}
          >
            Agentes para trabajos de largo horizonte.
          </div>
        </div>
        <Cast frame={frame} fps={fps} scale={0.92} dx={260} dy={60} />
      </div>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ 2 · Equipo
const TEAM: { name: string; role: string; kind: Mascot; y: number }[] = [
  { name: "Cubi", role: "Coordinador", kind: "cubi", y: 160 },
  { name: "Pulso", role: "Comunicaciones", kind: "pulso", y: 257 },
  { name: "Nexo", role: "Automatización", kind: "nexo", y: 313 },
  { name: "Lupa", role: "Investigación", kind: "lupa", y: 369 },
  { name: "Byte", role: "Programación", kind: "byte", y: 425 },
  { name: "Chispa", role: "Creatividad", kind: "chispa", y: 481 },
];
const COLORS: Record<Mascot, string> = {
  cubi: B.teal,
  pulso: B.pink,
  nexo: B.yellow,
  lupa: B.purple,
  byte: B.blue,
  chispa: B.orange,
};

export const C2Team: React.FC<P> = ({ dur }) => {
  const frame = useCurrentFrame();
  // Tiempos de cada nombre dentro de la frase (proporcionales a la narración).
  const marks = [0.16, 0.28, 0.48, 0.6, 0.71, 0.84].map((x) => at(dur, x));
  const active = marks.reduce((acc, m, i) => (frame >= m ? i : acc), -1);
  const cam = cameraStyle(frame, [
    { f: 0, x: 960, y: 540, s: 1.0 },
    { f: at(dur, 0.12), x: pt(330, 320).x, y: pt(330, 320).y, s: 1.9 },
    { f: at(dur, 0.9), x: pt(330, 360).x, y: pt(330, 360).y, s: 1.95 },
    { f: dur, x: pt(420, 330).x, y: pt(420, 330).y, s: 1.7 },
  ]);
  const keys = [
    { f: 0, x: 1200, y: 700 },
    ...TEAM.map((t, i) => ({
      f: marks[i],
      x: pt(t.name === "Cubi" ? 150 : 110, t.y).x,
      y: pt(t.name === "Cubi" ? 150 : 110, t.y).y,
    })),
  ];
  return (
    <AbsoluteFill>
      <StageBg />
      <div style={cam}>
        <BrowserFrame src="01-cubi.png" />
        {TEAM.map((t, i) => {
          const p = easeOut(lerp(frame, marks[i], marks[i] + 10));
          const isCubi = t.name === "Cubi";
          return (
            <React.Fragment key={t.name}>
              <Ring
                x={isCubi ? 100 : 12}
                y={isCubi ? 122 : t.y - 26}
                w={isCubi ? 80 : 256}
                h={isCubi ? 92 : 52}
                p={i === active ? p : 0}
                color={COLORS[t.kind]}
              />
              <Chip
                x={isCubi ? 200 : 290}
                y={t.y}
                text={`${t.name} · ${t.role}`}
                color={COLORS[t.kind]}
                p={i <= active ? p : 0}
                size={22}
                icon={
                  <MascotSvg
                    kind={t.kind}
                    size={34}
                    blink={blinkAt(frame, i)}
                  />
                }
              />
            </React.Fragment>
          );
        })}
        <Cursor
          frame={frame}
          keys={keys}
          clicks={marks.slice(0, 1)}
          visibleFrom={6}
        />
      </div>
      <Caption text={CAPTIONS[1]} frame={frame} dur={dur} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ 3 · Perfil
export const C3Profile: React.FC<P> = ({ dur }) => {
  const frame = useCurrentFrame();
  const c1 = at(dur, 0.32);
  const c2 = at(dur, 0.52);
  const c3 = at(dur, 0.74);
  const cam = cameraStyle(frame, [
    { f: 0, x: pt(700, 300).x, y: pt(700, 300).y, s: 1.35 },
    { f: at(dur, 0.22), x: pt(1270, 330).x, y: pt(1270, 330).y, s: 2.0 },
    { f: at(dur, 0.6), x: pt(1270, 420).x, y: pt(1270, 420).y, s: 2.0 },
    { f: dur, x: pt(1260, 640).x, y: pt(1260, 640).y, s: 1.85 },
  ]);
  const keys = [
    { f: 0, x: pt(820, 500).x, y: pt(820, 500).y },
    { f: c1, x: pt(1330, 286).x, y: pt(1330, 286).y },
    { f: c2, x: pt(1365, 340).x, y: pt(1365, 340).y },
    { f: c3, x: pt(1222, 749).x, y: pt(1222, 749).y },
    { f: dur, x: pt(1240, 760).x, y: pt(1240, 760).y },
  ];
  const ring = (a: number) =>
    easeOut(lerp(frame, a, a + 8)) * (1 - lerp(frame, a + 40, a + 50));
  return (
    <AbsoluteFill>
      <StageBg />
      <div style={cam}>
        <BrowserFrame src="07-perfil.png" />
        <Ring x={1150} y={266} w={265} h={40} p={ring(c1)} />
        <Ring x={1150} y={320} w={265} h={40} p={ring(c2)} />
        <Ring x={1150} y={730} w={265} h={40} p={ring(c3)} color={B.pink} />
        <Chip
          x={1150}
          y={232}
          text="Elige el modelo"
          color={B.accent}
          p={ring(c1)}
          size={18}
        />
        <Chip
          x={1150}
          y={378}
          text="¿Cuánto razona?"
          color={B.accent}
          p={ring(c2)}
          size={18}
        />
        <Chip
          x={1150}
          y={800}
          text="Rutinas propias"
          color={B.pink}
          p={ring(c3)}
          size={18}
        />
        <Cursor
          frame={frame}
          keys={keys}
          clicks={[c1, c2, c3]}
          visibleFrom={0}
        />
      </div>
      <Caption text={CAPTIONS[2]} frame={frame} dur={dur} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ 4 · Mapa
export const C4Map: React.FC<P> = ({ dur }) => {
  const frame = useCurrentFrame();
  const typeStart = at(dur, 0.5);
  const msg = "@everyone preparen el resumen de la semana";
  const chars = Math.max(0, Math.floor((frame - typeStart) * 1.6));
  const cam = cameraStyle(frame, [
    { f: 0, x: pt(746, 462).x, y: pt(746, 462).y, s: 2.6 },
    { f: at(dur, 0.42), x: pt(860, 440).x, y: pt(860, 440).y, s: 1.05 },
    { f: dur, x: pt(860, 640).x, y: pt(860, 640).y, s: 1.45 },
  ]);
  const keys = [
    { f: 0, x: pt(760, 470).x, y: pt(760, 470).y },
    { f: at(dur, 0.45), x: pt(700, 856).x, y: pt(700, 856).y },
    { f: dur, x: pt(720, 860).x, y: pt(720, 860).y },
  ];
  // Pulsos que viajan de Cubi a cada bot.
  const bots = [201, 318, 436, 553, 671];
  const pulse = lerp(frame, at(dur, 0.2), at(dur, 0.5));
  return (
    <AbsoluteFill>
      <StageBg />
      <div style={cam}>
        <BrowserFrame src="10-mapa.png">
          <svg
            width={1440 * K}
            height={900 * K}
            style={{ position: "absolute", left: 0, top: 0 }}
          >
            {bots.map((by, i) => {
              const x0 = 845 * K;
              const y0 = 462 * K;
              const x1 = 878 * K;
              const y1 = (by + 10) * K;
              const t = Math.min(1, Math.max(0, pulse * 1.4 - i * 0.08));
              return (
                <g key={by}>
                  <path
                    d={`M ${x0} ${y0} C ${x0 + 20} ${y0}, ${x1 - 20} ${y1}, ${x1} ${y1}`}
                    stroke={B.teal}
                    strokeWidth={3}
                    fill="none"
                    opacity={0.5}
                  />
                  {t > 0 && t < 1 ? (
                    <circle
                      cx={x0 + (x1 - x0) * t}
                      cy={y0 + (y1 - y0) * t}
                      r={7}
                      fill={B.teal}
                    />
                  ) : null}
                </g>
              );
            })}
          </svg>
          {frame >= typeStart ? (
            <div
              style={{
                position: "absolute",
                left: 566 * K,
                top: 838 * K,
                width: 540 * K,
                height: 34 * K,
                backgroundColor: "#fff",
                fontFamily: INTER,
                fontSize: 15.5 * K,
                color: B.ink,
                display: "flex",
                alignItems: "center",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            >
              <span style={{ color: B.accent, fontWeight: 600 }}>
                {msg.slice(0, Math.min(chars, 9))}
              </span>
              {msg.slice(9, Math.max(9, chars))}
              <span
                style={{
                  width: 2,
                  height: 20,
                  backgroundColor: B.ink,
                  marginLeft: 2,
                  opacity: Math.floor(frame / 8) % 2,
                }}
              />
            </div>
          ) : null}
        </BrowserFrame>
        <Cursor
          frame={frame}
          keys={keys}
          clicks={[at(dur, 0.47)]}
          visibleFrom={at(dur, 0.25)}
        />
      </div>
      <Caption text={CAPTIONS[3]} frame={frame} dur={dur} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ 5 · Apps y MCP
const Connected: React.FC<{ x: number; y: number; p: number }> = ({
  x,
  y,
  p,
}) => {
  if (p <= 0) return null;
  const a = S(x, y);
  return (
    <div
      style={{
        position: "absolute",
        left: a.x - 10,
        top: a.y - 16,
        padding: "4px 12px",
        borderRadius: 999,
        backgroundColor: "#16a34a",
        color: "#fff",
        fontFamily: INTER,
        fontWeight: 600,
        fontSize: 15,
        transform: `scale(${0.6 + 0.4 * p})`,
        opacity: p,
      }}
    >
      ✓ Conectado
    </div>
  );
};

export const C5Apps: React.FC<P> = ({ dur }) => {
  const frame = useCurrentFrame();
  const c1 = at(dur, 0.22);
  const c2 = at(dur, 0.36);
  const c3 = at(dur, 0.5);
  const c4 = at(dur, 0.78);
  const cam = cameraStyle(frame, [
    { f: 0, x: pt(720, 450).x, y: pt(720, 450).y, s: 1.15 },
    { f: at(dur, 0.18), x: pt(700, 430).x, y: pt(700, 430).y, s: 1.9 },
    { f: at(dur, 0.5), x: pt(820, 560).x, y: pt(820, 560).y, s: 1.9 },
    { f: at(dur, 0.72), x: pt(960, 200).x, y: pt(960, 200).y, s: 2.2 },
    { f: dur, x: pt(940, 210).x, y: pt(940, 210).y, s: 2.3 },
  ]);
  const keys = [
    { f: 0, x: pt(900, 600).x, y: pt(900, 600).y },
    { f: c1, x: pt(1024, 758).x, y: pt(1024, 758).y },
    { f: c2, x: pt(655, 402).x, y: pt(655, 402).y },
    { f: c3, x: pt(655, 580).x, y: pt(655, 580).y },
    { f: c4, x: pt(1005, 183).x, y: pt(1005, 183).y },
    { f: dur, x: pt(1010, 186).x, y: pt(1010, 186).y },
  ];
  const pop = (a: number) => easeOut(lerp(frame, a + 2, a + 10));
  return (
    <AbsoluteFill>
      <StageBg />
      <div style={cam}>
        <BrowserFrame src="16-integraciones.png" />
        <Connected x={1000} y={758} p={pop(c1)} />
        <Connected x={630} y={402} p={pop(c2)} />
        <Connected x={630} y={580} p={pop(c3)} />
        <Ring
          x={932}
          y={166}
          w={148}
          h={34}
          p={pop(c4)}
          r={16}
          color={B.teal}
        />
        <Chip
          x={940}
          y={236}
          text="Tu propio servidor MCP"
          color={B.teal}
          p={pop(c4)}
          size={16}
        />
        <Cursor
          frame={frame}
          keys={keys}
          clicks={[c1, c2, c3, c4]}
          visibleFrom={0}
        />
      </div>
      <Caption text={CAPTIONS[4]} frame={frame} dur={dur} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ 6 · Automatizaciones
export const C6Auto: React.FC<P> = ({ dur }) => {
  const frame = useCurrentFrame();
  const click = at(dur, 0.25);
  const cardP = easeOut(lerp(frame, click + 4, click + 18));
  const cam = cameraStyle(frame, [
    { f: 0, x: pt(860, 300).x, y: pt(860, 300).y, s: 1.6 },
    { f: click, x: pt(860, 300).x, y: pt(860, 300).y, s: 1.75 },
    { f: dur, x: pt(860, 420).x, y: pt(860, 420).y, s: 1.45 },
  ]);
  const keys = [
    { f: 0, x: pt(1060, 480).x, y: pt(1060, 480).y },
    { f: click, x: pt(860, 317).x, y: pt(860, 317).y },
    { f: at(dur, 0.7), x: pt(1004, 560).x, y: pt(1004, 560).y },
    { f: dur, x: pt(1010, 566).x, y: pt(1010, 566).y },
  ];
  const toggle = lerp(frame, at(dur, 0.7) + 2, at(dur, 0.7) + 10);
  const card = S(600, 380);
  return (
    <AbsoluteFill>
      <StageBg />
      <div style={cam}>
        <BrowserFrame src="11-automatizaciones.png" />
        {cardP > 0 ? (
          <div
            style={{
              position: "absolute",
              left: card.x,
              top: card.y,
              width: 520 * K,
              padding: 26,
              borderRadius: 18,
              backgroundColor: "#fff",
              boxShadow: "0 30px 70px rgba(0,0,0,0.18)",
              border: `1px solid ${B.line}`,
              fontFamily: INTER,
              opacity: cardP,
              transform: `translateY(${(1 - cardP) * 30}px) scale(${0.94 + 0.06 * cardP})`,
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 22, color: B.ink }}>
              Nueva automatización
            </div>
            <div
              style={{
                marginTop: 14,
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <MascotSvg kind="pulso" size={36} />
              <div style={{ fontSize: 18, color: B.ink }}>
                Resume mi bandeja de entrada
              </div>
            </div>
            <div style={{ marginTop: 10, fontSize: 16, color: B.gray }}>
              Cada día · 8:00
            </div>
            <div
              style={{
                marginTop: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ fontSize: 16, fontWeight: 600, color: B.ink }}>
                Activa
              </div>
              <div
                style={{
                  width: 52,
                  height: 30,
                  borderRadius: 15,
                  backgroundColor: toggle > 0.5 ? B.accent : B.line,
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 3,
                    left: 3 + 22 * toggle,
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: "#fff",
                  }}
                />
              </div>
            </div>
          </div>
        ) : null}
        <Cursor
          frame={frame}
          keys={keys}
          clicks={[click, at(dur, 0.7)]}
          visibleFrom={0}
        />
      </div>
      <Caption text={CAPTIONS[5]} frame={frame} dur={dur} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ 7 · Feed + negocios (corte)
export const C7Feed: React.FC<P> = ({ dur }) => {
  const frame = useCurrentFrame();
  const cut = at(dur, 0.5);
  const first = frame < cut;
  const c1 = at(dur, 0.16);
  const c2 = at(dur, 0.3);
  const local = frame - cut;
  const cam = first
    ? cameraStyle(frame, [
        { f: 0, x: pt(860, 230).x, y: pt(860, 230).y, s: 1.5 },
        { f: cut, x: pt(700, 280).x, y: pt(700, 280).y, s: 2.0 },
      ])
    : cameraStyle(local, [
        { f: 0, x: pt(860, 200).x, y: pt(860, 200).y, s: 1.9 },
        { f: dur - cut, x: pt(860, 500).x, y: pt(860, 500).y, s: 1.55 },
      ]);
  const keys = [
    { f: 0, x: pt(820, 420).x, y: pt(820, 420).y },
    { f: c1, x: pt(506, 294).x, y: pt(506, 294).y },
    { f: c2, x: pt(594, 294).x, y: pt(594, 294).y },
    { f: cut, x: pt(720, 294).x, y: pt(720, 294).y },
  ];
  const chipOn = (a: number) => easeOut(lerp(frame, a + 2, a + 8));
  const ChipFill: React.FC<{
    x: number;
    w: number;
    label: string;
    p: number;
  }> = ({ x, w, label, p }) => {
    if (p <= 0) return null;
    const a = S(x, 280);
    return (
      <div
        style={{
          position: "absolute",
          left: a.x,
          top: a.y,
          width: w * K,
          height: 29 * K,
          borderRadius: 999,
          backgroundColor: B.accent,
          color: "#fff",
          fontFamily: INTER,
          fontSize: 12.5 * K,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: p,
          transform: `scale(${0.8 + 0.2 * p})`,
        }}
      >
        {label}
      </div>
    );
  };
  return (
    <AbsoluteFill>
      <StageBg />
      <div style={cam}>
        {first ? (
          <>
            <BrowserFrame src="08-feed.png" />
            <ChipFill x={474} w={64} label="✓ Cuba" p={chipOn(c1)} />
            <ChipFill x={547} w={93} label="✓ Tecnología" p={chipOn(c2)} />
            <Cursor
              frame={frame}
              keys={keys}
              clicks={[c1, c2]}
              visibleFrom={0}
            />
          </>
        ) : (
          <>
            <BrowserFrame src="09-negocios.png" />
            <Ring
              x={384}
              y={324}
              w={470}
              h={102}
              p={easeOut(lerp(local, 10, 20))}
              color={B.teal}
            />
            <Ring
              x={866}
              y={478}
              w={470}
              h={102}
              p={easeOut(lerp(local, 30, 40))}
              color={B.teal}
            />
          </>
        )}
      </div>
      <Caption text={CAPTIONS[6]} frame={frame} dur={dur} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ 8 · Teléfono
export const C8Phone: React.FC<P> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inS = spring({ frame, fps, config: { damping: 16, stiffness: 90 } });
  const tap = at(dur, 0.55);
  const zoom = lerp(frame, at(dur, 0.35), at(dur, 0.55));
  const phoneW = 430 * 0.95;
  const phoneH = 900 * 0.95;
  const px = 960 - phoneW / 2;
  const py = 540 - phoneH / 2;
  const btn = { x: px + 215 * 0.95, y: py + 571 * 0.95 };
  const cam = cameraStyle(frame, [
    { f: 0, x: 960, y: 540, s: 1.0, r: -2 },
    { f: at(dur, 0.35), x: 960, y: 540, s: 1.0, r: 0 },
    { f: at(dur, 0.55), x: btn.x, y: btn.y - 60, s: 1.6, r: 0 },
    { f: dur, x: 960, y: py + 820, s: 1.35, r: 1 },
  ]);
  const ripple = lerp(frame, tap, tap + 18);
  return (
    <AbsoluteFill>
      <StageBg />
      <div style={cam}>
        <div
          style={{
            position: "absolute",
            left: px - 16,
            top: py - 16,
            width: phoneW + 32,
            height: phoneH + 32,
            borderRadius: 64,
            backgroundColor: "#0b0f10",
            boxShadow: "0 50px 120px rgba(0,0,0,0.3)",
            transform: `translateX(${(1 - inS) * 900}px) rotate(${(1 - inS) * 12}deg)`,
          }}
        >
          <Img
            src={staticFile("cubanbot/19-android.png")}
            style={{
              position: "absolute",
              left: 16,
              top: 16,
              width: phoneW,
              borderRadius: 50,
            }}
          />
          {ripple > 0 && ripple < 1 ? (
            <div
              style={{
                position: "absolute",
                left: 16 + 215 * 0.95 - 60,
                top: 16 + 571 * 0.95 - 60,
                width: 120,
                height: 120,
                borderRadius: 60,
                border: "4px solid #fff",
                opacity: 1 - ripple,
                transform: `scale(${0.3 + ripple})`,
              }}
            />
          ) : null}
        </div>
        <div
          style={{
            position: "absolute",
            left: 160,
            top: 380,
            width: 480,
            fontFamily: INTER,
            fontWeight: 800,
            fontSize: 64,
            letterSpacing: -2,
            lineHeight: "70px",
            color: B.ink,
            opacity: lerp(frame, 10, 24) * (1 - zoom),
          }}
        >
          Tu equipo, en el bolsillo.
        </div>
      </div>
      <Caption text={CAPTIONS[7]} frame={frame} dur={dur} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ 9 · Cierre
export const C9Outro: React.FC<P> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t1 = easeOut(lerp(frame, 4, 22));
  const t2 = easeOut(lerp(frame, 20, 38));
  const t3 = lerp(frame, at(dur, 0.55), at(dur, 0.55) + 14);
  const cam = cameraStyle(frame, [
    { f: 0, x: 960, y: 520, s: 1.1 },
    { f: dur, x: 960, y: 540, s: 1.0 },
  ]);
  return (
    <AbsoluteFill style={{ backgroundColor: B.paper }}>
      <div style={cam}>
        <Cast frame={frame + 10} fps={fps} scale={0.74} dx={70} dy={140} />
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 120,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: INTER,
              fontWeight: 800,
              fontSize: 170,
              letterSpacing: -7,
              color: B.ink,
              opacity: t1,
              transform: `translateY(${(1 - t1) * 40}px)`,
            }}
          >
            CubanBot.
          </div>
          <div
            style={{
              fontFamily: INTER,
              fontWeight: 500,
              fontSize: 50,
              letterSpacing: -1,
              color: B.ink,
              opacity: t2,
              transform: `translateY(${(1 - t2) * 20}px)`,
            }}
          >
            Tu equipo de agentes, a tu manera.
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 90,
            bottom: 70,
            fontFamily: INTER,
            fontWeight: 700,
            fontSize: 34,
            letterSpacing: 1,
            color: B.ink,
            opacity: t3,
          }}
        >
          PRÓXIMAMENTE
        </div>
      </div>
    </AbsoluteFill>
  );
};

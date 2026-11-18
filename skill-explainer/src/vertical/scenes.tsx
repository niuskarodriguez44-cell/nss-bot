import React from "react";
import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { MascotSvg, blinkAt, Mascot } from "../cubanbot/Characters";
import { INTER, SERIF, V, ease } from "./theme";

type P = { dur: number };
const at = (dur: number, x: number) => Math.round(dur * x);

// ---------------------------------------------------------------- fondo
export const Backdrop: React.FC = () => {
  const f = useCurrentFrame();
  const r1 = f * 0.08;
  const r2 = -f * 0.06;
  return (
    <AbsoluteFill style={{ backgroundColor: V.ivory }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        <defs>
          <radialGradient id="bloomA" cx="0" cy="0" r="1">
            <stop offset="0" stopColor={V.sage} stopOpacity={0.95} />
            <stop offset="1" stopColor={V.sage} stopOpacity={0} />
          </radialGradient>
        </defs>
        <circle
          cx={60 + 30 * Math.sin(f / 70)}
          cy={240}
          r={620}
          fill="url(#bloomA)"
        />
        <circle
          cx={1040}
          cy={1700 + 30 * Math.cos(f / 80)}
          r={700}
          fill="url(#bloomA)"
        />
        <g transform={`rotate(${r1} 40 160)`}>
          <circle
            cx={40}
            cy={160}
            r={420}
            fill="none"
            stroke={V.gray}
            strokeWidth={3}
          />
          <path
            d="M 40 -260 A 420 420 0 0 1 380 -80"
            fill="none"
            stroke={V.green}
            strokeWidth={4}
            opacity={0.5}
          />
        </g>
        <g transform={`rotate(${r2} 1060 1780)`}>
          <circle
            cx={1060}
            cy={1780}
            r={480}
            fill="none"
            stroke={V.gray}
            strokeWidth={3}
          />
          <path
            d="M 580 1780 A 480 480 0 0 1 700 1460"
            fill="none"
            stroke={V.green}
            strokeWidth={4}
            opacity={0.5}
          />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

/** Entrada tipo "whip" (escala + desenfoque) y salida rápida con desenfoque. */
const Beat: React.FC<{ dur: number; children: React.ReactNode }> = ({
  dur,
  children,
}) => {
  const f = useCurrentFrame();
  const inP = ease(f, 0, 9);
  const outP = ease(f, dur - 6, dur, 0, 1);
  const scale = 1.12 - 0.12 * inP + 0.14 * outP;
  const blur = 10 * (1 - inP) + 12 * outP;
  return (
    <AbsoluteFill
      style={{
        transform: `scale(${scale})`,
        filter: `blur(${blur}px)`,
        opacity: Math.min(inP * 1.4, 1 - outP),
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

type Part = { t: string; italic?: boolean; green?: boolean };
/** Frase con revelado por palabra (desde una máscara), centrada. */
const Phrase: React.FC<{
  parts: Part[];
  start: number;
  size: number;
  y: number;
  weight?: number;
  gap?: number;
  out?: number;
}> = ({ parts, start, size, y, weight = 600, gap = 4, out }) => {
  const f = useCurrentFrame();
  const o = out === undefined ? 1 : 1 - ease(f, out, out + 8);
  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        top: y,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        columnGap: size * 0.28,
        opacity: o,
      }}
    >
      {parts.map((p, i) => {
        const pr = ease(f, start + i * gap, start + i * gap + 12);
        return (
          <div
            key={i}
            style={{
              overflow: "hidden",
              height: size * 1.25,
              paddingBottom: 4,
            }}
          >
            <div
              style={{
                fontFamily: p.italic ? SERIF : INTER,
                fontStyle: p.italic ? "italic" : "normal",
                fontWeight: p.italic ? 400 : weight,
                fontSize: p.italic ? size * 1.12 : size,
                lineHeight: `${size * 1.22}px`,
                letterSpacing: p.italic ? -1 : -size * 0.035,
                color: p.green ? V.green : V.ink,
                transform: `translateY(${(1 - pr) * size * 1.2}px)`,
                whiteSpace: "nowrap",
              }}
            >
              {p.t}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------- 1 · gancho
export const S1Hook: React.FC<P> = ({ dur }) => {
  const swap = at(dur, 0.58);
  return (
    <Beat dur={dur}>
      <Phrase
        parts={[{ t: "Tu" }, { t: "IA" }, { t: "responde" }]}
        start={4}
        size={96}
        y={720}
        out={swap - 6}
      />
      <Phrase
        parts={[{ t: "en segundos", italic: true, green: true }]}
        start={14}
        size={110}
        y={850}
        out={swap - 6}
      />
      <Phrase
        parts={[
          { t: "¿y", italic: true },
          { t: "después?", italic: true },
        ]}
        start={swap}
        size={150}
        y={780}
      />
    </Beat>
  );
};

// ---------------------------------------------------------------- 2 · medidor
export const S2Gauge: React.FC<P> = ({ dur }) => {
  const f = useCurrentFrame();
  const cx = 540;
  const cy = 980;
  const R = 400;
  const a0 = 200;
  const a1 = 340;
  const sweep = at(dur, 0.55);
  const draw = ease(f, 2, 22);
  const ang =
    ease(f, 8, 26, a0, a0 + 25) + ease(f, sweep, sweep + 14, 0, a1 - a0 - 30);
  const P2 = (a: number, r: number) => ({
    x: cx + r * Math.cos((a * Math.PI) / 180),
    y: cy + r * Math.sin((a * Math.PI) / 180),
  });
  const s = P2(a0, R);
  const e = P2(a0 + (a1 - a0) * draw, R);
  const ticks = Array.from({ length: 15 }, (_, i) => a0 + (i * (a1 - a0)) / 14);
  const tip = P2(ang, R - 50);
  const blurNeedle = f >= sweep && f < sweep + 10 ? 2 : 0;
  return (
    <Beat dur={dur}>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <path
          d={`M ${s.x} ${s.y} A ${R} ${R} 0 0 1 ${e.x} ${e.y}`}
          fill="none"
          stroke={V.green}
          strokeWidth={6}
          strokeLinecap="round"
        />
        {ticks.map((a, i) => {
          if ((a - a0) / (a1 - a0) > draw) return null;
          const p1 = P2(a, R - 22);
          const p2 = P2(a, R - (i % 7 === 0 ? 56 : 38));
          return (
            <g key={i}>
              <line
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                stroke={V.ink}
                strokeWidth={i % 7 === 0 ? 4 : 2}
              />
              {i % 7 === 0 ? (
                <circle
                  cx={P2(a, R).x}
                  cy={P2(a, R).y}
                  r={10}
                  fill={V.ivory}
                  stroke={V.green}
                  strokeWidth={4}
                />
              ) : null}
            </g>
          );
        })}
        <line
          x1={cx}
          y1={cy}
          x2={tip.x}
          y2={tip.y}
          stroke={V.ink}
          strokeWidth={9}
          strokeLinecap="round"
          style={{ filter: `blur(${blurNeedle}px)` }}
        />
        <circle cx={cx} cy={cy} r={26} fill={V.green} />
      </svg>
      {[
        { t: "segundos", a: a0 },
        { t: "días", a: (a0 + a1) / 2 },
        { t: "semanas", a: a1 },
      ].map((l) => {
        const p = P2(l.a, R + 80);
        return (
          <div
            key={l.t}
            style={{
              position: "absolute",
              left: p.x - 120,
              top: p.y - 22,
              width: 240,
              textAlign: "center",
              fontFamily: INTER,
              fontSize: 32,
              fontWeight: 500,
              color: "#777",
              opacity: draw,
            }}
          >
            {l.t}
          </div>
        );
      })}
      <Phrase
        parts={[{ t: "No" }, { t: "duran" }, { t: "segundos." }]}
        start={6}
        size={70}
        y={1120}
      />
      <Phrase
        parts={[
          { t: "Duran", italic: true, green: true },
          { t: "semanas.", italic: true, green: true },
        ]}
        start={sweep}
        size={120}
        y={1240}
      />
    </Beat>
  );
};

// ---------------------------------------------------------------- 3 · anillo de progreso
export const S3Ring: React.FC<P> = ({ dur }) => {
  const f = useCurrentFrame();
  const t1 = at(dur, 0.42);
  const t2 = at(dur, 0.72);
  const value =
    f < t1
      ? 1
      : f < t2
        ? Math.round(ease(f, t1, t1 + 10, 1, 14))
        : Math.round(ease(f, t2, t2 + 14, 14, 30));
  const prog =
    ease(f, 4, 18, 0, 1 / 30) +
    ease(f, t1, t1 + 10, 0, 13 / 30) +
    ease(f, t2, t2 + 14, 0, 16 / 30);
  const r = 270;
  const C = 2 * Math.PI * r;
  const halo = ease(f, t2 + 6, t2 + 22);
  return (
    <Beat dur={dur}>
      <Phrase
        parts={[{ t: "Un" }, { t: "equipo" }, { t: "que" }]}
        start={4}
        size={66}
        y={330}
      />
      <Phrase
        parts={[{ t: "no pierde el hilo", italic: true, green: true }]}
        start={12}
        size={100}
        y={430}
      />
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <defs>
          <radialGradient id="halo">
            <stop offset="0.55" stopColor={V.green} stopOpacity={0.22} />
            <stop offset="1" stopColor={V.green} stopOpacity={0} />
          </radialGradient>
        </defs>
        <circle
          cx={540}
          cy={1020}
          r={430}
          fill="url(#halo)"
          opacity={0.35 + 0.65 * halo}
        />
        <circle
          cx={540}
          cy={1020}
          r={r}
          fill="none"
          stroke={V.gray}
          strokeWidth={22}
        />
        <circle
          cx={540}
          cy={1020}
          r={r}
          fill="none"
          stroke={V.green}
          strokeWidth={22}
          strokeLinecap="round"
          strokeDasharray={`${C * prog} ${C}`}
          transform="rotate(-90 540 1020)"
        />
      </svg>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 870,
          textAlign: "center",
          fontFamily: INTER,
          fontWeight: 700,
          fontSize: 230,
          letterSpacing: -10,
          color: V.ink,
          lineHeight: "240px",
        }}
      >
        {value}
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1110,
          textAlign: "center",
          fontFamily: SERIF,
          fontStyle: "italic",
          fontSize: 54,
          color: V.green,
        }}
      >
        {value === 1 ? "día" : "días"}
      </div>
    </Beat>
  );
};

// ---------------------------------------------------------------- 4 · CubanBot + nodos hexagonales
const hex = (cx: number, cy: number, r: number) =>
  Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i + Math.PI / 6;
    return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
  }).join(" ");

const Icon: React.FC<{
  kind: "search" | "code" | "bolt";
  x: number;
  y: number;
}> = ({ kind, x, y }) => (
  <g
    transform={`translate(${x} ${y})`}
    fill="none"
    stroke="#fff"
    strokeWidth={8}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {kind === "search" ? (
      <>
        <circle cx={-8} cy={-8} r={30} />
        <line x1={14} y1={14} x2={38} y2={38} />
      </>
    ) : kind === "code" ? (
      <>
        <polyline points="-22,-28 -48,0 -22,28" />
        <polyline points="22,-28 48,0 22,28" />
        <line x1={8} y1={-36} x2={-8} y2={36} />
      </>
    ) : (
      <polyline points="8,-46 -24,6 4,6 -8,46 26,-8 -2,-8 8,-46" />
    )}
  </g>
);

export const S4Nodes: React.FC<P> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const nodes = [
    {
      x: 330,
      y: 960,
      t: "Investigan",
      icon: "search" as const,
      at: at(dur, 0.42),
      lx: 230,
      ly: 740,
    },
    {
      x: 750,
      y: 960,
      t: "Programan",
      icon: "code" as const,
      at: at(dur, 0.58),
      lx: 850,
      ly: 740,
    },
    {
      x: 540,
      y: 1300,
      t: "Automatizan",
      icon: "bolt" as const,
      at: at(dur, 0.76),
      lx: 540,
      ly: 1560,
    },
  ];
  return (
    <Beat dur={dur}>
      <Phrase
        parts={[{ t: "Presentamos" }]}
        start={2}
        size={60}
        y={300}
        weight={500}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 390,
          textAlign: "center",
          fontFamily: INTER,
          fontWeight: 800,
          fontSize: 168,
          letterSpacing: -8,
          color: V.ink,
          transform: `scale(${0.8 + 0.2 * spring({ frame: f - 8, fps, config: { damping: 12 } })})`,
          opacity: ease(f, 8, 16),
        }}
      >
        CubanBot.
      </div>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        {nodes.map((n, i) => {
          const s = spring({
            frame: f - n.at,
            fps,
            config: { damping: 13, stiffness: 140 },
          });
          const line = ease(f, n.at + 6, n.at + 18);
          const ex = n.x + (n.lx - n.x) * line;
          const ey = n.y + (n.ly - n.y) * line;
          if (f < n.at) return null;
          return (
            <g key={i}>
              <line
                x1={n.x}
                y1={n.y}
                x2={ex}
                y2={ey}
                stroke={V.ink}
                strokeWidth={3}
              />
              <g
                transform={`translate(${n.x} ${n.y}) scale(${s}) translate(${-n.x} ${-n.y})`}
              >
                <polygon points={hex(n.x + 8, n.y + 12, 130)} fill={V.ink} />
                <polygon points={hex(n.x, n.y, 130)} fill={V.green} />
                <Icon kind={n.icon} x={n.x} y={n.y} />
              </g>
            </g>
          );
        })}
      </svg>
      {nodes.map((n) => {
        const p = ease(f, n.at + 14, n.at + 24);
        return (
          <div
            key={n.t}
            style={{
              position: "absolute",
              left: n.lx - 200,
              top: n.ly - (n.ly > 1400 ? -10 : 70),
              width: 400,
              textAlign: "center",
              fontFamily: INTER,
              fontWeight: 600,
              fontSize: 50,
              letterSpacing: -1.5,
              color: V.ink,
              opacity: p,
              transform: `translateY(${(1 - p) * 16}px)`,
            }}
          >
            {n.t}
          </div>
        );
      })}
    </Beat>
  );
};

// ---------------------------------------------------------------- 5 · apps (fila enmarcada)
const AppGlyph: React.FC<{ k: number }> = ({ k }) => (
  <svg
    width={70}
    height={70}
    viewBox="-35 -35 70 70"
    fill="none"
    stroke="#fff"
    strokeWidth={6}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {k === 0 ? (
      <>
        <rect x={-26} y={-18} width={52} height={36} rx={6} />
        <polyline points="-26,-14 0,6 26,-14" />
      </>
    ) : k === 1 ? (
      <>
        <rect x={-24} y={-22} width={48} height={46} rx={7} />
        <line x1={-24} y1={-6} x2={24} y2={-6} />
        <line x1={-10} y1={-30} x2={-10} y2={-16} />
        <line x1={10} y1={-30} x2={10} y2={-16} />
      </>
    ) : k === 3 ? (
      <>
        <polyline points="-18,22 -18,-22 18,22 18,-22" />
      </>
    ) : (
      <>
        <path d="M -24 -16 h 48 v 30 h -30 l -12 10 v -10 h -6 z" />
      </>
    )}
  </svg>
);

export const S5Apps: React.FC<P> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tiles = [0, 1, 2, 3, 4];
  const bracket = ease(f, 6, 18);
  const B = { x: 110, y: 820, w: 860, h: 300 };
  const L = 70 * bracket;
  const corner = (x: number, y: number, dx: number, dy: number) =>
    `M ${x} ${y + dy * L} L ${x} ${y} L ${x + dx * L} ${y}`;
  return (
    <Beat dur={dur}>
      <Phrase
        parts={[{ t: "Conecta" }, { t: "tus" }, { t: "apps" }]}
        start={2}
        size={84}
        y={600}
      />
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        {[
          corner(B.x, B.y, 1, 1),
          corner(B.x + B.w, B.y, -1, 1),
          corner(B.x, B.y + B.h, 1, -1),
          corner(B.x + B.w, B.y + B.h, -1, -1),
        ].map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke={V.green}
            strokeWidth={6}
            strokeLinecap="round"
          />
        ))}
      </svg>
      <div
        style={{
          position: "absolute",
          left: B.x,
          top: B.y,
          width: B.w,
          height: B.h,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 26,
        }}
      >
        {tiles.map((k) => {
          const s = spring({
            frame: f - 8 - Math.abs(k - 2) * 4,
            fps,
            config: { damping: 13 },
          });
          const hero = k === 2;
          const size = hero ? 190 : 130;
          return (
            <div
              key={k}
              style={{
                width: size,
                height: size,
                borderRadius: hero ? 44 : 30,
                backgroundColor: hero ? V.ink : V.green,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: `scale(${s})`,
                boxShadow: hero ? "0 20px 50px rgba(0,0,0,0.25)" : "none",
              }}
            >
              {hero ? (
                <MascotSvg kind="cubi" size={120} blink={blinkAt(f, 2)} />
              ) : (
                <AppGlyph k={k} />
              )}
            </div>
          );
        })}
      </div>
      <Phrase
        parts={[{ t: "una vez.", italic: true, green: true }]}
        start={at(dur, 0.32)}
        size={120}
        y={1180}
      />
      <Phrase
        parts={[{ t: "Y" }, { t: "deja" }, { t: "que" }, { t: "trabajen." }]}
        start={at(dur, 0.6)}
        size={58}
        y={1360}
        weight={500}
      />
    </Beat>
  );
};

// ---------------------------------------------------------------- 6 · chevrones (mientras duermes)
export const S6Night: React.FC<P> = ({ dur }) => {
  const f = useCurrentFrame();
  const cols = [190, 365, 540, 715, 890];
  const step = 120;
  const off = (f * 1.6) % step;
  return (
    <Beat dur={dur}>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="fadeV" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity={0} />
            <stop offset="0.3" stopColor="#fff" stopOpacity={1} />
            <stop offset="0.7" stopColor="#fff" stopOpacity={1} />
            <stop offset="1" stopColor="#fff" stopOpacity={0} />
          </linearGradient>
          <mask id="m">
            <rect width={1080} height={1920} fill="url(#fadeV)" />
          </mask>
        </defs>
        <g mask="url(#m)" opacity={ease(f, 0, 16)}>
          {cols.map((x, c) =>
            Array.from({ length: 18 }, (_, i) => {
              const y = 1920 - i * step + off - (c % 2) * 60;
              if (y > 540 && y < 1250) return null;
              return (
                <polyline
                  key={`${c}-${i}`}
                  points={`${x - 34},${y + 18} ${x},${y - 16} ${x + 34},${y + 18}`}
                  fill="none"
                  stroke={V.ink}
                  strokeWidth={4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={0.75}
                />
              );
            }),
          )}
        </g>
        <g
          transform={`translate(540 640) rotate(${Math.sin(f / 30) * 4})`}
          opacity={ease(f, 4, 18)}
        >
          <path
            d="M 30 -60 A 66 66 0 1 0 60 30 A 52 52 0 1 1 30 -60 Z"
            fill="none"
            stroke={V.green}
            strokeWidth={7}
            strokeLinejoin="round"
          />
        </g>
        {[0, 1, 2, 3, 4].map((i) => (
          <circle
            key={i}
            cx={420 + i * 60}
            cy={1290}
            r={9}
            fill="none"
            stroke={V.ink}
            strokeWidth={3}
            opacity={0.3 + 0.7 * (Math.floor(f / 8) % 5 === i ? 1 : 0)}
          />
        ))}
      </svg>
      <Phrase
        parts={[{ t: "Incluso" }]}
        start={4}
        size={64}
        y={790}
        weight={500}
      />
      <Phrase
        parts={[
          { t: "mientras", italic: true, green: true },
          { t: "duermes.", italic: true, green: true },
        ]}
        start={at(dur, 0.32)}
        size={130}
        y={900}
        gap={8}
      />
    </Beat>
  );
};

// ---------------------------------------------------------------- 7 · declaración palabra por palabra
export const S7Statement: React.FC<P> = ({ dur }) => {
  const g2 = at(dur, 0.5);
  return (
    <Beat dur={dur}>
      <Phrase
        parts={[
          { t: "Tú", green: true },
          { t: "decides", green: true },
          { t: "el rumbo.", italic: true, green: true },
        ]}
        start={4}
        size={104}
        y={640}
        gap={8}
      />
      <Phrase
        parts={[{ t: "Ellos" }, { t: "hacen" }]}
        start={g2}
        size={104}
        y={900}
        gap={8}
      />
      <Phrase
        parts={[{ t: "el camino.", italic: true }]}
        start={g2 + 14}
        size={150}
        y={1040}
      />
    </Beat>
  );
};

// ---------------------------------------------------------------- 8 · cierre con chips
const MASCOTS: Mascot[] = ["chispa", "byte", "cubi", "lupa", "nexo", "pulso"];
export const S8End: React.FC<P> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chips = [
    { t: "Coordinan", fill: true },
    { t: "Recuerdan", fill: false },
    { t: "Investigan", fill: false },
    { t: "Automatizan", fill: true },
  ];
  const prox = at(dur, 0.42);
  return (
    <AbsoluteFill style={{ opacity: ease(f, 0, 8) }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 470,
          display: "flex",
          justifyContent: "center",
          gap: 18,
        }}
      >
        {MASCOTS.map((m, i) => {
          const s = spring({
            frame: f - 2 - i * 3,
            fps,
            config: { damping: 10, stiffness: 150 },
          });
          return (
            <div
              key={m}
              style={{
                transform: `translateY(${(1 - s) * 120}px) scale(${s})`,
              }}
            >
              <MascotSvg
                kind={m}
                size={m === "cubi" ? 170 : 130}
                blink={blinkAt(f, i)}
              />
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 700,
          textAlign: "center",
          fontFamily: INTER,
          fontWeight: 800,
          fontSize: 180,
          letterSpacing: -9,
          color: V.ink,
          transform: `scale(${0.85 + 0.15 * spring({ frame: f - 4, fps, config: { damping: 12 } })})`,
        }}
      >
        CubanBot.
      </div>
      <div
        style={{
          position: "absolute",
          left: 140,
          right: 140,
          top: 990,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 22,
        }}
      >
        {chips.map((c, i) => {
          const p = ease(f, 14 + i * 4, 26 + i * 4);
          return (
            <div
              key={c.t}
              style={{
                height: 96,
                borderRadius: 48,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: INTER,
                fontWeight: 600,
                fontSize: 40,
                letterSpacing: -1,
                backgroundColor: c.fill ? V.green : "#fff",
                color: c.fill ? "#fff" : V.ink,
                border: c.fill ? "none" : `3px solid ${V.ink}`,
                opacity: p,
                transform: `scale(${0.8 + 0.2 * p})`,
              }}
            >
              {c.t}
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1300,
          textAlign: "center",
          fontFamily: SERIF,
          fontStyle: "italic",
          fontSize: 110,
          color: V.green,
          opacity: ease(f, prox, prox + 12),
          transform: `translateY(${(1 - ease(f, prox, prox + 12)) * 30}px)`,
        }}
      >
        Próximamente
      </div>
    </AbsoluteFill>
  );
};

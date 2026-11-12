import React from "react";
import { AbsoluteFill } from "remotion";
import { loadFont as loadPixel } from "@remotion/google-fonts/PressStart2P";
import { POPPINS } from "../theme";

const PIXEL = loadPixel("normal", { subsets: ["latin"] }).fontFamily;

/** Cuadro de prueba: el Búho (la IA) se conecta con la Ardilla y el Castor por una toma universal "MCP". */

// ------------------------------------------------------------------ A · Bauhaus
export const FrameBauhaus: React.FC = () => {
  const ink = "#1b1b1b";
  const red = "#d62b2b";
  const yellow = "#f2b705";
  const blue = "#1f4e9c";
  const cream = "#f1e8d4";
  const hex = (cx: number, cy: number, r: number) =>
    Array.from({ length: 6 }, (_, i) => {
      const a = (Math.PI / 3) * i + Math.PI / 6;
      return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
    }).join(" ");
  return (
    <AbsoluteFill style={{ backgroundColor: cream }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        <circle cx={1560} cy={250} r={210} fill={yellow} />
        <rect x={0} y={880} width={1920} height={200} fill={blue} />
        <rect x={0} y={860} width={1920} height={20} fill={ink} />
        <path d="M 1100 0 L 1920 0 L 1920 140 Z" fill={red} />

        {/* Cables (líneas rectas y arcos, ángulos de 90°) */}
        <path
          d="M 700 690 H 1020 V 430 H 1240"
          fill="none"
          stroke={ink}
          strokeWidth={14}
        />
        <path
          d="M 700 690 H 1020 V 800 H 1240"
          fill="none"
          stroke={ink}
          strokeWidth={14}
        />
        <polygon
          points={hex(1262, 430, 40)}
          fill={cream}
          stroke={ink}
          strokeWidth={10}
        />
        <polygon
          points={hex(1262, 800, 40)}
          fill={cream}
          stroke={ink}
          strokeWidth={10}
        />

        {/* Búho: arco azul, ojos circulares, pico triangular */}
        <path d="M 420 380 a 190 190 0 0 1 380 0 V 840 H 420 Z" fill={blue} />
        <path d="M 420 300 l -20 -90 l 100 50 Z" fill={ink} />
        <path d="M 800 300 l 20 -90 l -100 50 Z" fill={ink} />
        <path d="M 420 520 l -110 170 l 110 60 Z" fill={ink} />
        <path d="M 800 520 l 110 170 l -110 60 Z" fill={ink} />
        <circle cx={520} cy={400} r={78} fill={cream} />
        <circle cx={700} cy={400} r={78} fill={cream} />
        <circle cx={520} cy={400} r={52} fill={yellow} />
        <circle cx={700} cy={400} r={52} fill={yellow} />
        <circle cx={528} cy={400} r={26} fill={ink} />
        <circle cx={692} cy={400} r={26} fill={ink} />
        <path d="M 610 440 l -34 76 h 68 Z" fill={red} />
        <circle cx={610} cy={690} r={110} fill={cream} />
        <polygon
          points={hex(610, 690, 56)}
          fill={yellow}
          stroke={ink}
          strokeWidth={8}
        />
        <text
          x={610}
          y={704}
          textAnchor="middle"
          fontFamily={POPPINS}
          fontWeight={600}
          fontSize={34}
          fill={ink}
        >
          MCP
        </text>
        <rect x={500} y={840} width={50} height={30} fill={yellow} />
        <rect x={670} y={840} width={50} height={30} fill={yellow} />

        {/* Ardilla: círculos y cuarto de círculo, cola en arco */}
        <path
          d="M 1320 530 a 90 90 0 0 1 90 90 V 620 H 1320 Z"
          fill={red}
          transform="translate(-30 -60)"
        />
        <circle cx={1300} cy={380} r={62} fill={red} />
        <path d="M 1270 330 l -14 -52 l 52 22 Z" fill={ink} />
        <path d="M 1330 330 l 18 -52 l -46 28 Z" fill={ink} />
        <circle cx={1282} cy={376} r={10} fill={cream} />
        <circle cx={1318} cy={376} r={10} fill={cream} />
        <path
          d="M 1370 520 a 120 120 0 1 1 -40 -170"
          fill="none"
          stroke={red}
          strokeWidth={46}
          strokeLinecap="butt"
        />
        <rect x={1260} y={470} width={90} height={110} fill={red} />

        {/* Castor: rectángulos redondos, cola plana */}
        <rect x={1250} y={730} width={150} height={150} rx={20} fill={yellow} />
        <circle cx={1325} cy={715} r={56} fill={yellow} />
        <rect x={1290} y={756} width={70} height={30} fill={cream} />
        <circle cx={1305} cy={700} r={9} fill={ink} />
        <circle cx={1345} cy={700} r={9} fill={ink} />
        <rect x={1400} y={810} width={150} height={56} fill={ink} />
      </svg>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ B · Píxel 8 bits
type Rows = string[];
const PAL: Record<string, string> = {
  k: "#1a1a2e",
  B: "#6b3f1d",
  b: "#a8682e",
  w: "#f5ecd3",
  y: "#ffd23f",
  o: "#ff8a3d",
  r: "#d62f2f",
  g: "#3fb36f",
  G: "#1e6f4a",
  n: "#8a5a2b",
  c: "#7fd1ff",
  p: "#ffb4c0",
};

const OWL: Rows = [
  "...B........B...",
  "..BBB......BBB..",
  "..BbBBBBBBBBbB..",
  ".BbbbbbbbbbbbbB.",
  ".BbwwwbbbbwwwbB.",
  ".BwwkkwbbwkkwwB.",
  ".BwwkkwbbwkkwwB.",
  ".BbwwwbooobwwbB.",
  ".BbbbbbboobbbbB.",
  "BBbbwwwwwwwwbbBB",
  "BbbwwbwwwwbwwbbB",
  "BbbwwwbwwbwwwbbB",
  "BbbwwbwwwwbwwbbB",
  ".BbbwwwbbwwwbbB.",
  "..BBbbbbbbbbBB..",
  "...BBBBBBBBBB...",
  "...yy......yy...",
  "..yyyy....yyyy..",
];
const SQUIRREL: Rows = [
  "......bb........",
  ".....bBBb....bbb",
  "....bbBBbb..bBBb",
  "...bbbbbbb.bBBBb",
  "..bbkbbkbb.bBBBb",
  "..bbbbbbbb.bBBBb",
  "..bbbppbbbbbBBBb",
  "...bbbbbbbbBBBb.",
  "....bwwwbbbBBb..",
  "....bwwwwbbBb...",
  "....bwwwwwbb....",
  "....bwwwwwb.....",
  ".....bbbbbb.....",
  ".....bb..bb.....",
];
const BEAVER: Rows = [
  "...kk....kk.....",
  "..kBBk..kBBk....",
  "..BBBBBBBBBB....",
  ".BBBkBBBBkBBB...",
  ".BBBBBwwBBBBB...",
  ".BBBBwwwwBBBB...",
  ".BBBBBwwBBBBB...",
  "..BBBBBBBBBB....",
  "..BBBBBBBBBBkkkk",
  "..BBbbbbbbBBkkkk",
  "..BBbbbbbbBBkkkk",
  "..BBBBBBBBBBkkkk",
  "..BB..BB..BB....",
];

const Sprite: React.FC<{ rows: Rows; x: number; y: number; s: number }> = ({
  rows,
  x,
  y,
  s,
}) => (
  <g>
    {rows.flatMap((row, j) =>
      row
        .split("")
        .map((ch, i) =>
          ch === "." ? null : (
            <rect
              key={`${i}-${j}`}
              x={x + i * s}
              y={y + j * s}
              width={s}
              height={s}
              fill={PAL[ch]}
            />
          ),
        ),
    )}
  </g>
);

export const FramePixel: React.FC = () => {
  const s = 14;
  // Cables escalonados (píxeles): línea de bloques
  const wire = (pts: [number, number][], color: string) =>
    pts.map(([x, y], i) => (
      <rect key={i} x={x} y={y} width={s} height={s} fill={color} />
    ));
  const line = (x0: number, y0: number, x1: number, y1: number) => {
    const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) / s;
    return Array.from(
      { length: Math.round(n) + 1 },
      (_, i) =>
        [
          Math.round((x0 + ((x1 - x0) * i) / n) / s) * s,
          Math.round((y0 + ((y1 - y0) * i) / n) / s) * s,
        ] as [number, number],
    );
  };
  return (
    <AbsoluteFill style={{ backgroundColor: "#2b2d5f" }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        {/* Estrellas */}
        {Array.from({ length: 36 }, (_, i) => (
          <rect
            key={i}
            x={(i * 197) % 1900}
            y={(i * 83) % 520}
            width={i % 3 === 0 ? 8 : 4}
            height={i % 3 === 0 ? 8 : 4}
            fill="#f5ecd3"
            opacity={0.8}
          />
        ))}
        {/* Luna */}
        <rect x={1500} y={120} width={140} height={140} fill="#ffe9a8" />
        <rect x={1528} y={92} width={84} height={28} fill="#ffe9a8" />
        <rect x={1528} y={260} width={84} height={28} fill="#ffe9a8" />
        {/* Suelo de ladrillos */}
        {Array.from({ length: 5 }, (_, r) =>
          Array.from({ length: 36 }, (_, c) => (
            <rect
              key={`${r}-${c}`}
              x={c * 56 - (r % 2) * 28}
              y={900 + r * 36}
              width={52}
              height={32}
              fill={r === 0 ? "#3fb36f" : "#b5532f"}
            />
          )),
        )}
        {/* Rama */}
        <rect x={120} y={770} width={620} height={28} fill="#6b3f1d" />
        <rect x={120} y={798} width={620} height={14} fill="#4a2a12" />

        {/* Cables */}
        {wire(line(448, 600, 868, 600), "#ffd23f")}
        {wire(line(868, 600, 868, 380), "#ffd23f")}
        {wire(line(868, 380, 1150, 380), "#ffd23f")}
        {wire(line(868, 600, 868, 770), "#ffd23f")}
        {wire(line(868, 770, 1150, 770), "#ffd23f")}

        <Sprite rows={OWL} x={220} y={500} s={22} />
        <rect
          x={420}
          y={580}
          width={56}
          height={44}
          fill="#ffd23f"
          stroke="#1a1a2e"
          strokeWidth={6}
        />
        <Sprite rows={SQUIRREL} x={1150} y={250} s={s * 1.6} />
        <Sprite rows={BEAVER} x={1150} y={660} s={s * 1.6} />
        <rect
          x={1120}
          y={364}
          width={44}
          height={36}
          fill="#ffd23f"
          stroke="#1a1a2e"
          strokeWidth={6}
        />
        <rect
          x={1120}
          y={754}
          width={44}
          height={36}
          fill="#ffd23f"
          stroke="#1a1a2e"
          strokeWidth={6}
        />
        <text x={452} y={612} fontFamily={PIXEL} fontSize={16} fill="#1a1a2e">
          MCP
        </text>
        <text x={140} y={150} fontFamily={PIXEL} fontSize={26} fill="#f5ecd3">
          WORLD 1-1
        </text>
      </svg>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ C · Sombras chinescas
export const FrameShadow: React.FC = () => {
  const edge = "#3a160a";
  const red = "#c0352a";
  const amber = "#d99a2e";
  const green = "#2f7d4c";
  const hole = "#f7e2ae";
  return (
    <AbsoluteFill style={{ backgroundColor: "#7a4a20" }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        <defs>
          <radialGradient id="screen" cx="50%" cy="46%" r="75%">
            <stop offset="0" stopColor="#fff6d6" />
            <stop offset="0.45" stopColor="#f2d7a0" />
            <stop offset="0.85" stopColor="#cf9a58" />
            <stop offset="1" stopColor="#7a4a20" />
          </radialGradient>
          <pattern
            id="dots"
            width={26}
            height={26}
            patternUnits="userSpaceOnUse"
          >
            <circle cx={13} cy={13} r={4} fill={hole} />
          </pattern>
          <pattern
            id="lines"
            width={20}
            height={20}
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(35)"
          >
            <rect width={20} height={6} fill={hole} />
          </pattern>
          <filter id="soft" x="-5%" y="-5%" width="110%" height="110%">
            <feGaussianBlur stdDeviation={5} />
          </filter>
        </defs>
        <rect width={1920} height={1080} fill="url(#screen)" />
        {/* Marco de madera */}
        <rect
          x={20}
          y={20}
          width={1880}
          height={1040}
          fill="none"
          stroke="#4a2a10"
          strokeWidth={40}
        />

        {/* Sombras suaves desplazadas (la pieza no toca del todo la tela) */}
        <g
          opacity={0.28}
          filter="url(#soft)"
          transform="translate(9 7)"
          fill={edge}
        >
          <ellipse cx={560} cy={600} rx={190} ry={250} />
          <ellipse cx={1300} cy={410} rx={110} ry={140} />
          <ellipse cx={1300} cy={780} rx={140} ry={110} />
        </g>

        {/* Cables como hilos de manipulación */}
        <path
          d="M 640 660 C 820 660, 900 430, 1170 430"
          fill="none"
          stroke={edge}
          strokeWidth={5}
        />
        <path
          d="M 640 660 C 820 660, 900 790, 1170 790"
          fill="none"
          stroke={edge}
          strokeWidth={5}
        />
        <path
          d="M 560 880 V 1040 M 1300 560 V 1040 M 1300 890 V 1040"
          stroke={edge}
          strokeWidth={5}
          opacity={0.9}
        />

        {/* Búho */}
        <g stroke={edge} strokeWidth={5}>
          <path
            d="M 400 400 L 380 300 L 470 360 Q 560 330 650 360 L 740 300 L 720 400 Q 770 520 740 700 Q 700 860 560 870 Q 420 860 380 700 Q 350 520 400 400 Z"
            fill={red}
          />
        </g>
        <g clipPath="url(#owlClip)">
          <path
            d="M 400 400 L 380 300 L 470 360 Q 560 330 650 360 L 740 300 L 720 400 Q 770 520 740 700 Q 700 860 560 870 Q 420 860 380 700 Q 350 520 400 400 Z"
            fill="url(#dots)"
          />
        </g>
        <path
          d="M 470 620 Q 560 580 650 620 Q 650 800 560 820 Q 470 800 470 620 Z"
          fill={hole}
          opacity={0.9}
          stroke={edge}
          strokeWidth={4}
        />
        <path
          d="M 400 520 Q 330 640 400 780 Q 450 700 440 560 Z"
          fill={amber}
          stroke={edge}
          strokeWidth={5}
        />
        <path
          d="M 720 520 Q 790 640 720 780 Q 670 700 680 560 Z"
          fill={amber}
          stroke={edge}
          strokeWidth={5}
        />
        <circle
          cx={500}
          cy={470}
          r={62}
          fill={hole}
          stroke={edge}
          strokeWidth={6}
        />
        <circle
          cx={620}
          cy={470}
          r={62}
          fill={hole}
          stroke={edge}
          strokeWidth={6}
        />
        <circle cx={506} cy={472} r={26} fill={edge} />
        <circle cx={614} cy={472} r={26} fill={edge} />
        <path
          d="M 560 510 l -24 50 h 48 Z"
          fill={amber}
          stroke={edge}
          strokeWidth={4}
        />
        <circle
          cx={560}
          cy={640}
          r={34}
          fill={green}
          stroke={edge}
          strokeWidth={5}
        />
        <text
          x={560}
          y={652}
          textAnchor="middle"
          fontFamily={POPPINS}
          fontWeight={600}
          fontSize={26}
          fill="#fff6d6"
        >
          MCP
        </text>

        {/* Ardilla (ámbar) */}
        <g stroke={edge} strokeWidth={5}>
          <path
            d="M 1360 520 Q 1500 440 1480 300 Q 1470 200 1390 230 Q 1420 300 1370 380 Z"
            fill={amber}
          />
          <ellipse cx={1300} cy={420} rx={92} ry={118} fill={amber} />
          <circle cx={1280} cy={300} r={58} fill={amber} />
          <path
            d="M 1245 262 L 1228 205 L 1280 240 Z M 1315 250 L 1330 196 L 1352 262 Z"
            fill={amber}
          />
        </g>
        <path
          d="M 1360 520 Q 1500 440 1480 300 Q 1470 200 1390 230 Q 1420 300 1370 380 Z"
          fill="url(#lines)"
        />
        <circle cx={1270} cy={296} r={9} fill={edge} />
        <circle
          cx={1300}
          cy={420}
          r={26}
          fill={green}
          stroke={edge}
          strokeWidth={4}
        />

        {/* Castor (verde) */}
        <g stroke={edge} strokeWidth={5}>
          <ellipse cx={1300} cy={800} rx={125} ry={90} fill={green} />
          <circle cx={1240} cy={740} r={62} fill={green} />
          <path d="M 1405 810 L 1560 770 L 1580 860 L 1410 870 Z" fill={red} />
        </g>
        <path
          d="M 1405 810 L 1560 770 L 1580 860 L 1410 870 Z"
          fill="url(#dots)"
        />
        <circle cx={1226} cy={730} r={9} fill={edge} />
        <rect
          x={1200}
          y={758}
          width={46}
          height={26}
          fill={hole}
          stroke={edge}
          strokeWidth={4}
        />
      </svg>
    </AbsoluteFill>
  );
};

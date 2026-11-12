import React from "react";
import { loadFont as loadPixel } from "@remotion/google-fonts/PressStart2P";

export const PIXEL_FONT = loadPixel("normal", {
  subsets: ["latin"],
}).fontFamily;

/** Tamaño del "píxel grande" del mundo (192 x 108 celdas en 1920 x 1080). */
export const PX = 10;
export const snap = (v: number) => Math.round(v / PX) * PX;

export const C = {
  sky: "#2b2d5f",
  skyDeep: "#1a1a3a",
  ink: "#1a1a2e",
  cream: "#f5ecd3",
  yellow: "#ffd23f",
  orange: "#ff8a3d",
  red: "#d62f2f",
  green: "#3fb36f",
  greenDark: "#1e6f4a",
  brick: "#b5532f",
  brickDark: "#7e3a1f",
  cyan: "#7fd1ff",
  pink: "#ffb4c0",
  gray: "#8c8fb0",
  brown: "#6b3f1d",
};

const PAL: Record<string, string> = {
  k: C.ink,
  B: "#6b3f1d",
  b: "#a8682e",
  w: C.cream,
  y: C.yellow,
  o: C.orange,
  O: "#c4561a",
  r: C.red,
  g: "#58c27d",
  G: "#1e6f4a",
  t: "#d9b27a",
  p: C.pink,
  c: C.cyan,
  h: "#e8b07a",
  d: "#5b3a24",
  s: "#6c5ce7",
  e: C.gray,
};

export type Rows = string[];

// ---------------------------------------------------------------- Personajes
export const OWL: Rows = [
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
export const OWL_BLINK: Record<number, string> = {
  5: ".BwwbbwbbwbbwwB.",
  6: ".BwwbbwbbwbbwwB.",
};
export const OWL_TALK: Record<number, string> = { 8: ".BbbbbbbkkbbbbB." };
export const OWL_DIZZY: Record<number, string> = {
  5: ".BwwkwwbbwwkwwB.",
  6: ".BwwwkwbbwkwwwB.",
};

export const SQUIRREL: Rows = [
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
export const SQUIRREL_TALK: Record<number, string> = { 6: "..bbbkkbbbbbBBBb" };

export const BEAVER: Rows = [
  "...kk....kk.....",
  "..kBBk..kBBk....",
  "..BBBBBBBBBB....",
  ".BBBkBBBBkBBB...",
  ".BBBBBwwBBBBB...",
  ".BBBBwwwwBBBB...",
  ".BBBBBwwBBBBB...",
  "..BBBBBBBBBB....",
  "..BBBBBBBBBBdddd",
  "..BBbbbbbbBBdddd",
  "..BBbbbbbbBBdddd",
  "..BBBBBBBBBBdddd",
  "..BB..BB..BB....",
];
export const BEAVER_TALK: Record<number, string> = { 6: ".BBBBBkkBBBBB..." };

export const FOX: Rows = [
  ".O............O.",
  ".Oo..........oO.",
  ".Ooo........ooO.",
  ".OoooOOOOOOoooO.",
  ".OooooooooooooO.",
  ".OowkoooooowkoO.",
  ".OoooowwwwoooOO.",
  "..OoooowkwoooO..",
  "...OooowwwwooO..",
  "...OoooooooooO..",
  "..OoowwwwwwooOoo",
  "..OooowwwwooOooo",
  "..OoooooooooOoOO",
  "...OO.OO.OO.OO..",
];
export const FOX_TALK: Record<number, string> = { 8: "...OooowkkwooO.." };

export const TURTLE: Rows = [
  "................",
  "......GGGG......",
  "....GGgGGgGG....",
  "...GgGGgGGgGGG..",
  ".tt.GGgGGgGGgG..",
  "tkttGgGGgGGgGGG.",
  "tttt.GGgGGgGGG..",
  ".tttGGGGGGGGGG..",
  "..t.tt.GGGG.tt..",
  "....tt......tt..",
];
export const TURTLE_BLINK: Record<number, string> = { 5: "ttttGgGGgGGgGGG." };

export const TEACHER: Rows = [
  "...dddd...",
  "..dddddd..",
  "..dhhhhd..",
  "..hkhhkh..",
  "..hhhhhh..",
  "...hpph...",
  "..rrrrrr..",
  ".hrrrrrrh.",
  ".hrrrrrrh.",
  "..rrrrrr..",
  "..rrrrrr..",
  "..rrrrrr..",
  "..dd..dd..",
  "..dd..dd..",
];

// ----------------------------------------------------------------- Iconos
export const HEART: Rows = [
  ".rr.rr.",
  "rrrrrrr",
  "rrrrrrr",
  ".rrrrr.",
  "..rrr..",
  "...r...",
];
export const STAR: Rows = [
  "...y...",
  "...y...",
  "yyyyyyy",
  ".yyyyy.",
  "..yyy..",
  ".yy.yy.",
  ".y...y.",
];
export const BOOK: Rows = [
  "bbbbbbb.",
  "bwwwwwb.",
  "bwkkkwb.",
  "bwwwwwb.",
  "bwkkkwb.",
  "bwwwwwb.",
  "bbbbbbbb",
];
export const WRENCH: Rows = [
  ".ee..ee.",
  "ee.ee.ee",
  "e..ee..e",
  ".eeee...",
  "..ee....",
  "..ee....",
  ".eeee...",
  ".eeee...",
];
export const SCROLL: Rows = [
  ".wwwwwww.",
  "wkkkkkkkw",
  ".wwwwwww.",
  ".wkkkkkw.",
  ".wwwwwww.",
  ".wkkkkkw.",
  ".wwwwwww.",
  "wwwwwwwww",
];
export const CAL: Rows = [
  "rrrrrrrrr",
  "rwwwwwwwr",
  "wkwkwkwkw",
  "wwwwwwwww",
  "wkwkwkwkw",
  "wwwwwwwww",
  "wkwkwkwkw",
  "wwwwwwwww",
];
export const DOC: Rows = [
  "wwwwww..",
  "wkkkkw..",
  "wwwwwww.",
  "wkkkkkw.",
  "wwwwwww.",
  "wkkkkkw.",
  "wwwwwww.",
  "wwwwwwww",
];
export const LOCK: Rows = [
  "..yyyy..",
  ".y....y.",
  ".y....y.",
  "yyyyyyyy",
  "yyykkyyy",
  "yyykkyyy",
  "yyyyyyyy",
];
export const CROSS: Rows = [
  "rr...rr",
  ".rr.rr.",
  "..rrr..",
  "..rrr..",
  ".rr.rr.",
  "rr...rr",
];
export const CHECK: Rows = [
  "......g",
  ".....gg",
  "g...gg.",
  "gg.gg..",
  ".ggg...",
  "..g....",
];
export const HAND: Rows = [
  "..ww....",
  "..wkw...",
  "..wkw...",
  "..wkwww.",
  ".wwkwkwk",
  "wwwwwwww",
  "wwwwwwww",
  ".wwwwww.",
  "..wwww..",
];

// Tomas (enchufes): cada animal tiene la suya hasta que llega el MCP.
export const PLUG_SQUARE: Rows = [
  "kkkkkkk",
  "kyyyyyk",
  "kyyyyyk",
  "kyyyyyk",
  "kyyyyyk",
  "kyyyyyk",
  "kkkkkkk",
];
export const PLUG_ROUND: Rows = [
  "..kkk..",
  ".kyyyk.",
  "kyyyyyk",
  "kyyyyyk",
  "kyyyyyk",
  ".kyyyk.",
  "..kkk..",
];
export const PLUG_TRI: Rows = [
  "...k...",
  "..kyk..",
  "..kyk..",
  ".kyyyk.",
  ".kyyyk.",
  "kyyyyyk",
  "kkkkkkk",
];
export const PLUG_DIAMOND: Rows = [
  "...k...",
  "..kyk..",
  ".kyyyk.",
  "kyyyyyk",
  ".kyyyk.",
  "..kyk..",
  "...k...",
];
export const PLUG_HEX: Rows = [
  "..kkk..",
  ".kyyyk.",
  "kyyyyyk",
  "kyyyyyk",
  "kyyyyyk",
  ".kyyyk.",
  "..kkk..",
];

const colorOf = (ch: string) => PAL[ch] ?? "#ff00ff";

type SpriteProps = {
  rows: Rows;
  x: number;
  y: number;
  s?: number;
  flip?: boolean;
  /** Sustituye filas (parpadeo, boca abierta...). */
  patch?: Record<number, string>;
  opacity?: number;
  /** Teñido: cambia todos los colores por uno (flash). */
  tint?: string;
};

/** Dibuja un sprite por filas; x,y es la esquina superior izquierda. */
export const Sprite: React.FC<SpriteProps> = ({
  rows,
  x,
  y,
  s = 20,
  flip,
  patch,
  opacity = 1,
  tint,
}) => {
  const w = Math.max(...rows.map((r) => r.length));
  return (
    <g
      opacity={opacity}
      transform={flip ? `translate(${x * 2 + w * s} 0) scale(-1 1)` : undefined}
    >
      {rows.flatMap((row0, j) => {
        const row = patch?.[j] ?? row0;
        return row
          .split("")
          .map((ch, i) =>
            ch === "." ? null : (
              <rect
                key={`${i}-${j}`}
                x={x + i * s}
                y={y + j * s}
                width={s}
                height={s}
                fill={tint ?? colorOf(ch)}
              />
            ),
          );
      })}
    </g>
  );
};

export const spriteSize = (rows: Rows, s: number) => ({
  w: Math.max(...rows.map((r) => r.length)) * s,
  h: rows.length * s,
});

// ------------------------------------------------------------------- Texto
export const PText: React.FC<{
  text: string;
  x: number;
  y: number;
  size?: number;
  color?: string;
  anchor?: "start" | "middle" | "end";
  shadow?: string | null;
  opacity?: number;
  chars?: number;
}> = ({
  text,
  x,
  y,
  size = 32,
  color = C.cream,
  anchor = "start",
  shadow = C.ink,
  opacity = 1,
  chars,
}) => {
  const shown =
    chars === undefined ? text : text.slice(0, Math.max(0, Math.floor(chars)));
  const off = Math.max(3, Math.round(size / 8));
  return (
    <g
      opacity={opacity}
      fontFamily={PIXEL_FONT}
      fontSize={size}
      textAnchor={anchor}
    >
      {shadow ? (
        <text x={x + off} y={y + off} fill={shadow}>
          {shown}
        </text>
      ) : null}
      <text x={x} y={y} fill={color}>
        {shown}
      </text>
    </g>
  );
};

/** Caja de diálogo estilo RPG con borde doble, nombre y cola corta que apunta a `anchor` (cabeza del que habla). */
export const Dialog: React.FC<{
  w: number;
  lines: string[];
  frame: number;
  start: number;
  speed?: number;
  speaker: string;
  color: string;
  size?: number;
  anchor: { x: number; y: number };
  opacity?: number;
}> = ({
  w,
  lines,
  frame,
  start,
  speed = 2,
  speaker,
  color,
  size = 30,
  anchor,
  opacity = 1,
}) => {
  const lineH = size * 1.7;
  const h = lines.length * lineH + 70;
  const x = Math.max(30, Math.min(1890 - w, anchor.x - w / 2));
  const y = anchor.y - 56 - h;
  const local = frame - start;
  const vis = Math.max(0, Math.min(1, local / 6));
  if (vis <= 0) return null;
  const tx = Math.max(x + 50, Math.min(x + w - 50, anchor.x));
  let remaining = local / speed;
  return (
    <g opacity={opacity * vis} transform={`translate(0 ${(1 - vis) * 14})`}>
      <polygon
        points={`${tx - 22},${y + h + 6} ${tx + 22},${y + h + 6} ${anchor.x},${anchor.y - 10}`}
        fill={C.cream}
      />
      <rect x={x - 8} y={y - 8} width={w + 16} height={h + 16} fill={C.ink} />
      <rect x={x} y={y} width={w} height={h} fill={C.cream} />
      <rect x={x + 8} y={y + 8} width={w - 16} height={h - 16} fill={C.ink} />
      <rect
        x={x + 24}
        y={y - 22}
        width={speaker.length * size * 0.6 + 36}
        height={size + 22}
        fill={color}
        stroke={C.ink}
        strokeWidth={6}
      />
      <PText
        text={speaker}
        x={x + 42}
        y={y + size - 2}
        size={size * 0.6}
        color={C.ink}
        shadow={null}
      />
      {lines.map((ln, i) => {
        const n = Math.max(0, Math.min(ln.length, remaining));
        remaining -= ln.length;
        return (
          <PText
            key={i}
            text={ln}
            x={x + 32}
            y={y + 66 + i * lineH}
            size={size}
            color={C.cream}
            chars={n}
          />
        );
      })}
    </g>
  );
};

/** Cable de píxeles a lo largo de una polilínea de puntos; `pulse` (0-1) recorre un destello. */
export const Cable: React.FC<{
  points: [number, number][];
  color?: string;
  progress?: number;
  pulse?: number;
  width?: number;
}> = ({ points, color = C.yellow, progress = 1, pulse, width = PX }) => {
  const cells: [number, number][] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const [x0, y0] = points[i];
    const [x1, y1] = points[i + 1];
    const n = Math.max(
      1,
      Math.round(Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) / PX),
    );
    for (let k = 0; k < n; k++) {
      cells.push([
        snap(x0 + ((x1 - x0) * k) / n),
        snap(y0 + ((y1 - y0) * k) / n),
      ]);
    }
  }
  cells.push(points[points.length - 1].map(snap) as [number, number]);
  const upto = Math.floor(cells.length * progress);
  const pi = pulse === undefined ? -99 : Math.floor(cells.length * pulse);
  return (
    <g>
      {cells.slice(0, upto).map(([x, y], i) => (
        <rect
          key={i}
          x={x}
          y={y}
          width={width}
          height={width}
          fill={Math.abs(i - pi) < 3 ? C.cream : color}
        />
      ))}
    </g>
  );
};

/** Chispa de píxeles (cruz) que parpadea. */
export const Spark: React.FC<{
  x: number;
  y: number;
  size?: number;
  color?: string;
  opacity?: number;
}> = ({ x, y, size = 10, color = C.yellow, opacity = 1 }) => (
  <g opacity={opacity} fill={color}>
    <rect x={x - size / 2} y={y - size * 2} width={size} height={size * 4} />
    <rect x={x - size * 2} y={y - size / 2} width={size * 4} height={size} />
    <rect
      x={x - size}
      y={y - size}
      width={size * 2}
      height={size * 2}
      fill={C.cream}
    />
  </g>
);

/** Suelo de ladrillos (y = borde superior). */
export const Ground: React.FC<{ y?: number }> = ({ y = 900 }) => (
  <g>
    {Array.from({ length: 6 }, (_, r) =>
      Array.from({ length: 36 }, (_, c) => (
        <rect
          key={`${r}-${c}`}
          x={c * 60 - (r % 2) * 30}
          y={y + r * 36}
          width={56}
          height={32}
          fill={r === 0 ? C.green : r % 2 ? C.brick : C.brickDark}
        />
      )),
    )}
    <rect x={0} y={y - 8} width={1920} height={8} fill="#58c27d" />
  </g>
);

export const Stars: React.FC<{ frame: number; count?: number }> = ({
  frame,
  count = 40,
}) => (
  <g fill={C.cream}>
    {Array.from({ length: count }, (_, i) => {
      const x = (i * 197 + 40) % 1900;
      const y = (i * 83 + 20) % 560;
      const tw = Math.floor((frame / 12 + i) % 4) === 0;
      const big = i % 3 === 0;
      return (
        <rect
          key={i}
          x={x}
          y={y}
          width={big ? 10 : 6}
          height={big ? 10 : 6}
          opacity={tw ? 0.3 : 0.9}
        />
      );
    })}
  </g>
);

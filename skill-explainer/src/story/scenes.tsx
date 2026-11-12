import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import {
  BOOK,
  C,
  CAL,
  CROSS,
  Cable,
  Dialog,
  DOC,
  HAND,
  HEART,
  LOCK,
  PLUG_DIAMOND,
  PLUG_HEX,
  PLUG_ROUND,
  PLUG_SQUARE,
  PLUG_TRI,
  PText,
  SCROLL,
  Spark,
  Sprite,
  STAR,
  WRENCH,
  CHECK,
  snap,
} from "./pixel";
import {
  Actor,
  type ActorName,
  Banner,
  GROUND,
  Night,
  actorSize,
  activeLine,
  isTalking,
} from "./stage";
import { EV, lineById, STORY_TEXTS as T } from "./script";

const ease = (t: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const prog = (f: number, a: number, b: number) => clamp((f - a) / (b - a));

const Svg: React.FC<{ children: React.ReactNode; shake?: number }> = ({
  children,
  shake = 0,
}) => (
  <AbsoluteFill>
    <svg
      width={1920}
      height={1080}
      viewBox="0 0 1920 1080"
      style={{ transform: `translate(${shake}px, 0)` }}
    >
      {children}
    </svg>
  </AbsoluteFill>
);

const VOICE_COLOR: Record<string, string> = {
  owl: C.yellow,
  squirrel: C.orange,
  beaver: C.cyan,
  fox: C.orange,
  turtle: C.green,
  teacher: C.pink,
};

/** Cabeza (ancla del globo) de un personaje que está de pie en el suelo. */
const head = (name: ActorName, x: number, dy = 0) => {
  const { w, h } = actorSize(name);
  return { x: x + w / 2, y: GROUND - h - 10 + dy };
};

/** Muestra el diálogo activo de un bloque, anclado a la cabeza de quien habla. */
const Talk: React.FC<{
  frame: number;
  ids: string[];
  at: Partial<Record<string, { x: number; y: number }>>;
}> = ({ frame, ids, at }) => {
  const id = activeLine(frame, ids);
  if (!id) return null;
  const l = lineById(id);
  const anchor = at[l.voice];
  if (!anchor) return null;
  const width = Math.max(...l.lines.map((s) => s.length)) * 30 + 64;
  return (
    <Dialog
      w={width}
      lines={l.lines}
      frame={frame}
      start={l.start}
      speaker={l.speaker}
      color={VOICE_COLOR[l.voice]}
      anchor={anchor}
    />
  );
};

const Socket: React.FC<{
  x: number;
  y: number;
  shape: "square" | "round" | "tri" | "diamond" | "hex";
  filled?: boolean;
  glow?: number;
}> = ({ x, y, shape, filled, glow = 0 }) => {
  const rows = {
    square: PLUG_SQUARE,
    round: PLUG_ROUND,
    tri: PLUG_TRI,
    diamond: PLUG_DIAMOND,
    hex: PLUG_HEX,
  }[shape];
  return (
    <g>
      {glow > 0 ? (
        <rect
          x={x - 20}
          y={y - 20}
          width={110}
          height={110}
          fill={C.yellow}
          opacity={0.25 * glow}
        />
      ) : null}
      <rect x={x - 10} y={y - 10} width={90} height={90} fill={C.ink} />
      <Sprite
        rows={rows}
        x={x}
        y={y}
        s={10}
        tint={filled ? undefined : "#4b4f86"}
      />
    </g>
  );
};

// ---------------------------------------------------------------- 1 · Gancho
export const P1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const t = T.s1;
  const lockHit = frame >= EV.s1.lock && frame < EV.s1.lock + 10;
  const shake = lockHit ? (frame % 2 === 0 ? 8 : -8) : 0;
  const titleChars = (frame - EV.s1.title) / 2;
  const orbit = frame / 26;
  const icons = [BOOK, STAR, SCROLL, CAL];
  return (
    <Svg shake={shake}>
      <Night frame={frame} />
      {/* Árbol */}
      <rect x={120} y={380} width={180} height={520} fill={C.brown} />
      <rect x={120} y={380} width={40} height={520} fill="#4a2a12" />
      {[
        [40, 180, 360, 220],
        [100, 110, 240, 100],
        [20, 260, 80, 120],
        [330, 240, 70, 140],
      ].map(([x, y, w, h], i) => (
        <rect
          key={i}
          x={x}
          y={y}
          width={w}
          height={h}
          fill={i % 2 ? "#2f8f5a" : C.greenDark}
        />
      ))}
      {/* Caja de cristal */}
      <rect
        x={480}
        y={330}
        width={480}
        height={570}
        fill={C.cyan}
        opacity={0.12}
      />
      <rect
        x={480}
        y={330}
        width={480}
        height={570}
        fill="none"
        stroke={C.cyan}
        strokeWidth={10}
      />
      <rect
        x={510}
        y={360}
        width={20}
        height={120}
        fill={C.cream}
        opacity={0.5}
      />
      <rect
        x={510}
        y={500}
        width={20}
        height={20}
        fill={C.cream}
        opacity={0.5}
      />
      {icons.map((rows, k) => {
        const a = orbit + (k * Math.PI) / 2;
        return (
          <Sprite
            key={k}
            rows={rows}
            x={snap(710 + 170 * Math.cos(a) - 24)}
            y={snap(520 + 110 * Math.sin(a) - 24)}
            s={6}
          />
        );
      })}
      <Actor
        name="owl"
        x={540}
        frame={frame}
        talking={isTalking(frame, "owl", "s1")}
      />
      <Sprite
        rows={LOCK}
        x={680}
        y={290}
        s={10}
        tint={lockHit ? C.red : undefined}
      />
      {/* Amigos fuera */}
      <Actor name="squirrel" x={1150} frame={frame} phase={6} />
      <Actor name="beaver" x={1430} frame={frame} phase={12} />
      {[1040, 1090].map((x, i) => (
        <PText
          key={i}
          text="?"
          x={x}
          y={700 + (Math.floor(frame / 10 + i) % 2) * 10}
          size={56}
          color={C.yellow}
        />
      ))}
      <PText
        text={t.title}
        x={960}
        y={170}
        size={72}
        color={C.yellow}
        anchor="middle"
        chars={titleChars}
      />
      <Talk
        frame={frame}
        ids={["s1a", "s1b"]}
        at={{ owl: { x: 700, y: 400 } }}
      />
      <Banner text={t.caption} frame={frame} start={118} size={26} />
    </Svg>
  );
};

// ------------------------------------------------------------- 2 · El problema
export const P2Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const e = EV.s2;
  const owlX = 240;
  const owlPort = { x: owlX + 330, y: GROUND - 140 };
  const sqIn = ease(prog(frame, e.squirrelIn, e.squirrelIn + 36));
  const sqX = 1700 - 720 * sqIn;
  const bvIn = ease(prog(frame, e.beaverIn, e.beaverIn + 36));
  const bvX = 1900 - 480 * bvIn;

  // Enchufes que intentan entrar y rebotan
  const plugPos = (try_: number, bounce: number, from: number) => {
    const go = ease(prog(frame, try_ - 24, try_));
    const back = ease(prog(frame, bounce, bounce + 18));
    return owlPort.x + 40 + (from - owlPort.x - 40) * (1 - go + back * go);
  };
  const sqPlugX =
    frame < e.squirrelIn + 36 ? sqX - 40 : plugPos(e.try1, e.bounce1, sqX - 40);
  const bvPlugX =
    frame < e.beaverIn + 36 ? bvX - 40 : plugPos(e.try2, e.bounce2, bvX - 40);
  const hit1 = frame >= e.try1 && frame < e.bounce1;
  const hit2 = frame >= e.try2 && frame < e.bounce2;
  const shake =
    (frame >= e.try1 && frame < e.try1 + 6) ||
    (frame >= e.try2 && frame < e.try2 + 6)
      ? frame % 2
        ? 7
        : -7
      : 0;
  const tangleP = prog(frame, e.tangle, e.tangle + 60);

  // Maraña: polilíneas pseudoaleatorias deterministas
  const tangle = Array.from({ length: 9 }, (_, i) => {
    const r = (n: number) =>
      (((Math.sin(i * 91.7 + n * 13.1) * 43758.5453) % 1) + 1) % 1;
    const x0 = 520 + r(1) * 500;
    const y0 = 700 + r(2) * 160;
    return {
      pts: [
        [x0, y0],
        [x0 + 120 + r(3) * 200, y0 - 120 - r(4) * 160],
        [x0 + 60 + r(5) * 300, y0 + 60 * r(6)],
        [x0 - 40 + r(7) * 260, y0 - 60 - r(8) * 120],
      ] as [number, number][],
      color: [C.yellow, C.red, C.cyan, C.pink, C.orange][i % 5],
    };
  });

  return (
    <Svg shake={shake}>
      <Night frame={frame} />
      {/* Cables de las herramientas */}
      <Cable
        points={[
          [sqX + 50, 800],
          [sqX - 20, 840],
          [sqPlugX + 30, 840],
        ]}
        color={C.yellow}
        progress={sqIn}
      />
      <Cable
        points={[
          [bvX + 50, 820],
          [bvX - 20, 850],
          [bvPlugX + 30, 850],
        ]}
        color={C.cyan}
        progress={bvIn}
      />
      {tangle.map((c, i) => (
        <Cable
          key={i}
          points={c.pts}
          color={c.color}
          progress={clamp(tangleP * 1.6 - i * 0.08)}
        />
      ))}
      {/* Búho con su puerto de rombo */}
      <Actor
        name="owl"
        x={owlX}
        frame={frame}
        dizzy={frame >= e.dizzy}
        talking={isTalking(frame, "owl", "s2")}
      />
      <Socket x={owlPort.x} y={owlPort.y} shape="diamond" />
      {/* Amigos con sus enchufes */}
      <Actor
        name="squirrel"
        x={sqX}
        frame={frame}
        talking={isTalking(frame, "squirrel", "s2")}
      />
      <Actor
        name="beaver"
        x={bvX}
        frame={frame}
        talking={isTalking(frame, "beaver", "s2")}
        phase={9}
      />
      <Sprite rows={PLUG_SQUARE} x={snap(sqPlugX)} y={810} s={10} />
      <Sprite rows={PLUG_ROUND} x={snap(bvPlugX)} y={820} s={10} />
      {(hit1 || (frame >= e.bounce1 && frame < e.bounce1 + 22)) &&
      frame >= e.try1 ? (
        <Sprite rows={CROSS} x={owlPort.x + 6} y={owlPort.y - 70} s={10} />
      ) : null}
      {(hit2 || (frame >= e.bounce2 && frame < e.bounce2 + 22)) &&
      frame >= e.try2 ? (
        <Sprite rows={CROSS} x={owlPort.x + 6} y={owlPort.y - 70} s={10} />
      ) : null}
      {(hit1 || hit2) && frame % 6 < 3 ? (
        <Spark x={owlPort.x + 40} y={owlPort.y + 40} color={C.red} />
      ) : null}
      {frame >= e.dizzy
        ? [0, 1, 2].map((k) => {
            const a = frame / 6 + (k * Math.PI * 2) / 3;
            return (
              <Sprite
                key={k}
                rows={STAR}
                x={snap(owlX + 130 + 100 * Math.cos(a))}
                y={snap(GROUND - 400 + 24 * Math.sin(a))}
                s={6}
              />
            );
          })
        : null}
      <Talk
        frame={frame}
        ids={["s2a", "s2b", "s2c"]}
        at={{
          squirrel: head("squirrel", sqX),
          beaver: head("beaver", bvX),
          owl: head("owl", owlX),
        }}
      />
      <Banner
        text={T.s2.caption}
        frame={frame}
        start={e.caption}
        size={28}
        color={C.red}
      />
    </Svg>
  );
};

// -------------------------------------------------------------- 3 · La idea
export const P3Idea: React.FC = () => {
  const frame = useCurrentFrame();
  const e = EV.s3;
  const owlX = 700;
  const sqX = 1120;
  const bvX = 1430;
  const turtleX = -300 + 360 * ease(prog(frame, e.turtleIn, e.turtleIn + 34));
  const portY = GROUND - 90;
  const owlPort = { x: owlX + 125, y: portY };
  const sqPort = { x: sqX + 90, y: portY };
  const bvPort = { x: bvX + 90, y: portY };
  const connected = (at: number) => frame >= at;
  const fly = prog(frame, e.fly, e.plugOwl);
  const flyX = turtleX + 200 + (owlPort.x + 10 - (turtleX + 200)) * ease(fly);
  const flyY =
    GROUND -
    330 +
    (portY + 10 - (GROUND - 330)) * ease(fly) -
    160 * Math.sin(Math.PI * fly);
  const cable = ease(prog(frame, e.cableOut, e.plugSq));
  const pulse = (frame % 40) / 40;
  const titleScale = ease(prog(frame, e.title, e.title + 10));
  const flash = frame >= e.plugOwl && frame < e.plugOwl + 8;
  return (
    <Svg>
      <Night frame={frame} />
      {/* Cable universal a lo largo del suelo */}
      <Cable
        points={[
          [owlPort.x + 40, portY + 35],
          [sqPort.x + 40, portY + 35],
        ]}
        progress={cable}
        pulse={cable > 0.99 ? pulse : undefined}
      />
      <Cable
        points={[
          [sqPort.x + 40, portY + 35],
          [bvPort.x + 40, portY + 35],
        ]}
        progress={frame >= e.plugSq ? ease(prog(frame, e.plugSq, e.plugBv)) : 0}
        pulse={frame > e.plugBv ? pulse : undefined}
      />
      <Socket
        x={owlPort.x}
        y={portY}
        shape="hex"
        filled={connected(e.plugOwl)}
        glow={flash ? 1 : 0}
      />
      <Socket x={sqPort.x} y={portY} shape="hex" filled={connected(e.plugSq)} />
      <Socket x={bvPort.x} y={portY} shape="hex" filled={connected(e.plugBv)} />
      <Actor name="owl" x={owlX} frame={frame} />
      <Actor name="squirrel" x={sqX} frame={frame} phase={6} />
      <Actor name="beaver" x={bvX} frame={frame} phase={12} />
      <Actor
        name="turtle"
        x={turtleX}
        frame={frame}
        talking={isTalking(frame, "turtle", "s3")}
      />
      {/* El enchufe dorado MCP que trae la tortuga */}
      {frame >= e.turtleIn + 30 && frame < e.plugOwl ? (
        <g>
          <rect
            x={snap(flyX) - 20}
            y={snap(frame < e.fly ? GROUND - 330 : flyY) - 20}
            width={110}
            height={110}
            fill={C.yellow}
            opacity={0.18 + 0.1 * Math.sin(frame / 4)}
          />
          <Sprite
            rows={PLUG_HEX}
            x={snap(flyX)}
            y={snap(frame < e.fly ? GROUND - 330 : flyY)}
            s={10}
          />
        </g>
      ) : null}
      {flash ? <Spark x={owlPort.x + 35} y={portY + 35} size={14} /> : null}
      {[e.plugSq, e.plugBv].map((at, i) =>
        frame >= at && frame < at + 8 ? (
          <Spark
            key={i}
            x={(i ? bvPort.x : sqPort.x) + 35}
            y={portY + 35}
            size={14}
          />
        ) : null,
      )}
      {/* Título MCP */}
      {frame >= e.title ? (
        <g
          transform={`translate(960 330) scale(${titleScale}) translate(-960 -330)`}
        >
          <PText
            text={T.s3.title}
            x={960}
            y={330}
            size={190}
            color={C.yellow}
            anchor="middle"
          />
        </g>
      ) : null}
      <PText
        text={T.s3.sub}
        x={960}
        y={400}
        size={34}
        color={C.cream}
        anchor="middle"
        chars={(frame - e.subtitle) / 1.2}
      />
      <Talk
        frame={frame}
        ids={["s3a"]}
        at={{ turtle: head("turtle", turtleX) }}
      />
      <Banner text={T.s3.c1} frame={frame} start={e.caption1} size={34} />
      <Banner
        text={T.s3.c2}
        frame={frame}
        start={e.caption2}
        size={34}
        y={1050}
        color={C.cyan}
      />
    </Svg>
  );
};

// -------------------------------------------------------------- 4 · Cómo funciona
const Tag: React.FC<{
  x: number;
  y: number;
  text: string;
  color: string;
  frame: number;
  start: number;
}> = ({ x, y, text, color, frame, start }) => {
  const p = clamp((frame - start) / 8);
  if (p <= 0) return null;
  const lines = text.split("|");
  const w = Math.max(...lines.map((l) => l.length)) * 18 + 36;
  const h = lines.length * 30 + 22;
  return (
    <g opacity={p}>
      <rect
        x={x - w / 2 - 6}
        y={y - 40}
        width={w + 12}
        height={h + 12}
        fill={C.ink}
      />
      <rect x={x - w / 2} y={y - 34} width={w} height={h} fill={color} />
      {lines.map((l, i) => (
        <PText
          key={i}
          text={l}
          x={x}
          y={y - 6 + i * 30}
          size={18}
          color={C.ink}
          shadow={null}
          anchor="middle"
        />
      ))}
    </g>
  );
};

export const P4How: React.FC = () => {
  const frame = useCurrentFrame();
  const e = EV.s4;
  const owlX = 150;
  const sqX = 700;
  const bvX = 980;
  const portY = GROUND - 90;
  const pulseT = (frame % 50) / 50;
  const talkOwl = isTalking(frame, "owl", "s4");
  const cards = T.s4.cards;
  const cardIcons = [WRENCH, DOC, SCROLL];
  const cardStarts = [e.card1, e.card2, e.card3];
  const cardColors = [C.orange, C.cyan, C.pink];
  return (
    <Svg>
      <Night frame={frame} />
      <Cable
        points={[
          [owlX + 190, portY + 35],
          [bvX + 130, portY + 35],
        ]}
        pulse={pulseT}
      />
      <Socket x={owlX + 155} y={portY} shape="hex" filled />
      <Socket x={sqX + 90} y={portY} shape="hex" filled />
      <Socket x={bvX + 90} y={portY} shape="hex" filled />
      <Actor name="owl" x={owlX} frame={frame} talking={talkOwl} />
      <Actor
        name="squirrel"
        x={sqX}
        frame={frame}
        talking={isTalking(frame, "squirrel", "s4")}
        phase={6}
      />
      <Actor
        name="beaver"
        x={bvX}
        frame={frame}
        talking={isTalking(frame, "beaver", "s4")}
        phase={12}
      />
      <Tag
        x={owlX + 160}
        y={GROUND + 58}
        text={T.s4.owlTag}
        color={C.yellow}
        frame={frame}
        start={e.tagOwl}
      />
      <Tag
        x={sqX + 128}
        y={GROUND + 58}
        text={T.s4.sqTag}
        color={C.orange}
        frame={frame}
        start={e.tagSq}
      />
      <Tag
        x={bvX + 128}
        y={GROUND + 58}
        text={T.s4.bvTag}
        color={C.cyan}
        frame={frame}
        start={e.tagBv}
      />
      {/* Tarjetas: lo que ofrece un servidor MCP */}
      {cards.map((c, i) => {
        const p = ease(prog(frame, cardStarts[i], cardStarts[i] + 12));
        if (p <= 0) return null;
        const y = 120 + i * 190;
        return (
          <g
            key={c.title}
            opacity={p}
            transform={`translate(${(1 - p) * 120} 0)`}
          >
            <rect
              x={1440 - 8}
              y={y - 8}
              width={496}
              height={176}
              fill={C.ink}
            />
            <rect
              x={1380}
              y={y}
              width={480}
              height={160}
              fill={cardColors[i]}
            />
            <rect x={1448} y={y + 8} width={424} height={144} fill={C.sky} />
            <Sprite rows={cardIcons[i]} x={1466} y={y + 44} s={8} />
            <PText
              text={c.title}
              x={1520}
              y={y + 62}
              size={26}
              color={cardColors[i]}
            />
            <PText
              text={c.sub}
              x={1520}
              y={y + 112}
              size={16}
              color={C.cream}
            />
          </g>
        );
      })}
      <Talk
        frame={frame}
        ids={["s4a", "s4b", "s4c"]}
        at={{
          owl: head("owl", owlX),
          squirrel: head("squirrel", sqX),
          beaver: head("beaver", bvX),
        }}
      />
    </Svg>
  );
};

// ------------------------------------------------------ 5 · Ejemplo de la maestra
export const P5Example: React.FC = () => {
  const frame = useCurrentFrame();
  const e = EV.s5;
  const tX = 40;
  const owlX = 380;
  const sqX = 860;
  const bvX = 1150;
  const turtleX = 1560;
  const portY = GROUND - 90;
  const busY = portY + 35;
  const turtleIn = ease(prog(frame, e.turtleIn, e.turtleIn + 26));
  // Paquete (mensaje) por el cable
  const leg = (a: number, b: number, fromX: number, toX: number) =>
    frame >= a && frame < b ? fromX + (toX - fromX) * prog(frame, a, b) : null;
  const p1 = leg(e.toSquirrel, e.backSquirrel, owlX + 190, sqX + 128);
  const p2 = leg(e.backSquirrel, e.backSquirrel + 22, sqX + 128, owlX + 190);
  const p3 = leg(e.toBeaver, e.toBeaver + 36, owlX + 190, bvX + 128);
  const askStart = e.askPermission;
  const granted = frame >= e.granted;
  const clickPress = frame >= e.click && frame < e.click + 6;
  // cursor mano hacia SÍ
  const cx = 1300 - 280 * ease(prog(frame, e.cursorMove, e.click));
  const cy = 560 + 40 * ease(prog(frame, e.cursorMove, e.click));
  const showAsk = frame >= askStart && frame < e.board + 4;
  const boardP = ease(prog(frame, e.board, e.board + 14));
  const days = T.s5.days;
  return (
    <Svg>
      <Night frame={frame} moon={false} />
      <Cable
        points={[
          [owlX + 190, busY],
          [bvX + 130, busY],
        ]}
        pulse={(frame % 50) / 50}
      />
      <Socket x={owlX + 155} y={portY} shape="hex" filled />
      <Socket x={sqX + 90} y={portY} shape="hex" filled />
      <Socket x={bvX + 90} y={portY} shape="hex" filled />
      <Actor
        name="teacher"
        x={tX}
        frame={frame}
        talking={isTalking(frame, "teacher", "s5")}
      />
      <Actor
        name="owl"
        x={owlX}
        frame={frame}
        talking={isTalking(frame, "owl", "s5")}
        lift={0}
      />
      <Actor name="squirrel" x={sqX} frame={frame} phase={6} />
      <Actor name="beaver" x={bvX} frame={frame} phase={12} />
      <Actor
        name="turtle"
        x={turtleX + 400 * (1 - turtleIn)}
        frame={frame}
        talking={isTalking(frame, "turtle", "s5")}
      />
      {/* Paquetes de mensajes */}
      {p1 !== null ? (
        <Sprite rows={STAR} x={snap(p1)} y={busY - 50} s={6} />
      ) : null}
      {p2 !== null ? (
        <Sprite rows={CAL} x={snap(p2)} y={busY - 70} s={7} />
      ) : null}
      {p3 !== null ? (
        <Sprite rows={DOC} x={snap(p3)} y={busY - 70} s={7} />
      ) : null}
      {frame >= e.backSquirrel + 22 && frame < e.board ? (
        <Sprite rows={CAL} x={owlX + 120} y={GROUND - 440} s={7} />
      ) : null}
      {frame >= e.toBeaver + 36 && frame < e.board ? (
        <Sprite rows={DOC} x={owlX + 220} y={GROUND - 440} s={7} />
      ) : null}
      {/* Permiso */}
      {showAsk ? (
        <g
          opacity={clamp((frame - askStart) / 8)}
          transform="translate(0 -230)"
        >
          <rect x={1042} y={332} width={716} height={336} fill={C.ink} />
          <rect x={1050} y={340} width={700} height={320} fill={C.cream} />
          <rect x={1058} y={348} width={684} height={304} fill={C.sky} />
          <Sprite
            rows={LOCK}
            x={1090}
            y={380}
            s={8}
            tint={granted ? C.green : undefined}
          />
          <PText
            text={T.s5.permission}
            x={1200}
            y={430}
            size={34}
            color={C.yellow}
          />
          <rect
            x={1120}
            y={500}
            width={200}
            height={90}
            fill={clickPress ? "#2f8f5a" : C.green}
            stroke={C.ink}
            strokeWidth={8}
          />
          <PText
            text={T.s5.yes}
            x={1220}
            y={560}
            size={40}
            color={C.ink}
            shadow={null}
            anchor="middle"
          />
          <rect
            x={1400}
            y={500}
            width={200}
            height={90}
            fill={C.red}
            stroke={C.ink}
            strokeWidth={8}
          />
          <PText
            text={T.s5.no}
            x={1500}
            y={560}
            size={40}
            color={C.cream}
            anchor="middle"
          />
          <Sprite rows={HAND} x={snap(cx)} y={snap(cy)} s={10} />
          {clickPress ? <Spark x={1220} y={545} size={10} /> : null}
        </g>
      ) : null}
      {frame >= askStart && frame < e.granted + 30 ? (
        <Talk
          frame={frame}
          ids={["s5c"]}
          at={{ turtle: head("turtle", turtleX) }}
        />
      ) : null}
      {frame < e.askPermission ? (
        <Talk
          frame={frame}
          ids={["s5a", "s5b"]}
          at={{ teacher: head("teacher", tX), owl: head("owl", owlX) }}
        />
      ) : null}
      {granted && frame < e.board ? (
        <Banner
          text={T.s5.caption}
          frame={frame}
          start={e.granted}
          size={26}
          color={C.green}
        />
      ) : null}
      {/* Plan de la semana */}
      {frame >= e.board ? (
        <g opacity={boardP} transform={`translate(0 ${(1 - boardP) * -40})`}>
          <rect x={892} y={72} width={856} height={456} fill={C.ink} />
          <rect x={900} y={80} width={840} height={440} fill={C.cream} />
          <rect x={908} y={88} width={824} height={424} fill={C.sky} />
          <PText
            text={T.s5.board}
            x={1320}
            y={150}
            size={34}
            color={C.yellow}
            anchor="middle"
          />
          {days.map((d, i) => {
            const st = e.board + 12 + i * 8;
            const pp = clamp((frame - st) / 8);
            return (
              <g key={d} opacity={pp}>
                <Sprite rows={CHECK} x={940} y={200 + i * 62} s={6} />
                <PText
                  text={d}
                  x={1000}
                  y={232 + i * 62}
                  size={24}
                  color={C.cream}
                  chars={(frame - st) * 1.5}
                />
              </g>
            );
          })}
        </g>
      ) : null}
      {frame >= lineById("s5d").start ? (
        <Talk frame={frame} ids={["s5d"]} at={{ owl: head("owl", owlX) }} />
      ) : null}
      {frame >= e.heart ? (
        <>
          <Sprite
            rows={HEART}
            x={tX + 60}
            y={GROUND - 400 - ((frame - e.heart) % 40)}
            s={6}
          />
          <Sprite
            rows={HEART}
            x={tX + 130}
            y={GROUND - 380 - ((frame - e.heart + 18) % 40)}
            s={5}
          />
        </>
      ) : null}
    </Svg>
  );
};

// ------------------------------------------------------ 6 · Un amigo nuevo
export const P6Friend: React.FC = () => {
  const frame = useCurrentFrame();
  const e = EV.s6;
  const owlX = 330;
  const sqX = 780;
  const bvX = 1030;
  const foxStand = 1380;
  const foxIn = ease(prog(frame, e.foxIn, e.foxIn + 30));
  const foxX = 2100 - (2100 - foxStand) * foxIn;
  const portY = GROUND - 90;
  const busY = portY + 35;
  const plugged = frame >= e.plug;
  const cable = plugged ? ease(prog(frame, e.plug, e.plug + 16)) : 0;
  const eqP = ease(prog(frame, e.eqIn, e.eqIn + 12));
  const count = (a: number, b: number, to: number) =>
    Math.round(to * clamp((frame - a) / (b - a)));
  const jump =
    frame >= e.plug && frame < e.plug + 24
      ? -Math.abs(Math.sin(((frame - e.plug) / 24) * Math.PI * 2)) * 50
      : 0;
  return (
    <Svg>
      <Night frame={frame} moon={false} />
      <Cable
        points={[
          [owlX + 190, busY],
          [sqX + 128, busY],
          [bvX + 128, busY],
        ]}
        pulse={(frame % 50) / 50}
      />
      <Cable
        points={[
          [bvX + 128, busY],
          [foxStand + 110, busY],
        ]}
        progress={cable}
        pulse={cable > 0.99 ? (frame % 50) / 50 : undefined}
      />
      <Socket x={owlX + 155} y={portY} shape="hex" filled />
      <Socket x={sqX + 90} y={portY} shape="hex" filled />
      <Socket x={bvX + 90} y={portY} shape="hex" filled />
      <Socket
        x={foxStand + 75}
        y={portY}
        shape="hex"
        filled={plugged}
        glow={plugged && frame < e.plug + 10 ? 1 : 0}
      />
      <Actor
        name="owl"
        x={owlX}
        frame={frame}
        talking={isTalking(frame, "owl", "s6")}
        lift={
          frame >= lineById("s6b").start && frame < lineById("s6b").start + 24
            ? jump
            : 0
        }
      />
      <Actor name="squirrel" x={sqX} frame={frame} phase={6} lift={jump} />
      <Actor name="beaver" x={bvX} frame={frame} phase={12} lift={jump} />
      <Actor
        name="fox"
        x={foxX}
        frame={frame}
        talking={isTalking(frame, "fox", "s6")}
        lift={frame >= e.plug ? jump : 0}
      />
      {frame >= e.plug && frame < e.plug + 8 ? (
        <Spark x={foxStand + 110} y={portY + 35} size={14} />
      ) : null}
      {frame >= e.foxIn + 20 && frame < e.plug ? (
        <Sprite rows={PLUG_HEX} x={snap(foxX - 30)} y={GROUND - 120} s={10} />
      ) : null}
      <Talk
        frame={frame}
        ids={["s6a", "s6b"]}
        at={{ fox: head("fox", foxStand), owl: head("owl", owlX) }}
      />
      {/* Cuentas: sin MCP vs con MCP */}
      {frame >= e.eqIn ? (
        <g opacity={eqP} transform="translate(0 -212)">
          <rect x={102} y={312} width={716} height={236} fill={C.ink} />
          <rect x={110} y={320} width={700} height={220} fill={C.red} />
          <rect x={118} y={328} width={684} height={204} fill={C.sky} />
          <PText text={T.s6.without} x={150} y={382} size={28} color={C.red} />
          <PText
            text={`5 × 4 = ${count(e.count1, e.count1 + 20, 20)}`}
            x={150}
            y={462}
            size={44}
            color={C.cream}
          />
          <PText text={T.s6.e1b} x={150} y={512} size={20} color={C.gray} />
          <rect x={1082} y={312} width={716} height={236} fill={C.ink} />
          <rect x={1090} y={320} width={700} height={220} fill={C.green} />
          <rect x={1098} y={328} width={684} height={204} fill={C.sky} />
          <PText
            text={T.s6.withMcp}
            x={1130}
            y={382}
            size={28}
            color={C.green}
          />
          <PText
            text={`5 + 4 = ${count(e.count2, e.count2 + 16, 9)}`}
            x={1130}
            y={462}
            size={44}
            color={C.cream}
          />
          <PText text={T.s6.e2b} x={1130} y={512} size={20} color={C.gray} />
        </g>
      ) : null}
      <Banner text={T.s6.caption} frame={frame} start={e.win} size={30} />
    </Svg>
  );
};

// ------------------------------------------------------------- 7 · Final
export const P7Finale: React.FC = () => {
  const frame = useCurrentFrame();
  const e = EV.s7;
  const names: (
    | "turtle"
    | "beaver"
    | "owl"
    | "squirrel"
    | "fox"
    | "teacher"
  )[] = ["turtle", "beaver", "owl", "squirrel", "fox", "teacher"];
  const xs = [260, 520, 760, 1130, 1400, 1690];
  const bounce = (i: number) => {
    const t = (frame + i * 7) % 36;
    return -Math.abs(Math.sin((t / 36) * Math.PI)) * 40;
  };
  const showClear = frame >= e.clear;
  const blink = Math.floor(frame / 8) % 2 === 0;
  return (
    <Svg>
      <Night frame={frame} />
      {names.map((n, i) => (
        <Actor
          key={n}
          name={n}
          x={xs[i]}
          frame={frame}
          lift={frame > 14 ? bounce(i) : 0}
          phase={i * 4}
          flip={i >= 3 && i < 5 ? false : false}
        />
      ))}
      {e.fireworks.map((f, i) => {
        const p = frame - f;
        if (p < 0 || p > 24) return null;
        const cx = 360 + ((i * 337) % 1200);
        const cy = 220 + ((i * 131) % 160);
        const r = 20 + p * 5;
        return (
          <g key={i} opacity={1 - p / 24}>
            {Array.from({ length: 8 }, (_, k) => {
              const a = (k * Math.PI) / 4;
              return (
                <rect
                  key={k}
                  x={snap(cx + r * Math.cos(a))}
                  y={snap(cy + r * Math.sin(a))}
                  width={14}
                  height={14}
                  fill={[C.yellow, C.pink, C.cyan, C.orange][i % 4]}
                />
              );
            })}
          </g>
        );
      })}
      <g
        transform={`translate(960 ${300}) scale(${ease(prog(frame, e.title, e.title + 12))}) translate(-960 -300)`}
      >
        <PText
          text={T.s7.title}
          x={960}
          y={300}
          size={200}
          color={C.yellow}
          anchor="middle"
        />
      </g>
      <PText
        text={T.s7.sub}
        x={960}
        y={390}
        size={36}
        color={C.cream}
        anchor="middle"
        chars={(frame - e.sub) / 1.2}
      />
      {showClear && blink ? (
        <PText
          text={T.s7.clear}
          x={960}
          y={500}
          size={40}
          color={C.green}
          anchor="middle"
        />
      ) : null}
      <PText
        text={T.s7.credits}
        x={960}
        y={1050}
        size={18}
        color={C.gray}
        anchor="middle"
        opacity={clamp((frame - e.credits) / 12)}
        shadow={null}
      />
    </Svg>
  );
};

export { actorSize };

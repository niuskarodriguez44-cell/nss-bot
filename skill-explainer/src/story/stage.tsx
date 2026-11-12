import React from "react";
import {
  BEAVER,
  BEAVER_TALK,
  C,
  FOX,
  FOX_TALK,
  OWL,
  OWL_BLINK,
  OWL_DIZZY,
  OWL_TALK,
  PText,
  PX,
  SQUIRREL,
  SQUIRREL_TALK,
  Sprite,
  TEACHER,
  TURTLE,
  TURTLE_BLINK,
  Ground,
  Stars,
  Rows,
} from "./pixel";
import { lineById, LINES } from "./script";

export const GROUND = 900;

export type ActorName =
  | "owl"
  | "squirrel"
  | "beaver"
  | "fox"
  | "turtle"
  | "teacher";

const ACTORS: Record<ActorName, { rows: Rows; s: number }> = {
  owl: { rows: OWL, s: 20 },
  squirrel: { rows: SQUIRREL, s: 16 },
  beaver: { rows: BEAVER, s: 16 },
  fox: { rows: FOX, s: 16 },
  turtle: { rows: TURTLE, s: 16 },
  teacher: { rows: TEACHER, s: 20 },
};

export const actorSize = (name: ActorName) => {
  const a = ACTORS[name];
  return {
    w: Math.max(...a.rows.map((r) => r.length)) * a.s,
    h: a.rows.length * a.s,
  };
};

/** Habla mientras el diálogo de ese personaje se está escribiendo. */
export const isTalking = (frame: number, voice: ActorName, sceneKey: string) =>
  LINES.some((l) => {
    if (l.scene !== sceneKey || l.voice !== voice) return false;
    const chars = l.lines.join("").length;
    return frame >= l.start && frame < l.start + chars * 2 + 6;
  });

type ActorProps = {
  name: ActorName;
  x: number;
  frame: number;
  /** Altura extra (saltos, entradas). Negativo = sube. */
  lift?: number;
  flip?: boolean;
  talking?: boolean;
  dizzy?: boolean;
  /** Fase del "respirar" para que no se muevan todos igual. */
  phase?: number;
  opacity?: number;
  tint?: string;
};

export const Actor: React.FC<ActorProps> = ({
  name,
  x,
  frame,
  lift = 0,
  flip,
  talking,
  dizzy,
  phase = 0,
  opacity,
  tint,
}) => {
  const a = ACTORS[name];
  const { h } = actorSize(name);
  const bob = Math.floor((frame + phase) / 18) % 2 === 0 ? 0 : -PX / 2;
  const mouth = talking && Math.floor(frame / 4) % 2 === 0;
  const blink = Math.floor((frame + phase * 3) / 4) % 22 === 0;
  let patch: Record<number, string> | undefined;
  if (name === "owl")
    patch = dizzy
      ? OWL_DIZZY
      : { ...(blink ? OWL_BLINK : {}), ...(mouth ? OWL_TALK : {}) };
  if (name === "squirrel" && mouth) patch = SQUIRREL_TALK;
  if (name === "beaver" && mouth) patch = BEAVER_TALK;
  if (name === "fox" && mouth) patch = FOX_TALK;
  if (name === "turtle" && blink) patch = TURTLE_BLINK;
  return (
    <Sprite
      rows={a.rows}
      x={x}
      y={GROUND - h + bob + lift}
      s={a.s}
      flip={flip}
      patch={patch}
      opacity={opacity}
      tint={tint}
    />
  );
};

/** Cielo nocturno + suelo (base de casi todas las escenas). */
export const Night: React.FC<{
  frame: number;
  ground?: boolean;
  moon?: boolean;
}> = ({ frame, ground = true, moon = true }) => (
  <g>
    <rect width={1920} height={1080} fill={C.sky} />
    <rect width={1920} height={560} fill={C.skyDeep} opacity={0.35} />
    <Stars frame={frame} />
    {moon ? (
      <g fill="#ffe9a8">
        <rect x={1620} y={120} width={140} height={140} />
        <rect x={1648} y={92} width={84} height={28} />
        <rect x={1648} y={260} width={84} height={28} />
        <rect x={1592} y={148} width={28} height={84} />
        <rect x={1760} y={148} width={28} height={84} />
        <rect x={1650} y={150} width={30} height={30} fill="#f0d27a" />
      </g>
    ) : null}
    {ground ? <Ground y={GROUND} /> : null}
  </g>
);

/** Rótulo oscuro sobre el suelo, para frases clave. */
export const Banner: React.FC<{
  text: string;
  frame: number;
  start: number;
  size?: number;
  y?: number;
  color?: string;
}> = ({ text, frame, start, size = 32, y = 975, color = C.yellow }) => {
  const p = Math.max(0, Math.min(1, (frame - start) / 8));
  if (p <= 0) return null;
  const w = text.length * size + 80;
  return (
    <g opacity={p} transform={`translate(0 ${(1 - p) * 20})`}>
      <rect
        x={960 - w / 2 - 8}
        y={y - size - 26}
        width={w + 16}
        height={size + 52}
        fill={C.cream}
      />
      <rect
        x={960 - w / 2}
        y={y - size - 18}
        width={w}
        height={size + 36}
        fill={C.ink}
      />
      <PText
        text={text}
        x={960}
        y={y}
        size={size}
        color={color}
        anchor="middle"
        chars={(frame - start) / 1.2}
      />
    </g>
  );
};

/** Diálogos que existen en este momento de la escena (con orden: el nuevo reemplaza al anterior del mismo bloque). */
export const activeLine = (frame: number, ids: string[]) => {
  let current: string | null = null;
  for (const id of ids) {
    if (frame >= lineById(id).start) current = id;
  }
  return current;
};

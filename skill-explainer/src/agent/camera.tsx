import React from "react";
import { interpolate } from "remotion";
import { SOFT } from "./theme";

export type CamKey = { f: number; x: number; y: number; s: number; r?: number };

/**
 * Cámara virtual: interpola entre puntos de foco (x, y en coordenadas del mundo),
 * zoom (s) y una rotación suave (r, grados). Devuelve el estilo del "mundo".
 */
export const cameraStyle = (frame: number, keys: CamKey[]): React.CSSProperties => {
  const input = keys.map((k) => k.f);
  const opts = {
    extrapolateLeft: "clamp" as const,
    extrapolateRight: "clamp" as const,
    easing: SOFT,
  };
  const x = interpolate(frame, input, keys.map((k) => k.x), opts);
  const y = interpolate(frame, input, keys.map((k) => k.y), opts);
  const s = interpolate(frame, input, keys.map((k) => k.s), opts);
  const r = interpolate(frame, input, keys.map((k) => k.r ?? 0), opts);
  return {
    position: "absolute",
    left: 0,
    top: 0,
    width: 1920,
    height: 1080,
    transformOrigin: "0 0",
    transform: `translate(960px, 540px) rotate(${r}deg) scale(${s}) translate(${-x}px, ${-y}px)`,
  };
};

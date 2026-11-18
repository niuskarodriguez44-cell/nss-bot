import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile } from "remotion";
import { B, INTER } from "./brand";

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};
export const lerp = (f: number, a: number, b: number, from = 0, to = 1) =>
  interpolate(f, [a, b], [from, to], clamp);
export const easeOut = (t: number) =>
  1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);

/** Ventana del navegador en el mundo (1920x1080). La captura mide 1440x900. */
export const WIN = { x: 210, y: 50, w: 1500, bar: 44 };
export const K = WIN.w / 1440;
/** Coordenadas de la captura (px) -> mundo. */
export const S = (px: number, py: number) => ({
  x: WIN.x + px * K,
  y: WIN.y + WIN.bar + py * K,
});

export const StageBg: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: B.mint }}>
    <svg width={1920} height={1080}>
      <defs>
        <pattern id="dots" width={36} height={36} patternUnits="userSpaceOnUse">
          <circle cx={2} cy={2} r={2} fill="rgba(17,17,17,0.06)" />
        </pattern>
      </defs>
      <rect width={1920} height={1080} fill="url(#dots)" />
    </svg>
  </AbsoluteFill>
);

export const BrowserFrame: React.FC<{
  src: string;
  children?: React.ReactNode;
}> = ({ src, children }) => (
  <div
    style={{
      position: "absolute",
      left: WIN.x,
      top: WIN.y,
      width: WIN.w,
      height: WIN.bar + 900 * K,
      borderRadius: 22,
      overflow: "hidden",
      backgroundColor: "#fff",
      boxShadow:
        "0 40px 120px rgba(16, 40, 36, 0.18), 0 0 0 1px rgba(0,0,0,0.06)",
    }}
  >
    <div
      style={{
        height: WIN.bar,
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "0 18px",
        backgroundColor: "#f1f0ec",
        borderBottom: `1px solid ${B.line}`,
      }}
    >
      {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
        <div
          key={c}
          style={{ width: 13, height: 13, borderRadius: 7, backgroundColor: c }}
        />
      ))}
      <div
        style={{
          marginLeft: 380,
          width: 560,
          height: 28,
          borderRadius: 8,
          backgroundColor: "#fff",
          border: `1px solid ${B.line}`,
          fontFamily: INTER,
          fontSize: 15,
          color: B.gray,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        cubanbot · beta
      </div>
    </div>
    <Img
      src={staticFile(`cubanbot/${src}`)}
      style={{ width: WIN.w, display: "block" }}
    />
    {children ? (
      <div
        style={{
          position: "absolute",
          left: 0,
          top: WIN.bar,
          width: WIN.w,
          height: 900 * K,
        }}
      >
        {children}
      </div>
    ) : null}
  </div>
);

/** Anillo de resalte (coordenadas de la captura). Se dibuja dentro del mundo. */
export const Ring: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  p: number;
  color?: string;
  r?: number;
}> = ({ x, y, w, h, p, color = B.accent, r = 14 }) => {
  if (p <= 0) return null;
  const a = S(x, y);
  return (
    <div
      style={{
        position: "absolute",
        left: a.x - 6,
        top: a.y - 6,
        width: w * K + 12,
        height: h * K + 12,
        borderRadius: r,
        border: `4px solid ${color}`,
        boxShadow: `0 0 0 ${10 * (1 - p)}px ${color}22`,
        opacity: p,
        transform: `scale(${0.96 + 0.04 * p})`,
      }}
    />
  );
};

/** Etiqueta flotante tipo "chip". */
export const Chip: React.FC<{
  x: number;
  y: number;
  text: string;
  color: string;
  p: number;
  icon?: React.ReactNode;
  size?: number;
}> = ({ x, y, text, color, p, icon, size = 26 }) => {
  if (p <= 0) return null;
  const a = S(x, y);
  return (
    <div
      style={{
        position: "absolute",
        left: a.x,
        top: a.y,
        transform: `translate(0, -50%) translateX(${(1 - p) * -30}px) scale(${0.85 + 0.15 * p})`,
        transformOrigin: "left center",
        opacity: p,
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 20px 10px 12px",
        borderRadius: 999,
        backgroundColor: "#fff",
        boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
        border: `2px solid ${color}`,
        fontFamily: INTER,
        fontWeight: 600,
        fontSize: size,
        color: B.ink,
        whiteSpace: "nowrap",
      }}
    >
      {icon}
      {text}
    </div>
  );
};

/** Título inferior (fuera de la cámara). */
export const Caption: React.FC<{
  text: string;
  frame: number;
  dur: number;
}> = ({ text, frame, dur }) => {
  if (!text) return null;
  const p = easeOut(lerp(frame, 6, 22)) * (1 - lerp(frame, dur - 12, dur));
  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        bottom: 64,
        padding: "16px 30px",
        borderRadius: 18,
        backgroundColor: B.ink,
        color: "#fff",
        fontFamily: INTER,
        fontWeight: 700,
        fontSize: 40,
        letterSpacing: -0.5,
        opacity: p,
        transform: `translateY(${(1 - p) * 24}px)`,
        boxShadow: "0 16px 40px rgba(0,0,0,0.25)",
      }}
    >
      {text}
    </div>
  );
};

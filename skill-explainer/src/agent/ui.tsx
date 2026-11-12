import React from "react";
import { P, SANS, ease, hexA } from "./theme";

const ICONS: Record<string, string[]> = {
  check: ["M20 6 9 17l-5-5"],
  calendar: ["M8 2v4", "M16 2v4", "M3 10h18", "M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"],
  bell: ["M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9", "M10.3 21a1.94 1.94 0 0 0 3.4 0"],
  refresh: ["M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8", "M21 3v5h-5"],
  send: ["m5 12 7-7 7 7", "M12 19V5"],
  search: ["M11 3a8 8 0 1 0 0 16 8 8 0 0 0 0-16z", "m21 21-4.3-4.3"],
  plus: ["M5 12h14", "M12 5v14"],
  sliders: ["M4 21v-7", "M4 10V3", "M12 21v-9", "M12 8V3", "M20 21v-5", "M20 12V3", "M1 14h6", "M9 8h6", "M17 16h6"],
  chat: ["M7.9 20A9 9 0 1 0 4 16.1L2 22z"],
  book: ["M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z", "M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"],
  flag: ["M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z", "M4 22v-7"],
  target: ["M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z", "M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z", "M12 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"],
  chart: ["M3 3v18h18", "m7 15 4-5 3 3 5-7"],
  note: ["M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z", "M14 3v6h6", "M8 13h8", "M8 17h5"],
  spark: ["M12 3v4", "M12 17v4", "M3 12h4", "M17 12h4", "m5.6 5.6 2.8 2.8", "m15.6 15.6 2.8 2.8", "m18.4 5.6-2.8 2.8", "m8.4 15.6-2.8 2.8"],
  grid: ["M3 3h7v7H3z", "M14 3h7v7h-7z", "M14 14h7v7h-7z", "M3 14h7v7H3z"],
  users: ["M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", "M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z", "M22 21v-2a4 4 0 0 0-3-3.87", "M16 3.13a4 4 0 0 1 0 7.75"],
};

export const Icon: React.FC<{
  name: keyof typeof ICONS | string;
  size?: number;
  color?: string;
  width?: number;
  style?: React.CSSProperties;
}> = ({ name, size = 32, color = P.dark, width = 2, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={width}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
  >
    {(ICONS[name] ?? []).map((d, i) => (
      <path key={i} d={d} />
    ))}
  </svg>
);

export const cardStyle = (extra: React.CSSProperties = {}): React.CSSProperties => ({
  backgroundColor: P.paper,
  border: `2px solid ${P.line}`,
  borderRadius: 24,
  boxShadow: "0 22px 60px rgba(120, 88, 56, 0.12)",
  ...extra,
});

/** Interruptor tipo iOS. `on` va de 0 a 1. */
export const Toggle: React.FC<{ on: number; w?: number }> = ({ on, w = 88 }) => {
  const h = w * 0.55;
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: h,
        backgroundColor: on > 0.5 ? P.blue : P.line,
        boxSizing: "border-box",
        padding: 5,
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 5,
          left: 5 + on * (w - h),
          width: h - 10,
          height: h - 10,
          borderRadius: h,
          backgroundColor: "#fff",
          boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
        }}
      />
    </div>
  );
};

/** Deslizador con perilla. `value` entre 0 y 1. */
export const Slider: React.FC<{ value: number; w: number; color?: string }> = ({
  value,
  w,
  color = P.orange,
}) => (
  <div style={{ position: "relative", width: w, height: 36 }}>
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 15,
        height: 6,
        borderRadius: 3,
        backgroundColor: P.line,
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 15,
        width: value * w,
        height: 6,
        borderRadius: 3,
        backgroundColor: color,
      }}
    />
    <div
      style={{
        position: "absolute",
        left: value * w - 15,
        top: 3,
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: "#fff",
        border: `2px solid ${P.line}`,
        boxShadow: "0 3px 8px rgba(0,0,0,0.18)",
        boxSizing: "border-box",
      }}
    />
  </div>
);

/** Botón tipo pill. `hover` (0-1) aclara/oscurece; `filled` lo rellena. */
export const Pill: React.FC<{
  label: string;
  icon?: string;
  hover?: number;
  filled?: boolean;
  color?: string;
  size?: number;
  style?: React.CSSProperties;
}> = ({ label, icon, hover = 0, filled = false, color = P.orange, size = 28, style }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 12,
      height: size * 2,
      padding: `0 ${size * 0.95}px`,
      borderRadius: size * 2,
      boxSizing: "border-box",
      fontFamily: SANS,
      fontWeight: 500,
      fontSize: size,
      whiteSpace: "nowrap",
      color: filled ? "#fff" : P.dark,
      backgroundColor: filled ? color : hexA(color, 0.1 * hover),
      border: `2px solid ${filled ? color : hexA(P.dark, 0.14 + 0.2 * hover)}`,
      transform: `scale(${1 + 0.03 * hover})`,
      ...style,
    }}
  >
    {icon ? <Icon name={icon} size={size} color={filled ? "#fff" : color} /> : null}
    {label}
  </div>
);

/** Pestañas segmentadas con resaltado que se desliza. `pos` es continuo (0, 1, ...). */
export const Tabs: React.FC<{ options: string[]; pos: number; w: number }> = ({
  options,
  pos,
  w,
}) => {
  const seg = w / options.length;
  return (
    <div
      style={{
        position: "relative",
        width: w,
        height: 60,
        borderRadius: 30,
        backgroundColor: P.line,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 5,
          left: 5 + pos * seg,
          width: seg - 10,
          height: 50,
          borderRadius: 25,
          backgroundColor: "#fff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
        }}
      />
      {options.map((o, i) => (
        <div
          key={o}
          style={{
            position: "absolute",
            left: i * seg,
            width: seg,
            top: 0,
            height: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: SANS,
            fontWeight: 500,
            fontSize: 24,
            color: ease(Math.abs(pos - i), [0, 0.5], [0, 1]) < 0.5 ? P.dark : P.mid,
          }}
        >
          {o}
        </div>
      ))}
    </div>
  );
};

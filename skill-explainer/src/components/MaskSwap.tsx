import React from "react";

type Props = {
  items: React.ReactNode[];
  /** Posición continua: 0 muestra items[0], 1 muestra items[1], etc. */
  pos: number;
  height: number;
  width?: number;
  justify?: "flex-start" | "center";
  style?: React.CSSProperties;
};

/** Cambia de contenido deslizando verticalmente dentro de una máscara (overflow hidden). */
export const MaskSwap: React.FC<Props> = ({
  items,
  pos,
  height,
  width,
  justify = "flex-start",
  style,
}) => (
  <div
    style={{
      position: "relative",
      height,
      width,
      overflow: "hidden",
      ...style,
    }}
  >
    {items.map((item, i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: justify,
          whiteSpace: "nowrap",
          transform: `translateY(${(i - pos) * height}px)`,
          opacity: Math.max(0, 1 - Math.abs(i - pos)),
        }}
      >
        {item}
      </div>
    ))}
  </div>
);

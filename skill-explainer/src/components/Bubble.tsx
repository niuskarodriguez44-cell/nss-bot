import React from "react";
import { COLORS, LORA, RADIUS } from "../theme";

export const BUBBLE_W = 640;
export const BUBBLE_H = 110;
/** Distancia vertical entre centros de burbujas apiladas. */
export const BUBBLE_STEP = 134;

type Props = {
  text: string;
  fontSize?: number;
  style?: React.CSSProperties;
};

/** Burbuja de chat (fondo lightGray, texto Lora). */
export const Bubble: React.FC<Props> = ({ text, fontSize = 36, style }) => (
  <div
    style={{
      width: BUBBLE_W,
      height: BUBBLE_H,
      boxSizing: "border-box",
      padding: "0 40px",
      display: "flex",
      alignItems: "center",
      borderRadius: RADIUS,
      backgroundColor: COLORS.lightGray,
      fontFamily: LORA,
      fontWeight: 400,
      fontSize,
      color: COLORS.dark,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {text}
  </div>
);

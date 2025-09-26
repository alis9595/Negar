"use client";

import { rgbToHex } from "@/lib/utils";
import { TEllipseLayer } from "@/types/canvas";
import { PointerEvent } from "react";

interface Props {
  id: string;
  layer: TEllipseLayer;
  onPointerDown: (e: PointerEvent, id: string) => void;
  selectionColor?: string;
}

export function Ellipse({ id, layer, onPointerDown, selectionColor }: Props) {
  const { x, y, width, height, fill } = layer;
  return (
    <ellipse
      className="drop-shadow-md"
      onPointerDown={(e) => onPointerDown(e, id)}
      style={{ transform: `translate(${x}px, ${y}px)` }}
      cx={width / 2}
      cy={height / 2}
      rx={width / 2}
      ry={height / 2}
      strokeWidth={1}
      fill={fill ? rgbToHex(fill) : "#000"}
      stroke={selectionColor || "transparent"}
    />
  );
}

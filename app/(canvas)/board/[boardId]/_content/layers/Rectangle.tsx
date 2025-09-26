"use client";

import { rgbToHex } from "@/lib/utils";
import { TRectangleLayer } from "@/types/canvas";
import { PointerEvent } from "react";

interface Props {
  id: string;
  layer: TRectangleLayer;
  onPointerDown: (e: PointerEvent, id: string) => void;
  selectionColor?: string;
}

export function Rectangle({ id, layer, onPointerDown, selectionColor }: Props) {
  const { x, y, width, height, fill } = layer;
  return (
    <rect
      className="drop-shadow-md"
      onPointerDown={(e) => onPointerDown(e, id)}
      style={{ transform: `translate(${x}px, ${y}px)` }}
      x={0}
      y={0}
      width={width}
      height={height}
      strokeWidth={1}
      fill={fill ? rgbToHex(fill) : "#000"}
      stroke={selectionColor || "transparent"}
    />
  );
}

"use client";

import { getSvgPathFromStroke } from "@/lib/utils";
import { PointerEvent } from "react";
import { getStroke } from "perfect-freehand";

interface Props {
  x: number;
  y: number;
  points: number[][];
  fill: string;
  onPointerDown?: (e: PointerEvent) => void;
  stroke?: string;
}

export function Path({ x, y, points, fill, onPointerDown, stroke }: Props) {
  return (
    <path
      className="drop-shadow-md"
      onPointerDown={onPointerDown}
      d={getSvgPathFromStroke(
        getStroke(points, {
          size: 16,
          thinning: 0.5,
          smoothing: 0.5,
          streamline: 0.5,
        })
      )}
      style={{ transform: `translate(${x}px, ${y}px)` }}
      x={0}
      y={0}
      fill={fill}
      stroke={stroke}
      strokeWidth={1}
    />
  );
}

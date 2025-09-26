import {
  ELayerType,
  ESide,
  TCamera,
  TColor,
  TLayer,
  TPathLayer,
  TPoint,
  TXYWH,
} from "@/types/canvas";
import { clsx, type ClassValue } from "clsx";
import { PointerEvent } from "react";
import { twMerge } from "tailwind-merge";

const COLORS = ["#DC2626", "#D97706", "#059669", "#7C3AED", "#DB2777"];

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function connectionIdToColor(connectionId: number) {
  return COLORS[connectionId % COLORS.length];
}

export function pointerEventToCanvasPoint(
  e: PointerEvent,
  camera: TCamera
): TCamera {
  return {
    x: Math.round(e.clientX) - camera.x,
    y: Math.round(e.clientY) - camera.y,
  };
}

export function rgbToHex(color: TColor) {
  return `#${color.r.toString(16).padStart(2, "0")}${color.g
    .toString(16)
    .padStart(2, "0")}${color.b.toString(16).padStart(2, "0")}`;
}

export function resizeBounds(
  bounds: TXYWH,
  corner: ESide,
  point: TPoint
): TXYWH {
  const ret = {
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
  };

  if ((corner & ESide.Left) === ESide.Left) {
    ret.x = Math.min(point.x, bounds.x + bounds.width);
    ret.width = Math.abs(bounds.x + bounds.width - point.x);
  }

  if ((corner & ESide.Right) === ESide.Right) {
    ret.x = Math.min(point.x, bounds.x);
    ret.width = Math.abs(point.x - bounds.x);
  }

  if ((corner & ESide.Top) === ESide.Top) {
    ret.y = Math.min(point.y, bounds.y + bounds.height);
    ret.height = Math.abs(bounds.y + bounds.height - point.y);
  }

  if ((corner & ESide.Bottom) === ESide.Bottom) {
    ret.y = Math.min(point.y, bounds.y);
    ret.height = Math.abs(point.y - bounds.y);
  }

  return ret;
}

export function findIntersectingLayersWithRectangle(
  layerIds: readonly string[],
  layers: ReadonlyMap<string, TLayer>,
  a: TPoint,
  b: TPoint
) {
  const rect: TXYWH = {
    x: Math.min(a.x, b.x),
    y: Math.min(a.y, b.y),
    width: Math.abs(a.x - b.x),
    height: Math.abs(a.y - b.y),
  };

  const ids = [];

  for (const layerId of layerIds) {
    const layer = layers.get(layerId);
    if (layer == null) continue;

    const { x, y, height, width } = layer;

    if (
      rect.x + rect.width > x &&
      rect.x < x + width &&
      rect.y + rect.height > y &&
      rect.y < y + height
    )
      ids.push(layerId);
  }

  return ids;
}

//chatgpt suggested this
//don't know how
export function getContrastTextColor(color: TColor) {
  const luminance = 0.299 * color.r + 0.587 * color.g + 0.114 * color.b;

  return luminance > 182 ? "black" : "white";
}

export function penPointsToPath(points: number[][], color: TColor): TPathLayer {
  if (points.length < 2) throw new Error("Not enough points");

  let left = Number.POSITIVE_INFINITY;
  let top = Number.POSITIVE_INFINITY;
  let right = Number.NEGATIVE_INFINITY;
  let bottom = Number.NEGATIVE_INFINITY;

  for (const point of points) {
    const [x, y] = point;
    if (left > x) left = x;
    if (top > y) top = y;
    if (right < x) right = x;
    if (bottom < y) bottom = y;
  }

  return {
    type: ELayerType.Path,
    x: left,
    y: top,
    width: right - left,
    height: bottom - top,
    fill: color,
    points: points.map(([x, y, pressure]) => [x - left, y - top, pressure]),
  };
}

//chatgpt suggested this
//don't know how
export function getSvgPathFromStroke(stroke: number[][]) {
  if (!stroke.length) return;

  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ["M", ...stroke[0], "Q"]
  );

  d.push("Z");

  return d.join(" ");
}

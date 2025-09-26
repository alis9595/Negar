"use client";

import { ESide, TXYWH } from "@/types/canvas";

export interface IHandleProps {
  bounds: TXYWH;
  width: number;
  onResizeHandlePointerDown: (corner: ESide, initialBounds: TXYWH) => void;
}

export function ResizeHandles({
  bounds,
  width,
  onResizeHandlePointerDown,
}: IHandleProps) {
  const handles = [
    {
      id: 1,
      position: "nwse",
      transform: `translate(${bounds.x - width / 2}px,${
        bounds.y - width / 2
      }px)`,
      onPointerDown: () => {
        onResizeHandlePointerDown(ESide.Top + ESide.Left, bounds);
      },
    },
    {
      id: 2,
      position: "ns",
      transform: `translate(${bounds.x + bounds.width / 2 - width / 2}px,${
        bounds.y - width / 2
      }px)`,
      onPointerDown: () => {
        onResizeHandlePointerDown(ESide.Top, bounds);
      },
    },
    {
      id: 3,
      position: "nesw",
      transform: `translate(${bounds.x - width / 2 + bounds.width}px,${
        bounds.y - width / 2
      }px)`,
      onPointerDown: () => {
        onResizeHandlePointerDown(ESide.Top + ESide.Right, bounds);
      },
    },
    {
      id: 4,
      position: "ew",
      transform: `translate(${bounds.x - width / 2 + bounds.width}px,${
        bounds.y + bounds.height / 2 - width / 2
      }px)`,
      onPointerDown: () => {
        onResizeHandlePointerDown(ESide.Right, bounds);
      },
    },
    {
      id: 5,
      position: "nwse",
      transform: `translate(${bounds.x - width / 2 + bounds.width}px,${
        bounds.y - width / 2 + bounds.height
      }px)`,
      onPointerDown: () => {
        onResizeHandlePointerDown(ESide.Bottom + ESide.Right, bounds);
      },
    },
    {
      id: 6,
      position: "ns",
      transform: `translate(${bounds.x + bounds.width / 2 - width / 2}px,${
        bounds.y - width / 2 + bounds.height
      }px)`,
      onPointerDown: () => {
        onResizeHandlePointerDown(ESide.Bottom, bounds);
      },
    },
    {
      id: 7,
      position: "nesw",
      transform: `translate(${bounds.x - width / 2}px,${
        bounds.y - width / 2 + bounds.height
      }px)`,
      onPointerDown: () => {
        onResizeHandlePointerDown(ESide.Bottom + ESide.Left, bounds);
      },
    },
    {
      id: 8,
      position: "ew",
      transform: `translate(${bounds.x - width / 2}px,${
        bounds.y + bounds.height / 2 - width / 2
      }px)`,
      onPointerDown: () => {
        onResizeHandlePointerDown(ESide.Left, bounds);
      },
    },
  ];

  return (
    <>
      {handles.map((handle) => (
        <rect
          key={handle.id}
          className="fill-white stroke-1 stroke-blue-500"
          style={{
            cursor: `${handle.position}-resize`,
            width: `${width}px`,
            height: `${width}px`,
            transform: handle.transform,
          }}
          x={0}
          y={0}
          onPointerDown={(e) => {
            e.stopPropagation();
            handle.onPointerDown();
          }}
        />
      ))}
    </>
  );
}

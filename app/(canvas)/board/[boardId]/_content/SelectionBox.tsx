"use client";

import { useSelectionBounds } from "@/hooks/useSelectionBounds";
import { ELayerType, ESide, TXYWH } from "@/types/canvas";
import { useSelf, useStorage } from "@liveblocks/react";
import { memo } from "react";
import { ResizeHandles } from "./ResizeHandles";

interface Props {
  onResizeHandlePointerDown: (corner: ESide, initialBounds: TXYWH) => void;
}

const HANDLE_WIDTH = 8;

export const SelectionBox = memo(({ onResizeHandlePointerDown }: Props) => {
  const soleLayerId = useSelf((me) =>
    me.presence.selection.length === 1 ? me.presence.selection[0] : null
  );

  const isShowingHandles = useStorage(
    (root) =>
      soleLayerId && root.layers.get(soleLayerId)?.type !== ELayerType.Path
  );

  const bounds = useSelectionBounds();

  if (!bounds) return null;

  return (
    <>
      <rect
        className="fill-transparent stroke-blue-500 stroke-1 pointer-events-none"
        style={{ transform: `translate(${bounds.x}px, ${bounds.y}px)` }}
        x={0}
        y={0}
        width={bounds.width}
        height={bounds.height}
      />
      {isShowingHandles && (
        <ResizeHandles
          bounds={bounds}
          width={HANDLE_WIDTH}
          onResizeHandlePointerDown={onResizeHandlePointerDown}
        />
      )}
    </>
  );
});

SelectionBox.displayName = "SelectionBox";

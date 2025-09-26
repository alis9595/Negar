"use client";

import { useSelectionBounds } from "@/hooks/useSelectionBounds";
import { TCamera, TColor } from "@/types/canvas";
import { useSelf, useMutation } from "@liveblocks/react";
import { memo } from "react";
import { ColorPicker } from "./ColorPicker";
import { DeleteButton } from "./DeleteButton";
import { LayerMng } from "./LayerMng";

interface ISelectionToolsProps {
  camera: TCamera;
  setLastUsedColor: (color: TColor) => void;
}

export const SelectionTools = memo(
  ({ camera, setLastUsedColor }: ISelectionToolsProps) => {
    const selection = useSelf((me) => me.presence.selection);
    const selectionBounds = useSelectionBounds();

    const setFill = useMutation(
      ({ storage }, fill: TColor) => {
        const liveLayers = storage.get("layers");
        setLastUsedColor(fill);
        selection?.forEach((id) => liveLayers.get(id)?.set("fill", fill));
      },
      [selection, setLastUsedColor]
    );

    if (!selectionBounds) return null;

    const x = selectionBounds.width / 2 + selectionBounds.x + camera.x;
    const y = selectionBounds.y + camera.y;

    return (
      <div
        className="absolute p-3 rounded-xl bg-white shadow-sm border flex select-none"
        style={{
          transform: `translate(calc(${x}px - 50%),calc(${y - 16}px - 100%))`,
        }}
      >
        <ColorPicker onChange={setFill} />
        <LayerMng />
        <DeleteButton />
      </div>
    );
  }
);

SelectionTools.displayName = "SelectionTools";

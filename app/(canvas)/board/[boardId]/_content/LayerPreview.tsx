"use client";

import { ELayerType } from "@/types/canvas";
import { useStorage } from "@liveblocks/react";
import { memo, PointerEvent } from "react";
import { Rectangle } from "./layers/Rectangle";
import { Ellipse } from "./layers/Ellipse";
import { Text } from "./layers/Text";
import { Sticker } from "./layers/Sticker";
import { rgbToHex } from "@/lib/utils";
import { Path } from "./layers/Path";

interface Props {
  id: string;
  onLayerPointerDown: (e: PointerEvent, layerId: string) => void;
  selectionColor?: string;
}

export const LayerPreview = memo(
  ({ id, onLayerPointerDown, selectionColor }: Props) => {
    const layer = useStorage((root) => root.layers.get(id));
    if (!layer) return null;

    switch (layer.type) {
      case ELayerType.Text: {
        return (
          <Text
            id={id}
            layer={layer}
            onPointerDown={onLayerPointerDown}
            selectionColor={selectionColor}
          />
        );
      }
      case ELayerType.Sticker: {
        return (
          <Sticker
            id={id}
            layer={layer}
            onPointerDown={onLayerPointerDown}
            selectionColor={selectionColor}
          />
        );
      }
      case ELayerType.Rectangle: {
        return (
          <Rectangle
            id={id}
            layer={layer}
            onPointerDown={onLayerPointerDown}
            selectionColor={selectionColor}
          />
        );
      }
      case ELayerType.Ellipse: {
        return (
          <Ellipse
            id={id}
            layer={layer}
            onPointerDown={onLayerPointerDown}
            selectionColor={selectionColor}
          />
        );
      }
      case ELayerType.Path: {
        return (
          <Path
            key={id}
            x={layer.x}
            y={layer.y}
            points={layer.points}
            fill={layer.fill ? rgbToHex(layer.fill) : "#000"}
            onPointerDown={(e) => onLayerPointerDown(e, id)}
            stroke={selectionColor}
          />
        );
      }
      default:
        console.log("unknown layer");
        return null;
    }
  }
);

LayerPreview.displayName = "LayerPreview";

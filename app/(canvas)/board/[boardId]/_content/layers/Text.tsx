"use client";

import { cn, rgbToHex } from "@/lib/utils";
import { TTextLayer } from "@/types/canvas";
import { useMutation } from "@liveblocks/react";
import { Kalam } from "next/font/google";
import { PointerEvent } from "react";
import ContentEditable from "react-contenteditable";

const font = Kalam({ subsets: ["latin"], weight: ["400"] });

interface Props {
  id: string;
  layer: TTextLayer;
  onPointerDown: (e: PointerEvent, id: string) => void;
  selectionColor?: string;
}

export function Text({ id, layer, onPointerDown, selectionColor }: Props) {
  const { x, y, width, height, fill, value } = layer;

  const calcFontSize = (width: number, height: number) => {
    const maxFontSize = 96;
    const scaleFactor = 0.5;
    const fontSizeBasedOnHeight = height * scaleFactor;
    const fontSizeBasedOnWidth = width * scaleFactor;
    return Math.min(fontSizeBasedOnHeight, fontSizeBasedOnWidth, maxFontSize);
  };

  const updateValue = useMutation(({ storage }, newValue: string) => {
    const liveLayers = storage.get("layers");
    liveLayers.get(id)?.set("value", newValue);
  }, []);

  return (
    <foreignObject
      {...{ x, y, width, height }}
      onPointerDown={(e) => onPointerDown(e, id)}
      style={{
        outline: selectionColor ? `1px solid ${selectionColor}` : "none",
      }}
    >
      <ContentEditable
        className={cn(
          "h-full w-full flex items-center justify-center text-center drop-shadow-md outline-none",
          font.className
        )}
        style={{
          fontSize: calcFontSize(width, height),
          color: fill ? rgbToHex(fill) : "#000",
        }}
        html={value ?? "Text"}
        onChange={(e) => updateValue(e.target.value)}
      />
    </foreignObject>
  );
}

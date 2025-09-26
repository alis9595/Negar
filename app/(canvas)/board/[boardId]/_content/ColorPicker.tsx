"use client";

import { Button } from "@/components/ui/button";
import { rgbToHex } from "@/lib/utils";
import { TColor } from "@/types/canvas";

interface Props {
  onChange: (color: TColor) => void;
}

interface IColorButtonProps {
  color: TColor;
  onClick: (color: TColor) => void;
}

const colors: TColor[] = [
  { r: 243, g: 82, b: 35 },
  { r: 255, g: 249, b: 177 },
  { r: 68, g: 202, b: 99 },
  { r: 39, g: 142, b: 237 },
  { r: 155, g: 105, b: 245 },
  { r: 252, g: 142, b: 42 },
  { r: 0, g: 0, b: 0 },
  { r: 255, g: 255, b: 255 },
];

export function ColorPicker({ onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2 items-center max-w-[174px] pr-2 mr-2 border-e border-neutral-200">
      {colors.map((color) => (
        <ColorButton key={color.b} color={color} onClick={onChange} />
      ))}
    </div>
  );
}

function ColorButton({ color, onClick }: IColorButtonProps) {
  return (
    <Button
      className="w-8 h-8 rounded-md border border-neutral-300 hover:opacity-75 transition"
      style={{ backgroundColor: rgbToHex(color) }}
      onClick={() => onClick(color)}
    />
  );
}

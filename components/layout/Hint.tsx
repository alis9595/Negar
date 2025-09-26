"use client";

import { ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type THintProps = {
  label: string;
  children: ReactNode;
  side?: "top" | "bottom" | "right" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  alignOffset?: number;
};

export default function Hint({
  children,
  label,
  align,
  side,
  alignOffset,
  sideOffset,
}: THintProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          className="text-white font-semibold capitalize bg-black border-black"
          {...{ align, side, sideOffset, alignOffset }}
        >
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

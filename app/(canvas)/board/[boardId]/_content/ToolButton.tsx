"use client";

import { Button } from "@/components/ui/button";
import Hint from "@/components/layout/Hint";
import { LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export interface IBtnProps {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  isActive?: boolean;
  isDisabled?: boolean;
}

export function ToolButton({
  icon: Icon,
  isActive,
  label,
  onClick,
  isDisabled,
}: IBtnProps) {
  const dir = useTranslations("Direction");
  return (
    <Hint
      label={label}
      side={dir("dir") === "rtl" ? "right" : "left"}
      sideOffset={14}
    >
      <Button
        disabled={isDisabled}
        onClick={onClick}
        size={"icon"}
        variant={isActive ? "boardActive" : "board"}
      >
        <Icon />
      </Button>
    </Hint>
  );
}

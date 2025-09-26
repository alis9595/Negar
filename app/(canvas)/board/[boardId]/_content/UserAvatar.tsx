"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Hint from "@/components/layout/Hint";
import { useTranslations } from "next-intl";

type TAvatarProps = {
  src?: string;
  name?: string;
  fallback?: string;
  borderColor?: string;
};

export default function UserAvatar({
  src,
  borderColor,
  fallback,
  name,
}: TAvatarProps) {
  const t = useTranslations("Avatar");
  return (
    <Hint label={name || t("ananymous")} side="bottom" sideOffset={18}>
      <Avatar className="h-8 w-8 border-2" style={{ borderColor }}>
        <AvatarImage src={src} />
        <AvatarFallback className="text-xs font-semibold">
          {fallback}
        </AvatarFallback>
      </Avatar>
    </Hint>
  );
}

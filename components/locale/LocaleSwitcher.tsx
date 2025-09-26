"use client";

import { useTransition } from "react";
import { Languages } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Locale } from "@/i18n/config";
import { setUserLocale } from "@/services/locale";

export default function LocaleSwitcherSelect() {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("LocaleSwitcher");

  const items = [
    {
      value: "en",
      label: t("en"),
    },
    {
      value: "fa",
      label: t("fa"),
    },
  ];

  function handleClick(value: string) {
    const locale = value as Locale;
    startTransition(() => {
      setUserLocale(locale);
    });
  }

  return (
    <div className="w-max">
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label={t("label")}
          className={cn(
            "rounded-full p-2 border transition-colors hover:bg-slate-200",
            isPending && "pointer-events-none opacity-60"
          )}
        >
          <Languages />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="min-w-[8rem] overflow-hidden rounded-sm bg-white py-1 shadow-md"
        >
          {items.map((item) => (
            <DropdownMenuItem
              key={item.value}
              className="flex cursor-default items-center px-3 py-2 text-base data-[highlighted]:bg-slate-100"
              onClick={() => handleClick(item.value)}
            >
              <span className="text-slate-900">{item.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useTranslations } from "next-intl";

export default function EmptySearch() {
  const emptySearch = useTranslations("NoResult");
  return (
    <div className="absolute inset-0 m-auto flex flex-col gap-4 justify-center items-center size-4/5">
      <DotLottieReact
        src="/lotties/nothing-found.lottie"
        loop
        autoplay
        height={140}
        width={140}
      />
      <h2 className="font-semibold text-xl">{emptySearch("title")}</h2>
      <p className="text-muted-foreground">{emptySearch("subtitle")}</p>
    </div>
  );
}

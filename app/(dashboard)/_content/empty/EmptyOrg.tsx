"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CreateOrganization } from "@clerk/nextjs";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useTranslations } from "next-intl";

export default function EmptyOrg() {
  const t = useTranslations("Main.welcome");
  return (
    <div className="absolute inset-0 m-auto flex flex-col gap-4 justify-center items-center size-4/5">
      <DotLottieReact
        src="/lotties/board.lottie"
        loop
        autoplay
        height={80}
        width={80}
        className="size-1/2"
      />
      <h2 className="text-lg font-bold">{t("title")}</h2>
      <p className="text-muted-foreground">{t("discription")}</p>
      <Dialog>
        <DialogTrigger asChild>
          <Button>{t("button")}</Button>
        </DialogTrigger>
        <DialogContent className="p-0 bg-transparent border-none !max-w-max min-w-max">
          <CreateOrganization />
        </DialogContent>
      </Dialog>
    </div>
  );
}

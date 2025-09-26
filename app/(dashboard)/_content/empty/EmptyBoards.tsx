"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useOrganization } from "@clerk/nextjs";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function EmptyBoards() {
  const router = useRouter();
  const t = useTranslations("NoBoards");
  const { organization } = useOrganization();
  const { mutate, pending } = useApiMutation(api.board.create);

  const handleClick = () => {
    if (!organization) return;

    mutate({ orgId: organization.id, title: "Untitled" })
      .then((id) => {
        toast.success(t("success"));
        router.push(`/board/${id}`);
      })
      .catch(() => toast(t("failure")));
  };

  return (
    <div className="absolute inset-0 m-auto flex flex-col gap-4 justify-center items-center size-4/5">
      <DotLottieReact
        src="/lotties/no-board.lottie"
        autoplay
        height={80}
        width={80}
        className="size-1/2"
      />
      <h2 className="text-lg font-bold">{t("title")}</h2>
      <p className="text-muted-foreground">{t("subtitle")}</p>
      <Button
        disabled={pending}
        className="mt-2"
        size={"lg"}
        onClick={handleClick}
      >
        {t("btn")}
      </Button>
    </div>
  );
}

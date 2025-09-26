"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hooks/useApiMutation";
import { cn } from "@/lib/utils";

import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Props {
  orgId: string;
  disabled?: boolean;
}

export function NewBoardButton({ orgId, disabled }: Props) {
  const router = useRouter();
  const t = useTranslations("NewBoardBtn");
  const { mutate, pending } = useApiMutation(api.board.create);

  const handleClick = () => {
    mutate({ orgId, title: "Untitled" })
      .then((id) => {
        toast.success(t("success"));
        router.push(`/board/${id}`);
      })
      .catch(() => toast.error(t("failure")));
  };

  return (
    <Button
      disabled={pending || disabled}
      className={cn(
        "h-full aspect-[100/127] bg-blue-600 rounded-lg hover:bg-blue-800 flex flex-col justify-center items-center py-6",
        (pending || disabled) &&
          "opacity-75 hover:bg-blue-600 cursor-not-allowed"
      )}
      onClick={handleClick}
    >
      <Plus className="!h-12 !w-12 text-white stroke-1" />
      <p>{t("newBoard")}</p>
    </Button>
  );
}

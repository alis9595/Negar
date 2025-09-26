"use client";

import { DropdownMenuContentProps } from "@radix-ui/react-dropdown-menu";
import { ReactNode } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link2, Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useApiMutation } from "@/hooks/useApiMutation";
import { api } from "@/convex/_generated/api";
import { Confirm } from "@/components/modals/Confirm";
import { Button } from "@/components/ui/button";
import { useRenameModal } from "@/store/useRenameModal";

interface Props {
  id: string;
  title: string;
  children: ReactNode;
  side?: DropdownMenuContentProps["side"];
  sideOffset?: DropdownMenuContentProps["sideOffset"];
}

export function Action({ id, title, children, side, sideOffset }: Props) {
  const t = useTranslations("Actions");
  const { mutate, pending } = useApiMutation(api.board.remove);
  const { onOpen } = useRenameModal();

  const onCopyLink = () => {
    navigator.clipboard
      .writeText(`${window.location.origin}/board/${id}`)
      .then(() => toast.success(t("copySuccess")))
      .catch(() => toast.error(t("copyFailure")));
  };

  const onDelete = () => {
    mutate({ id })
      .then(() => toast.success(t("deleteSuccess")))
      .catch(() => toast.error(t("deleteFailure")));
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        side={side}
        sideOffset={sideOffset}
        className="w-60 text-black"
        onClick={(e) => e.stopPropagation()}
      >
        <DropdownMenuItem className="p-3 cursor-pointer" onClick={onCopyLink}>
          <Link2 className="h-4 w-4 me-2" />
          {t("copyLink")}
        </DropdownMenuItem>
        <Confirm
          header={t("deleteModalHeader")}
          description={t("deleteModalDescription")}
          disabled={pending}
          onConfirm={onDelete}
        >
          <Button
            variant={"ghost"}
            className="p-3 cursor-pointer text-sm font-normal w-full justify-start"
          >
            <Trash2 className="h-4 w-4 me-2" />
            {t("delete")}
          </Button>
        </Confirm>
        <DropdownMenuItem
          className="p-3 cursor-pointer"
          onClick={() => onOpen(id, title)}
        >
          <Pencil className="h-4 w-4 me-2" />
          {t("rename")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

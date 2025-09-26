"use client";

import { FormEventHandler, useState } from "react";
import { useRenameModal } from "@/store/useRenameModal";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { useApiMutation } from "@/hooks/useApiMutation";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

export function Rename() {
  const { mutate, pending } = useApiMutation(api.board.update);
  const { isOpen, initialValues, onClose } = useRenameModal();
  const t = useTranslations("Modals.Rename");
  const [title, setTitle] = useState(initialValues.title);

  const submitHandler: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    mutate({
      id: initialValues.id,
      title,
    })
      .then(() => {
        toast.success(t("renameSuccess"));
        onClose();
      })
      .catch(() => toast.error(t("renameFailure")));
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>
        <DialogDescription>{t("description")}</DialogDescription>
        <form onSubmit={submitHandler} className="space-y-4">
          <Input
            disabled={pending}
            required
            maxLength={60}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t("placeholder")}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant={"outline"}>
                {t("cancel")}
              </Button>
            </DialogClose>
            <Button disabled={pending} type="submit">
              {t("save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

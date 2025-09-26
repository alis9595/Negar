"use client";

import { Button } from "@/components/ui/button";
import Hint from "@/components/layout/Hint";
import { useDeleteLayers } from "@/hooks/useDeleteLayers";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface Props {}

export function DeleteButton({}: Props) {
  const t = useTranslations("SelectionTools.delete");
  const deleteLayers = useDeleteLayers();
  return (
    <div className="flex justify-center items-center pl-2 ml-2 border-s border-neutral-200">
      <Hint label={t("delete")}>
        <Button variant={"board"} size={"icon"} onClick={deleteLayers}>
          <Trash2 />
        </Button>
      </Hint>
    </div>
  );
}

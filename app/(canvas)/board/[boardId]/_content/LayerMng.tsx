"use client";

import { Button } from "@/components/ui/button";
import Hint from "@/components/layout/Hint";
import { useMutation, useSelf } from "@liveblocks/react";
import { BringToFront, SendToBack } from "lucide-react";
import { useTranslations } from "next-intl";
import { memo } from "react";

interface Props {}

export const LayerMng = memo(({}: Props) => {
  const t = useTranslations("SelectionTools.layer");
  const selection = useSelf((me) => me.presence.selection);

  const bringToFront = useMutation(
    ({ storage }) => {
      const liveLayerIds = storage.get("layerIds");
      const indices: number[] = [];
      const array = liveLayerIds.toImmutable();

      for (let i = 0; i < array.length; i++) {
        if (selection?.includes(array[i])) indices.push(i);
      }

      for (let i = indices.length - 1; i >= 0; i--)
        liveLayerIds.move(
          indices[i],
          array.length - 1 - (indices.length - 1 - i)
        );
    },
    [selection]
  );

  const sendToBack = useMutation(
    ({ storage }) => {
      const liveLayerIds = storage.get("layerIds");
      const indices: number[] = [];
      const array = liveLayerIds.toImmutable();

      for (let i = 0; i < array.length; i++) {
        if (selection?.includes(array[i])) indices.push(i);
      }

      for (let i = 0; i < indices.length; i++) liveLayerIds.move(indices[i], i);
    },
    [selection]
  );

  return (
    <div className="flex flex-col gap-y-0.5">
      <Hint label={t("bringToFront")}>
        <Button variant={"board"} size={"icon"} onClick={bringToFront}>
          <BringToFront />
        </Button>
      </Hint>
      <Hint label={t("sendToBack")}>
        <Button variant={"board"} size={"icon"} onClick={sendToBack}>
          <SendToBack />
        </Button>
      </Hint>
    </div>
  );
});

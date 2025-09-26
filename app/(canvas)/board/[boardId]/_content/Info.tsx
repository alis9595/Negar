"use client";

import { Action } from "@/components/layout/Action";
import { Button } from "@/components/ui/button";
import Hint from "@/components/layout/Hint";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { useRenameModal } from "@/store/useRenameModal";
import { useQuery } from "convex/react";
import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { Poppins } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

type TInfoProps = {
  boardId: string;
};

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

export default function Info({ boardId }: TInfoProps) {
  const data = useQuery(api.board.get, { id: boardId as Id<"boards"> });
  const { onOpen } = useRenameModal();
  const t = useTranslations("Cnavas.info");

  if (!data) return <Info.Skeleton />;

  return (
    <div
      className="absolute top-2 left-2 bg-white rounded-md px-1.5 py-3 h-12 flex items-center shadow-md"
      dir="ltr"
    >
      <Hint label={t("logoHint")} side="bottom" sideOffset={10}>
        <Link href={"/"} className="flex items-center gap-x-4 px-2">
          <Image src="/logo.svg" alt="logo" width={40} height={40} />
          <span className={cn("font-semibold text-xl -ms-2", font.className)}>
            Negar
          </span>
        </Link>
      </Hint>
      <Separator orientation="vertical" className="mx-2" />
      <Hint label={t("titleHint")} side="bottom" sideOffset={10}>
        <Button
          variant={"board"}
          className="text-base px-2"
          onClick={() => onOpen(data._id, data.title)}
        >
          {data.title}
        </Button>
      </Hint>
      <Separator orientation="vertical" className="mx-2" />
      <Action id={data._id} title={data.title} side="bottom" sideOffset={10}>
        <div dir={t("menuHint") === "منو" ? "rtl" : "ltr"}>
          <Hint label={t("menuHint")} side="bottom" sideOffset={10}>
            <Button variant={"board"} size={"icon"}>
              <Menu></Menu>
            </Button>
          </Hint>
        </div>
      </Action>
    </div>
  );
}

Info.Skeleton = function InfoSkeleton() {
  return (
    <div className="absolute top-2 start-2 bg-white rounded-md h-12 w-80 flex items-center shadow-md">
      <Skeleton className="h-full w-full" />
    </div>
  );
};

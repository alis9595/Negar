"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import { formatDistanceToNow } from "date-fns";
import { faIR, enUS } from "date-fns/locale";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useApiMutation } from "@/hooks/useApiMutation";
import { Action } from "@/components/layout/Action";
import { MouseEvent } from "react";

export default function BoardCard({
  _creationTime,
  _id,
  authorId,
  authorName,
  imageUrl,
  isFavorite,
  orgId,
  title,
}: {
  _id: string;
  _creationTime: number;
  title: string;
  imageUrl: string;
  authorId: string;
  authorName: string;
  orgId: string;
  isFavorite: boolean;
}) {
  const { userId } = useAuth();
  const t = useTranslations("BoardCard");

  const authorLabel = userId === authorId ? t("you") : authorName;
  const createdAtLabel = formatDistanceToNow(_creationTime, {
    addSuffix: true,
    locale: t("you") === "You" ? enUS : faIR, //checks whether its ltr or rtl
  });

  const { mutate: onFavorite, pending: pendingFavorite } = useApiMutation(
    api.board.favorite
  );
  const { mutate: onUnFavorite, pending: pendingUnFavorite } = useApiMutation(
    api.board.unFavorite
  );

  const toggleFavorite = () =>
    isFavorite
      ? onUnFavorite({ id: _id, orgId }).catch(() =>
          toast.error(t("unFavFailure"))
        )
      : onFavorite({ id: _id, orgId }).catch(() =>
          toast.error(t("favFailure"))
        );

  return (
    <Link
      href={`/board/${_id}`}
      className="group aspect-[100/127] border rounded-lg flex flex-col justify-between overflow-hidden"
    >
      <div className="relative flex-1 bg-amber-50">
        <Image src={imageUrl} alt={title} fill className="object-fill p-2" />
        <Overlay />
        <Action id={_id} title={title} side={"right"}>
          <Button
            variant={"ghost"}
            className="absolute top-1 end-1 opacity-0 group-hover:opacity-100 transition-opacity p-3 outline-none !bg-transparent"
          >
            <MoreHorizontal className="text-white opacity-75 hover:opacity-100 transition-opacity" />
          </Button>
        </Action>
      </div>
      <Footer
        {...{
          title,
          authorLabel,
          createdAtLabel,
          isFavorite,
          disabled: pendingFavorite || pendingUnFavorite,
          onClick: toggleFavorite,
        }}
      />
    </Link>
  );
}

BoardCard.Skeleton = function BoardCardSkeleton() {
  return (
    <div className=" aspect-[100/127] rounded-lg overflow-hidden">
      <Skeleton className="h-full w-full" />
    </div>
  );
};

function Footer({
  title,
  authorLabel,
  createdAtLabel,
  isFavorite,
  disabled,
  onClick,
}: {
  title: string;
  authorLabel: string;
  createdAtLabel: string;
  isFavorite: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onClick();
  };

  return (
    <div className="relative p-3">
      <p className="text-sm truncate max-w-[calc(100%-20px)]">{title}</p>
      <p className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-muted-foreground truncate">
        {authorLabel}, {createdAtLabel}
      </p>
      <Button
        variant={"ghost"}
        disabled={disabled}
        onClick={(e) => handleClick(e)}
        className={cn(
          "opacity-0 group-hover:opacity-100 transition-opacity !bg-transparent absolute top-0 end-0 text-muted-foreground hover:text-sky-600"
        )}
      >
        <Star
          className={cn("h-4 w-4", isFavorite && "fill-sky-600 text-sky-600")}
        />
      </Button>
    </div>
  );
}

function Overlay() {
  return (
    <div className="opacity-0 group-hover:opacity-50 transition-opacity h-full w-full bg-black" />
  );
}

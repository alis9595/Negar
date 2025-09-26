"use client";

import EmptyBoards from "../empty/EmptyBoards";
import EmptyFavorites from "../empty/EmptyFavorites";
import EmptySearch from "../empty/EmptySearch";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useTranslations } from "next-intl";
import BoardCard from "./BoardCard";
import { NewBoardButton } from "./NewBoardButton";
import { useSearchParams } from "next/navigation";

type TBoardListProps = {
  orgId: string;
};

export default function BoardList({ orgId }: TBoardListProps) {
  const params = useSearchParams();
  const query = {
    search: params.get("search") ?? undefined,
    favorites: params.get("favorites") ?? undefined,
  };
  const t = useTranslations("BoardsList");
  const data:
    | {
        _id: string;
        _creationTime: number;
        orgId: string;
        title: string;
        authorId: string;
        authorName: string;
        imageUrl: string;
        isFavorite: boolean;
      }[]
    | undefined = useQuery(api.boards.get, { orgId, ...query });

  if (data === undefined)
    return (
      <div className="self-start w-full">
        <h2 className="text-3xl">
          {t(query.favorites ? "favBoards" : "teamBoards")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10">
          <NewBoardButton orgId={orgId} disabled />
          <BoardCard.Skeleton />
          <BoardCard.Skeleton />
          <BoardCard.Skeleton />
          <BoardCard.Skeleton />
          <BoardCard.Skeleton />
        </div>
      </div>
    );

  if (!data?.length && query.search) return <EmptySearch />;

  if (!data?.length && query.favorites) return <EmptyFavorites />;

  if (!data?.length) return <EmptyBoards />;

  return (
    <div className="self-start w-full">
      <h2 className="text-3xl">
        {t(query.favorites ? "favBoards" : "teamBoards")}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10">
        <NewBoardButton orgId={orgId} />
        {data!.map((board) => (
          <BoardCard key={board._id} {...board} />
        ))}
      </div>
    </div>
  );
}

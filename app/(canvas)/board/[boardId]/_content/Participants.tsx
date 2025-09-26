"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useOthers, useSelf } from "@liveblocks/react";
import UserAvatar from "./UserAvatar";
import { useTranslations } from "next-intl";
import { connectionIdToColor } from "@/lib/utils";
import LocaleSwitcher from "@/components/locale/LocaleSwitcher";

const MAX_SHOWN_USERS = 2;

export default function Participants() {
  const t = useTranslations("Participants");
  const users = useOthers();
  const currentUser = useSelf();
  const hasMoreUsers = users.length > MAX_SHOWN_USERS; //maximum number of shown users

  return (
    <div
      className="absolute top-2 right-2 h-12 flex items-center gap-x-5"
      dir={"ltr"}
    >
      <LocaleSwitcher />
      <div className="flex flex-row-reverse bg-white rounded-md p-3 gap-x-2 shadow-md ml-auto">
        {users.slice(0, MAX_SHOWN_USERS).map(({ connectionId, info }) => {
          return (
            <UserAvatar
              key={connectionId}
              src={info?.avatar}
              name={info?.name}
              fallback={info?.name?.at(0) || "A"}
              borderColor={connectionIdToColor(connectionId)}
            />
          );
        })}
        {currentUser && (
          <UserAvatar
            src={currentUser.info.avatar}
            name={currentUser.info.name}
            fallback={currentUser.info.name?.at(0) || "A"}
            borderColor={connectionIdToColor(currentUser.connectionId)}
          />
        )}
        {hasMoreUsers && (
          <UserAvatar
            name={`${users.length - MAX_SHOWN_USERS} ${t("more")}`}
            fallback={`+${users.length - MAX_SHOWN_USERS}`}
          />
        )}
      </div>
    </div>
  );
}

Participants.Skeleton = function ParticipantsSkeleton() {
  return (
    <div className="absolute top-2 end-2 bg-white rounded-md h-12 w-28 flex items-center shadow-md">
      <Skeleton className="h-full w-full" />
    </div>
  );
};

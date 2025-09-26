"use client";

import Hint from "@/components/layout/Hint";
import { cn } from "@/lib/utils";
import { useOrganization, useOrganizationList } from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function List() {
  const { userMemberships } = useOrganizationList({
    userMemberships: { infinite: true },
  });

  if (!userMemberships.data?.length) return null;
  return (
    <ul className="relative space-y-4">
      {userMemberships.data.map((member) => (
        <ListItem {...member.organization} key={member.organization.id} />
      ))}
    </ul>
  );
}

type TListItemProps = {
  id: string;
  name: string;
  imageUrl: string;
};

export const ListItem = ({ id, name, imageUrl }: TListItemProps) => {
  const locale = useTranslations("Direction");
  const { organization } = useOrganization();
  const { setActive } = useOrganizationList();

  const isActive = organization?.id === id;

  const handleClick = () => {
    if (!setActive) return null;

    setActive({ organization: id });
  };
  return (
    <Hint label={name} side={locale("dir") === "ltr" ? "right" : "left"}>
      <Image
        src={imageUrl}
        alt={name}
        width={40}
        height={40}
        className={cn(
          "rounded-md cursor-pointer opacity-75 hover:opacity-100 transition",
          isActive && "opacity-100"
        )}
        onClick={handleClick}
      />
    </Hint>
  );
};

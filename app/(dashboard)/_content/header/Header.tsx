"use client";

import Search from "@/components/inputs/Search";
import { useOrganization, UserButton } from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import InviteButton from "./InviteButton";
import LocaleSwitcher from "@/components/locale/LocaleSwitcher";

export default function Header() {
  const t = useTranslations("Header");
  const { organization } = useOrganization();
  return (
    <header className="flex justify-between items-center gap-x-4 p-5">
      <Search placeholder={t("search.placeholder")} />
      <div className="flex items-center gap-3">
        {organization && <InviteButton />}
        <LocaleSwitcher />
        <UserButton />
      </div>
    </header>
  );
}

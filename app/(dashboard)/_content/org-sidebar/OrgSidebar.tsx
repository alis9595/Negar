"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { OrganizationSwitcher } from "@clerk/nextjs";
import { LayoutDashboard, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { Poppins } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

export default function OrgSidebar() {
  const t = useTranslations("OrgSidebar");
  const favorites = useSearchParams().get("favorites");
  return (
    <div className="hidden lg:flex flex-col space-y-4 w-52 p-5">
      <Link
        href={"/"}
        className={cn("flex items-center gap-3 text-xl", font.className)}
      >
        <Image src={"/logo.svg"} alt="Logo" width={60} height={60} />
        Negar
      </Link>
      <OrganizationSwitcher
        hidePersonal
        appearance={{
          elements: {
            rootBox: { width: "100%" },
            organizationSwitcherTrigger: {
              padding: "6px",
              width: "100%",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              justifyContent: "space-between",
            },
          },
        }}
      />
      <Link href={"/"}>
        <Button
          variant={favorites ? "ghost" : "secondary"}
          size={"lg"}
          className="w-full justify-start !px-2"
        >
          <LayoutDashboard className="size-4" />
          {t("teamBoards")}
        </Button>
      </Link>
      <Link href={{ pathname: "/", query: { favorites: true } }}>
        <Button
          variant={favorites ? "secondary" : "ghost"}
          size={"lg"}
          className="w-full justify-start !px-2"
        >
          <Star className="size-4" />
          {t("favBoards")}
        </Button>
      </Link>
    </div>
  );
}

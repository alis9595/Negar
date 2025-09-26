"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { OrganizationProfile } from "@clerk/nextjs";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

export default function InviteButton() {
  const t = useTranslations("Header.invite");
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"}>
          <Plus className="size-4 me-2" />
          {t("label")}
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0 bg-transparent border-none !max-w-max min-w-max">
        <OrganizationProfile />
      </DialogContent>
    </Dialog>
  );
}

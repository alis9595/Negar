"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CreateOrganization } from "@clerk/nextjs";
import { Plus } from "lucide-react";

export default function NewButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-white/25 rounded-md w-10 h-10 aspect-square cursor-pointer">
          <Plus className="text-white" />
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0 bg-transparent border-none w-max">
        <CreateOrganization />
      </DialogContent>
    </Dialog>
  );
}

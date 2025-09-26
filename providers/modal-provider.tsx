"use client";

import { Rename } from "@/components/modals/Rename";
import { useEffect, useState } from "react";

export default function ModalProvider() {
  const [isMounted, setIsMounted] = useState(false);

  // to make sure they are rendered only in client side
  useEffect(() => setIsMounted(true), []);

  if (!isMounted) return null;
  return (
    <>
      {/* add all the modals */}
      <Rename />
    </>
  );
}

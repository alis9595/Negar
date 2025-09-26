"use client";

import Image from "next/image";

function Loading() {
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <Image
        src={"/logo.svg"}
        alt="Logo"
        width={120}
        height={120}
        className="animate-pulse duration-700"
      />
    </div>
  );
}

export { Loading };

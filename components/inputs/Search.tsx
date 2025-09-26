"use client";

import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import qs from "query-string";
import { useDebounceValue } from "usehooks-ts";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

type TSearchProps = {
  placeholder: string;
};

export default function Search({ placeholder }: TSearchProps) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const debouncedValue = useDebounceValue(value, 500)[0];

  useEffect(() => {
    const url = qs.stringifyUrl(
      { url: "/", query: { search: debouncedValue } },
      { skipEmptyString: true, skipNull: true }
    );

    router.push(url);
  }, [debouncedValue, router]);

  return (
    <div className="relative w-full">
      <SearchIcon className="absolute inset-y-0 my-auto start-3 text-muted-foreground size-4" />
      <Input
        className="w-full max-w-lg ps-9"
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
        value={value}
      />
    </div>
  );
}

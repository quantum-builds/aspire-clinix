"use client";
import { SearchIcon } from "@/assets";
import Image from "next/image";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SearchBar({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [search, setSearch] = useState(
    searchParams.get("query")?.toString() || ""
  );

  function handleSearch(query: string) {
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set("query", query);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }

  // debounce search
  useEffect(() => {
    const timeout = setTimeout(() => {
      handleSearch(search);
    }, 500);

    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <div className="relative flex flex-1 flex-shrink-0 2xl:h-[60px] h-[50px] 2xl:w-[400px] w-[300px] ">
      <input
        className="peer block w-full rounded-full py-2 pl-5 pr-2 border border-green text-base font-medium outline-none placeholder:text-lightBlack"
        placeholder={placeholder}
        onChange={(e) => setSearch(e.target.value)}
        value={search}
        autoFocus
      />

      <div className="absolute right-3 top-1/2 -translate-y-1/2 2xl:w-11 2xl:h-11 h-9 w-9 rounded-full bg-[#F3F5F7] flex justify-center items-center">
        <Image
          src={SearchIcon}
          alt="Dropdown Icon"
          className="2xl:w-5 2xl:h-5 w-4 h-4"
        />
      </div>
    </div>
  );
}

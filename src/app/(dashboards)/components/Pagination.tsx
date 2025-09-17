"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { NextIcon, PreviousIcon } from "@/assets";
import Image from "next/image";

interface PaginationProps {
  page: number;
}

export default function Pagination({ page = 1 }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const formatPage = (page: number) => {
    return page < 10 ? `0${page}` : `${page}`;
  };

  const setPageInQuery = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.push(`?${params.toString()}`);
  };

  const handlePrevious = () => {
    if (page > 1) {
      setPageInQuery(page - 1);
    }
  };

  const handleNext = () => {
    setPageInQuery(page + 1);
  };

  return (
    <div className="w-full flex justify-end">
      <div className="flex h-14 items-center justify-between rounded-full bg-white p-2 min-w-[311px]">
        <div
          onClick={handlePrevious}
          className="w-10 h-10 rounded-full bg-[#F3F5F7] flex justify-center items-center cursor-pointer"
        >
          <Image src={PreviousIcon} alt="Previous Icon" className="w-5 h-5" />
        </div>
        <div className="flex items-center justify-between gap-[29px]">
          <p className="tracking-tightest">Previous</p>
          <p className="bg-[#F3F5F7] h-8 px-2 rounded-lg flex items-center justify-center">
            {formatPage(page)}
          </p>
          <p className="tracking-tightest">Next</p>
        </div>
        <div
          onClick={handleNext}
          className="w-10 h-10 rounded-full bg-[#F3F5F7] flex justify-center items-center cursor-pointer"
        >
          <Image src={NextIcon} alt="Next Icon" className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

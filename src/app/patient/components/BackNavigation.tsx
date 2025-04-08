"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackNavigation() {
  const router = useRouter();
  return (
    <ArrowLeft
      size={30}
      onClick={() => router.back()}
      className="cursor-pointer hidden md:flex mt-3 ml-9"
    />
  );
}

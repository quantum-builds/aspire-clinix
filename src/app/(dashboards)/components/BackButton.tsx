"use client";
import { BackButtonIcon } from "@/assets";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      className="bg-dashboardBarBackground px-6 py-3 rounded-full flex items-center justify-center gap-1"
      onClick={() => router.back()}
    >
      <Image src={BackButtonIcon} alt="back button icon" className="w-4 h-4" />
      Back
    </button>
  );
}

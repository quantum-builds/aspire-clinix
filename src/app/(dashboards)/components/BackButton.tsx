"use client";
import { BackButtonIcon } from "@/assets";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface BackButtonProps {
  className?: string;
  backToWebsite?: boolean;
  text?: string;
}
export default function BackButton({
  className,
  backToWebsite = false,
  text,
}: BackButtonProps) {
  const router = useRouter();

  return (
    <button
      className={cn(
        "bg-dashboardBarBackground px-6 py-3 rounded-full flex items-center justify-center gap-1",
        className
      )}
      onClick={() => (backToWebsite ? router.replace("/") : router.back())}
    >
      <Image src={BackButtonIcon} alt="back button icon" className="w-4 h-4" />
      {text ? text : "Back"}
    </button>
  );
}

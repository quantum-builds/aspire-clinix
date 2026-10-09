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

  const handleBack = () => {
    if (backToWebsite) {
      router.replace("https://www.theaspireclinic.com/");
      return;
    }

    // If the patient arrived from Stripe, skip the Stripe page in history
    let cameFromStripe = false;
    try {
      cameFromStripe =
        !!document.referrer &&
        new URL(document.referrer).hostname.endsWith("stripe.com");
    } catch {}

    if (cameFromStripe && window.history.length > 2) {
      window.history.go(-2);
      return;
    }

    router.back();
  };

  return (
    <button
      className={cn(
        "bg-dashboardBarBackground px-6 py-3 rounded-full flex items-center justify-center gap-1",
        className
      )}
      onClick={handleBack}
    >
      <Image src={BackButtonIcon} alt="back button icon" className="w-4 h-4" />
      {text ? text : "Back"}
    </button>
  );
}
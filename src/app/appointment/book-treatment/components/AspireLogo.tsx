"use client";
import Image from "next/image";
import { AspireDarkLogo } from "@/assets";
import { useRouter } from "next/navigation";

interface AspireLogoProps {
  navigationLink?: string;
}

export default function AspireLogo({ navigationLink = "/" }: AspireLogoProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(navigationLink); // Navigate to the home page
  };

  return (
    <div onClick={handleClick} className="cursor-pointer">
      <Image
        src={AspireDarkLogo}
        alt="Aspire Clinic"
        className="zoom-out w-[150px] h-[70px] 2xl:w-[189px] 2xl:h-[88px]"
      />
    </div>
  );
}

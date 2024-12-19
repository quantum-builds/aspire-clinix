
"use client";

import { AspireDarkLogo, AspireLightLogo } from "@/assets";
import Image from "next/image";
import HeroMenu from "./HeroMenu";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface HeroSectionProps {
  title: string;
  description?: string | null;
  descLineHeight?: number | null;
  contentWidth?: number | null;
  backgroundColor: string;
  buttonColor: string;
  textColor?: string;
}

export default function HeroSection({
  title,
  description,
  descLineHeight,
  contentWidth,
  backgroundColor,
  buttonColor,
  textColor,
}: HeroSectionProps) {
  const pathname = usePathname();
  return (
    <div
      className="flex flex-col items-center h-screen relative"
      style={{ backgroundColor }}
    >
      {/* Header Section */}
      {pathname === "/fee-guide" ? (
        <header className="flex justify-between items-center container mx-auto px-3 p-0 m-0 z-20 mt-3">
          <HeroMenu backgroundColor="white" />
          <Image
            src={AspireLightLogo}
            alt="Aspire Clinix"
            width={80}
            height={88}
            className="flex justify-center items-center ml-5 md:ml-32 w-[80px] h-[40px] md:w-[189px] md:h-[88px]"
          />
          <Link href="/book-treatment" scroll={false}>
            <button
              className="px-1 flex justify-center items-center lg:px-[20px] sm:px-[2px] py-2 sm:py-[20px] sm:ml-10 md:ml-1 rounded-md sm:rounded-[20px] text-sm sm:text-[20px] font-normal font-opus"
              style={{ backgroundColor: buttonColor }}
            >
              <span className="block sm:hidden">Appointment</span>
              <span className="hidden sm:block">BOOK A TREATMENT</span>
            </button>
          </Link>
        </header>
      ) : (
        <header className="flex justify-between items-center container mx-auto px-3 sm:px-0 p-0 m-0 z-20 mt-3">
          <HeroMenu />
          <Image
            src={AspireDarkLogo}
            alt="Aspire Clinix"
            width={80}
            height={88}
            className="flex justify-center items-center ml-5 md:ml-32 w-[80px] h-[40px] md:w-[189px] md:h-[88px]"
          />
          <Link href="/book-treatment" scroll={false}>
            <button
              className="px-1 flex justify-center items-center lg:px-[20px] sm:px-[2px] py-2 sm:py-[20px] sm:ml-10 md:ml-1 rounded-md sm:rounded-[20px] text-sm sm:text-[20px] font-normal font-opus"
              style={{ backgroundColor: buttonColor }}
            >
              <span className="block sm:hidden">Appointment</span>
              <span className="hidden sm:block">BOOK A TREATMENT</span>
            </button>
          </Link>
        </header>
      )}

      {/* Main Content */}
      <div
        className="flex flex-col justify-center items-center gap-4 sm:gap-[59px] h-full"
        style={{ width: contentWidth ? `${contentWidth}%` : "100%" }}
      >
        {/* Title */}
        <p
          className="text-center w-[80%] font-opus text-[16px] font-normal md:text-[64px] md:leading-[70px] lg:text-[70px] lg:leading-[100px]"
          style={{
            color: textColor,
          }}
        >
          {title}
        </p>

        {/* Description */}
        {description && descLineHeight && (
          <p
            className="text-center font-gillSans text-[16px] w-[65%] md:text-[32px] px-4 sm:px-5"
            style={{
              lineHeight: `${descLineHeight}px`,
              color: textColor,
            }}
          >
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

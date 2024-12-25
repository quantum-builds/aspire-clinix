"use client";

import { AspireDarkLogo, AspireLightLogo } from "@/assets";
import Image, { StaticImageData } from "next/image";
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
  const renderHeader = (logoSrc: StaticImageData) => (
    <header className="flex gap-[11rem] md:gap-[30rem] lg:gap-[46rem] xl:gap-[58rem] xxl-gap-[90rem] h-[160px] justify-center items-center container mx-auto px-3 p-0 m-0 z-20 mt-3">
      <div>
        <HeroMenu
          backgroundColor={pathname === "/fee-guide" ? "white" : undefined}
        />
      </div>
      <div className="absolute left-1/2 transform -translate-x-1/2">
      <Link href="/" scroll={false}>
        <Image
          src={logoSrc}
          alt="Aspire Clinix"
          width={80}
          height={88}
          className="flex justify-center items-center w-[80px] h-[40px] md:w-[189px] md:h-[88px]"
        />
      </Link>
      </div>
      <div>
        <Link href="/book-treatment" scroll={false}>
          <button
            className="px-1 flex justify-center items-center w-[100px] h-[50px] md:w-[170px] md:h-[60px] lg:w-[277px] lg:h-[77px] font-normal font-opus rounded-[5px] md:rounded-[20px]"
            style={{ backgroundColor: buttonColor }}
          >
            BOOK A TREATMENT
          </button>
        </Link>
      </div>
    </header>
  );
  return (
    <div
      className="flex flex-col items-center h-screen relative"
      style={{ backgroundColor }}
    >
      {/* Header Section */}
      {renderHeader(
        pathname === "/fee-guide" ? AspireLightLogo : AspireDarkLogo
      )}

      {/* Main Content */}
      <div
        className="flex flex-col justify-center items-center gap-4 sm:gap-[59px] h-full"
        style={{ width: contentWidth ? `${contentWidth}%` : "100%" }}
      >
        {/* Title */}
        <p
          className="text-center w-[60%] font-opus text-[16px] font-normal md:text-[64px] md:leading-[70px] lg:text-[70px] lg:leading-[100px]"
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

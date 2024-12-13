import { AspireDarkLogo } from "@/assets";
import Image from "next/image";
import HeroMenu from "./HeroMenu";
import Link from "next/link";

interface HeroSectionProps {
  title: string;
  description?: string | null;
  titleTextSize?: number;
  titleLineHeight?: number;
  descTextSize?: number | null;
  descLineHeight?: number | null;
  contentWidth?: number | null;
  backgroundColor: string;
  buttonColor: string;
  textColor?: string;
}

export default function HeroSection({
  title,
  description,
  titleTextSize,
  titleLineHeight,
  descTextSize,
  descLineHeight,
  contentWidth,
  backgroundColor,
  buttonColor,
  textColor,
}: HeroSectionProps) {
  return (
    <div
      className={`flex flex-col items-center h-screen relative`}
      style={{ backgroundColor }}
    >
      {/* Header Section */}
      <header className="flex justify-between w-full items-center h-[200px] px-4 sm:px-[8%] leading-[27.27px] tracking-widest text-lg sm:text-2xl">
        <HeroMenu />
        <Image
          src={AspireDarkLogo}
          alt="Aspire Clinix"
          width={189}
          height={88}
          className="ml-4 sm:ml-64"
        />
        <Link href="/book-treatment" scroll={false}>
          <button
            className="px-4 sm:px-[19px] py-2 sm:py-[28px] rounded-md sm:rounded-[20px] text-sm sm:text-[20px] font-normal font-opus"
            style={{ backgroundColor: buttonColor }}
          >
            BOOK A TREATMENT
          </button>
        </Link>
      </header>

      {/* Main Content */}
      <div
        className={`flex flex-col justify-center items-center gap-4 sm:gap-[59px] h-full`}
        style={{ width: contentWidth ? `${contentWidth}%` : "100%" }}
      >
        {/* Title */}
        <p
          className="text-center font-opus text-sm font-normal sm:text-[18px] md:text-[40px] md:leading-[70px] lg:text-[70px] lg:leading-[100px]"
          style={{
            fontSize: `${titleTextSize}px`,
            lineHeight: `${titleLineHeight}px`,
            color: textColor,
          }}
        >
          {title}
        </p>

        {/* Description */}
        {description && descTextSize && descLineHeight && (
          <p
            className="text-center font-sans text-xs sm:text-sm md:text-base px-4 sm:px-0"
            style={{
              fontSize: `${descTextSize}px`,
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

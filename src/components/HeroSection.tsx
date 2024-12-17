import { AspireDarkLogo } from "@/assets";
import Image from "next/image";
import HeroMenu from "./HeroMenu";
import Link from "next/link";

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
  return (
    <div
      className={`flex flex-col items-center h-screen relative`}
      style={{ backgroundColor }}
    >
      {/* Header Section */}
      <header className="flex justify-between w-full items-center h-[200px] px-2 sm:px-[8%] leading-[27.27px] tracking-widest text-lg sm:text-2xl">
        <HeroMenu />
        <Image
          src={AspireDarkLogo}
          alt="Aspire Clinix"
          width={80}
          height={88}
          className="flex justify-center items-center md:ml-12 w-[80px] h-[40px] sm:w-[189px] sm:h-[88px]"
        />
        <Link href="/book-treatment" scroll={false}>
          <button
            className="px-1 flex justify-center items-center sm:px-[19px] py-2 sm:py-[28px] sm:ml-10 md:ml-1 rounded-md sm:rounded-[20px] text-sm sm:text-[20px] font-normal font-opus"
            style={{ backgroundColor: buttonColor }}
          >
            {/* BOOK A TREATMENT */}
            <span className="block sm:hidden">Appointment</span>
            <span className="hidden sm:block">BOOK A TREATMENT</span>
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
          className="text-center font-opus text-[16px] font-normal md:text-[64px] md:leading-[70px] lg:text-[70px] lg:leading-[100px]"
          style={{
            color: textColor,
          }}
        >
          {title}
        </p>

        {/* Description */}
        {description && descLineHeight && (
          <p
            className="text-center font-gillSans text-[16px] md:text-[32px] px-4 sm:px-5px"
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

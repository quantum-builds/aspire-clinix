"use client";

import { AspireDarkLogo, AspireLightLogo } from "@/assets";
import Image, { StaticImageData } from "next/image";
import HeroMenu from "./HeroMenu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import LogoutButton from "./LogoutButton";

interface HeroSectionProps {
  title: string | null;
  description?: string | null;
  descLineHeight?: number | null;
  contentWidth?: number | null;
  backgroundColor: string;
  buttonColor: string;
  textColor?: string;
  headingFontSize?: string;
  isVideo?: boolean;
  backgroundContent?: string | StaticImageData;
}

export default function HeroSection({
  title,
  description,
  descLineHeight,
  contentWidth,
  backgroundColor,
  buttonColor,
  textColor,
  headingFontSize,
  isVideo,
  backgroundContent,
}: HeroSectionProps) {
  const pathname = usePathname();
  const renderHeader = (logoSrc: StaticImageData) => (
    <header className="  flex justify-between items-center absolute w-full top-0 h-16 md:h-32 px-5 lg:px-12 z-20">
      <div className="flex-1">
        <HeroMenu
          backgroundColor={pathname === "/fee-guide" ? "white" : undefined}
        />
      </div>
      <Link href="/" scroll={false}>
        <Image
          src={logoSrc}
          alt="Aspire Clinix"
          width={80}
          height={88}
          className="zoom-out flex items-center justify-center w-[80px] h-[40px] md:w-[189px] md:h-[88px] "
        />
      </Link>
      <div className="zoom-out flex-1">
        <Link href="/book-treatment" scroll={false}>
          <button
            className="flex justify-center items-center ml-auto w-[90px] h-[42px] md:w-[170px] md:h-[60px] lg:w-[277px] lg:h-[77px] font-normal md:text-[20px] text-[13px] font-opus rounded-[5px] md:rounded-[20px]"
            style={{ backgroundColor: buttonColor }}
          >
            BOOK A TREATMENT
          </button>
        </Link>
      </div>
      {/* <LogoutButton /> */}
    </header>
  );
  return (
    <div
      className="flex flex-col items-center justify-center h-screen relative overflow-hidden"
      style={{ backgroundColor }}
    >
      {backgroundContent &&
        (isVideo ? (
          <video
            className="absolute top-0 left-0 w-full h-full  object-cover"
            src={backgroundContent as string}
            style={{ height: "100vh" }}
            autoPlay
            loop
            muted
          ></video>
        ) : (
          <Image
            className="absolute top-0 left-0 w-full h-full object-cover"
            alt="Background Image"
            src={backgroundContent as StaticImageData}
          />
        ))}

      {/* Header Section */}
      {renderHeader(
        pathname === "/fee-guide" ? AspireLightLogo : AspireDarkLogo
      )}

      {/* Main Content */}
      <div
        className="zoom-out flex flex-col justify-center items-center gap-5 lg:gap-4 mt-16"
        style={{ width: contentWidth ? `${contentWidth}%` : "100%" }}
      >
        {/* Title */}
        <h1
          className={clsx(
            "text-center md:w-[500px] z-10 lg:w-[766px] xl:w-[1143px] w-[350px] font-opus font-normal md:leading-[70px] lg:leading-[100px]",
            headingFontSize
          )}
          style={{
            color: textColor,
          }}
        >
          {title}
        </h1>

        {/* Description */}
        {description && descLineHeight && (
          <p
            className="text-center font-gillSans z-10 text-[16px] lg:w-[837px] lg:h-[126px]  md:text-[32px] px-4 sm:px-5"
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

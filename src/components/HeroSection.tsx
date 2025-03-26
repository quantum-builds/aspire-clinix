"use client";

import { AspireDarkLogo, AspireLightLogo, image1 } from "@/assets";
import Image, { StaticImageData } from "next/image";
import HeroMenu from "./HeroMenu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import LogoutButton from "./LogoutButton";

interface HeroSectionProps {
  title: string | null;
  description?: string | null;
  descTextSize?: number | null;
  descLineHeight?: number | null;
  contentWidth?: number | null;
  backgroundColor: string;
  buttonColor: string;
  textColor?: string;
  titleFontSize?: string;
  isVideo?: boolean;
  backgroundContent?: string | StaticImageData;
  heading?: string | null;
  headingSize?: number | null;
}

export default function HeroSection({
  title,
  description,
  descTextSize,
  descLineHeight,
  contentWidth,
  backgroundColor,
  buttonColor,
  textColor,
  titleFontSize,
  isVideo,
  backgroundContent,
  heading,
  headingSize,
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
          src={AspireLightLogo}
          alt="Aspire Clinix"
          width={80}
          height={88}
          className="zoom-out flex items-center justify-center w-[80px] h-[40px] md:w-[189px] md:h-[88px] "
        />
      </Link>
      <div className="zoom-out flex-1">
        <Link href="/patient/book-treatment" scroll={false}>
          <button
            className="flex justify-center items-center ml-auto w-[90px] h-[42px] md:w-[170px] md:h-[60px] lg:w-[277px] lg:h-[77px] font-normal md:text-[20px] text-[13px] font-opus rounded-[5px] md:rounded-[20px]"
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
      className="flex flex-col items-center justify-center h-screen relative overflow-hidden"
      // style={{
      //   background: `linear-gradient(to bottom, rgba(0, 0, 0, 1), rgba(0, 0, 0, 1)), ${backgroundColor}`,
      // }}
    >
      <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-black/100 to-black/100"></div>
      {backgroundContent &&
        (isVideo ? (
          <video
            className="absolute top-0 left-0 w-full h-full  object-cover"
            src={backgroundContent as string}
            style={{ height: "100vh", filter: "brightness(0.5)" }}
            autoPlay
            loop
            muted
            preload="auto"
          ></video>
        ) : (
          <Image
            className="absolute top-0 left-0 w-full h-full object-cover"
            alt="Background Image"
            style={{ filter: "brightness(0.5)" }}
            src={image1}
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
        {/* Heading */}
        {heading && (
          <p
            className={clsx(
              "text-center text-white font-gillSans z-10 text-xs md:text-xl px-4 sm:px-5",
              headingSize
            )}
            style={{}}
          >
            {heading}
          </p>
        )}
        {/* Title */}
        <h1
          className={clsx(
            "text-center text-white md:w-[500px] z-10 lg:w-[766px] xl:w-[1143px] w-[350px] font-opus font-normal md:leading-[70px] lg:leading-[100px]",
            titleFontSize
          )}
          style={{}}
        >
          {title}
        </h1>

        {/* Description */}
        {description && descLineHeight && (
          <p
            className="text-center text-white font-gillSans z-10 text-[16px] lg:w-[837px] lg:h-[126px]  md:text-[32px] px-4 sm:px-5"
            style={{
              lineHeight: `${descLineHeight}px`,
            }}
          >
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

"use client";

import { AspireDarkLogo, AspireLightLogo, image1 } from "@/assets";
import Image, { StaticImageData } from "next/image";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import HeroNav from "./HeroNav";

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
  heroScreenHieght?: string;
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
  heroScreenHieght = "h-screen",
}: HeroSectionProps) {
  const pathname = usePathname();

  return (
    <div
      className={`flex flex-col items-center justify-center ${heroScreenHieght} relative overflow-hidden`}
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

      <HeroNav
        buttonColor={buttonColor}
        aspireLogo={
          pathname === "/fee-guide" || "/meet-the-team"
            ? AspireLightLogo
            : AspireDarkLogo
        }
      />

      {/* Main Content */}
      <div
        className="zoom-out flex flex-col justify-center items-center gap-5 lg:gap-4 mt-16"
        style={{ width: contentWidth ? `${contentWidth}%` : "100%" }}
      >
        {/* Heading */}
        {heading && (
          <p
            className={clsx(
              "text-center text-white font-gillSans z-10 px-4 sm:px-5",
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
          <div
            className="text-center text-white font-gillSans z-10 max-w-6xl text-xl md:text-3xl lg:text-4xl leading-relaxed px-4 sm:px-5 "
            style={{
              lineHeight: `40px`,
            }}
            dangerouslySetInnerHTML={{ __html: description }}
          />
        )}
      </div>
    </div>
  );
}

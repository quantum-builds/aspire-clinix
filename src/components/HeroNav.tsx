"use client";
import { usePathname } from "next/navigation";
import HeroMenu from "./HeroMenu";
import Link from "next/link";
import Image, { StaticImageData } from "next/image";

interface HeroNavProps {
  buttonColor: string;
  textColor?: string;
  backgroundColor?: string;
  aspireLogo: StaticImageData;
}
export default function HeroNav({
  buttonColor,
  textColor = "white",
  backgroundColor = "transparent",
  aspireLogo,
}: HeroNavProps) {
  const pathname = usePathname();

  return (
    <header
      className={`flex justify-between items-center absolute w-full top-0 h-16 md:h-32 px-5 lg:px-12 z-20 bg-${backgroundColor}`}
    >
      <div className="flex-1">
        <HeroMenu
          backgroundColor={pathname === "/fee-guide" ? "white" : undefined}
          textColor={textColor}
        />
      </div>
      <Link href="/" scroll={false}>
        <Image
          src={aspireLogo}
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
    </header>
  );
}

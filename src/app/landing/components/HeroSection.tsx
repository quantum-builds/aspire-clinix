import { AspireClinixIcon } from "@/assets";
import Image from "next/image";
import HeroMenu from "./HeroMenu";
import Link from "next/link";

export default function HeroSection() {
  return (
    <div className="flex flex-col h-screen relative">
      <header className="flex justify-between items-center h-[200px] px-[8%] leading-[27.27px] tracking-widest text-2xl">
        <HeroMenu />
        <Image
          src={AspireClinixIcon}
          alt="Apsire Clinic"
          width={189}
          height={88}
          className="ml-64"
        />
        <Link href="/book-treatment" scroll={false}>
          <button className="px-[19px] py-[28px] rounded-[20px] bg-[#EBEBEB] text-[22.7px] leading-[22.7px]">
            BOOK A TREATMENT
          </button>
        </Link>
      </header>

      <div className="flex flex-col justify-center items-center h-full text-[70px] leading-[79.45px]">
        <p>HOLISTIC WELLNESS IS A JOURNEY</p>
        <p>THAT STARTS HERE</p>
      </div>
    </div>
  );
}

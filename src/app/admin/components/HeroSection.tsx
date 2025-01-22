import { AspireDarkLogo, NotificationBell } from "@/assets";
import HeroMenu from "@/components/HeroMenu";
import { UserRoles } from "@/constants/UserRoles";
import Image from "next/image";
import Link from "next/link";
import DropDown from "./DropDown";

export default function HeroSection() {
  const renderHeader = () => (
    <header className=" flex justify-between items-center absolute w-full top-0 h-16 md:h-32 px-5 lg:px-12 z-20">
      <div className="flex-1">
        <HeroMenu role={UserRoles.ADMIN} />
      </div>
      <Link href="/" scroll={false}>
        <Image
          src={AspireDarkLogo}
          alt="Aspire Clinix"
          width={80}
          height={88}
          className="zoom-out flex items-center justify-center w-[80px] h-[40px] md:w-[189px] md:h-[88px]"
        />
      </Link>
      <div className="zoom-out flex-1 flex gap-10 justify-end">
        <DropDown />
      </div>
    </header>
  );

  return (
    <div className="flex flex-col h-screen relative overflow-hidden">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        src="/videos/landing-page-video.mp4"
        style={{ height: "100vh" }}
        autoPlay
        loop
        muted
      ></video>
      {renderHeader()}
      <div className="flex flex-col justify-start gap-5 lg:gap-4 mt-16 md:mt-32 px-6 md:px-12 z-10">
        <p className="text-5xl font-extrabold font-opus">Welcome, Massab!</p>
      </div>
    </div>
  );
}

import { AspireClinixIcon } from "@/assets";
import Image from "next/image";

export default function HeroSection() {
  return (
    <div className="flex flex-col h-screen">
      <header className="flex justify-between items-center h-[140px] px-[8%]">
        <button className="text-[24px]">Menu</button>
        <Image
          src={AspireClinixIcon}
          alt="Apsire Clinic"
          width={189}
          height={88}
        />
        <button className="px-[38px] py-[22px] rounded-[20px] bg-[#EBEBEB] text-[22.7px]">
          BOOK A TREATMENT
        </button>
      </header>

      <div className="flex flex-col justify-center items-center mt-[340px] mb-[300px]">
        <p className="text-[70px]">HOLISTIC WELLNESS IS A JOURNEY</p>
        <p className="text-[70px]">THAT STARTS HERE</p>
      </div>
    </div>
  );
}

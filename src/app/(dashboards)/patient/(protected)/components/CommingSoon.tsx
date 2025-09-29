import { ComminSoonImage } from "@/assets";
import Image from "next/image";

export default function CommingSoon() {
  return (
    <div className="flex flex-col items-center justify-center gap-8 rounded-2xl bg-dashboardBarBackground py-[100px] px-6">
      <Image
        src={ComminSoonImage}
        alt="comming soon"
        className="w-[88px] h-[100px]"
      />
      <p className="text-green text-[80px]">COMING SOON</p>
    </div>
  );
}

import Image from "next/image";
import { ExportIcon } from "@/assets";

export default function ExportButton() {
  return (
    <button className="bg-white h-15 w-[177px] p-2 pl-5 flex justify-between items-center gap-4 rounded-full cursor-pointer">
      <p>Export data</p>
      <div className="w-11 h-11 rounded-full bg-[#F3F5F7] flex justify-center items-center">
        <Image src={ExportIcon} alt="Calendar Icon" className="w-5 h-5" />
      </div>
    </button>
  );
}

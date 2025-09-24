import Image from "next/image";
import { NoContentImage } from "@/assets";
import SearchBar from "@/app/(dashboards)/components/SearchBar";
import BackButton from "@/app/(dashboards)/components/BackButton";

export default function NoContent1() {
  return (
    <div className="bg-dashboardBarBackground py-[60px] px-6 flex flex-col items-center justify-center gap-4">
      <Image
        src={NoContentImage}
        alt="no content"
        className="w-[200px] h-[200px]"
      />
      <div className="flex flex-col justify-center items-center gap-2 ">
        <p className="text-2xl font-medium">Content Not Found</p>
        <p className="italix text-lg text-lightBlack">
          The data you have searched is not found at this moment
        </p>
      </div>
    </div>
  );
}

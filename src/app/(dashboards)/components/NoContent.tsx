import Image from "next/image";
import { NoContentImage } from "@/assets";
import SearchBar from "@/app/(dashboards)/components/SearchBar";
import BackButton from "@/app/(dashboards)/components/BackButton";

interface NoContentProps {
  title: string;
  placeholder?: string;
}
export default function NoContent({
  title,
  placeholder = "Search",
}: NoContentProps) {
  return (
    <div className=" w-full h-full flex flex-col gap-7">
      <div className="flex items-center justify-between">
        <h1 className="font-medium text-3xl">{title}</h1>
        <div className="flex items-center gap-2">
          <SearchBar placeholder={placeholder} />
          <BackButton />
        </div>
      </div>
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
    </div>
  );
}

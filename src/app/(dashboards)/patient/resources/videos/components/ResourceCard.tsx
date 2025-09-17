import { CalenderInputIcon, ResourceImage, TimeIcon } from "@/assets";
import { TResource } from "@/types/common";
import Image from "next/image";

interface ResourceCardProps {
  resource: TResource;
}

export default function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <div className="flex flex-col gap-5 p-6 rounded-2xl bg-dashboardBackground">
      <div className="flex gap-3 items-center justify-end">
        <div className="flex gap-1 items-center">
          <Image
            src={CalenderInputIcon}
            alt="calender-icon"
            className="w-5 h-5"
          />
          <p className="text-lg">{resource.createdAt.toLocaleDateString()}</p>
        </div>
        <div className="flex gap-1 items-center">
          <Image src={TimeIcon} alt="time-icon" className="w-5 h-5" />
          <p className="text-lg">
            {resource.createdAt.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>

      <Image
        src={ResourceImage}
        alt="resource image"
        className="rounded-2xl w-[420px] h-[240px]"
      />
      <p className="text-center text-green font-medium text-lg">
        {resource.title}
      </p>
    </div>
  );
}

import { PdfDownload } from "@/app/(dashboards)/components/PDFModal";
import { CalenderInputIcon, PDFImage, TimeIcon } from "@/assets";
import { TResource } from "@/types/resources";
import { formatDate, formatTime } from "@/utils/formatDateTime";
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
          <p className="text-lg">{formatDate(resource.createdAt)}</p>
        </div>
        <div className="flex gap-1 items-center">
          <Image src={TimeIcon} alt="time-icon" className="w-5 h-5" />
          <p className="text-lg">{formatTime(resource.createdAt)}</p>
        </div>
      </div>

      {/* <Image
        src={PDFImage}
        alt="pdf image"
        className="rounded-2xl w-[420px] h-[240px]"
      /> */}

      {resource.file ? (
        <PdfDownload pdf={resource.file} thumbnail={PDFImage} />
      ) : (
        <div className="bg-dashboardBackground rounded-2xl w-[420px] h-[240px]"></div>
      )}
      <p className="text-center text-green font-medium text-lg">
        {resource.title}
      </p>
    </div>
  );
}

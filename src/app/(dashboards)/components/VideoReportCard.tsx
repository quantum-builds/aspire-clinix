import {
  AspireDarkLogo,
  CalenderInputIcon,
  ReportImage,
  TimeIcon,
} from "@/assets";
import { TReport } from "@/types/reports";
import { formatDate, formatTime } from "@/utils/formatDateTime";
import Image from "next/image";
import { VideoModal } from "./VideoModal";

interface VideoReportCardProps {
  report: TReport;
}

export default function VideoReportCard({ report }: VideoReportCardProps) {
  return (
    <div className="flex flex-col gap-5 p-6 rounded-2xl bg-dashboardBackground">
      <div className="flex gap-3 items-center justify-end">
        <div className="flex gap-1 items-center">
          <Image
            src={CalenderInputIcon}
            alt="calender-icon"
            className="w-5 h-5"
          />
          <p className="text-lg">{formatDate(report.createdAt)}</p>
        </div>
        <div className="flex gap-1 items-center">
          <Image src={TimeIcon} alt="time-icon" className="w-5 h-5" />
          <p className="text-lg">
            {/* {report.createdAt.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })} */}
            {formatTime(report.createdAt)}
          </p>
        </div>
      </div>
      {/* <Image
        src={ReportImage}
        alt="report image"
        className="rounded-2xl w-[420px] h-[240px]"
      /> */}
      {report.file ? (
        <VideoModal video={report.file} thumbnail={AspireDarkLogo} />
      ) : (
        <div className="bg-dashboardBackground rounded-2xl w-[420px] h-[240px]"></div>
      )}
      <p className="text-center text-green font-medium text-lg">
        {report.title}
      </p>
    </div>
  );
}

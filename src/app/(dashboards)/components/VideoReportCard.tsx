import { CalenderInputIconV2, TimeIconV2, VideoImage } from "@/assets";
import { TReport } from "@/types/reports";
import { formatDate, formatTime } from "@/utils/formatDateTime";
import Image from "next/image";
import { VideoModal } from "./VideoModal";
import { VideoDownload } from "./VideoDownlaod";
import { getFileNameFromUrl } from "@/utils/getFileName";

interface VideoReportCardProps {
  report: TReport;
}

export default function VideoReportCard({ report }: VideoReportCardProps) {
  return (
    <div className="flex flex-col gap-5 p-6 rounded-2xl bg-dashboardBackground">
      <div className="flex gap-3 items-center justify-end">
        <div className="flex gap-1 items-center">
          <Image
            src={CalenderInputIconV2}
            alt="calender-icon"
            className="w-5 h-5"
          />
          <p className="text-lg">{formatDate(report.createdAt)}</p>
        </div>
        <div className="flex gap-1 items-center">
          <Image src={TimeIconV2} alt="time-icon" className="w-5 h-5" />
          <p className="text-lg">{formatTime(report.createdAt)}</p>
        </div>
      </div>

      <div className="relative group w-full flex justify-center">
        <div className="w-full h-[200px] flex flex-col items-center justify-center rounded-2xl bg-white border-2 border-dashed border-gray-300">
          <Image src={VideoImage} alt="upload-video" width={110} height={120} />
        </div>

        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10 rounded-md">
          <VideoModal
            video={report.file ?? ""}
            trigger={
              <button className="bg-transparent text-white px-6 py-3 h-[60px] rounded-full border border-white shadow hover:bg-lightGray transition">
                View
              </button>
            }
          />
          <VideoDownload
            video={report.file ?? ""}
            fileName={getFileNameFromUrl(report.fileUrl)}
            trigger={
              <button className="bg-green text-white px-6 py-3 h-[60px] rounded-full border border-white shadow hover:bg-greenHover transition">
                Download
              </button>
            }
          />
        </div>
      </div>

      <p className="font-medium text-lg truncate w-full">{report.title}</p>
    </div>
  );
}

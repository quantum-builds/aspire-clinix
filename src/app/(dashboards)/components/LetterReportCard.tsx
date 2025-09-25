import { CalenderInputIcon, PDFImage, TimeIcon } from "@/assets";
import { TReport } from "@/types/reports";
import { formatDate } from "@/utils/formatDateTime";
import Image from "next/image";
import { PdfDownload } from "./PDFModal";

interface LetterReportCardProps {
  report: TReport;
}

export default function LetterReportCard({ report }: LetterReportCardProps) {
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

            {formatDate(report.createdAt)}
          </p>
        </div>
      </div>
      {/* <Image
        src={PDFImage}
        alt="pdf image"
        className="rounded-2xl w-[300px] h-[200px]"
      /> */}
      {report.file ? (
        <PdfDownload pdf={report.file} thumbnail={PDFImage} />
      ) : (
        <div className="bg-dashboardBackground rounded-2xl max-w-[420px] h-[240px]"></div>
      )}
      <p className="text-center text-green font-medium text-lg h-6 line-clamp-1">
        {report.title}
      </p>
    </div>
  );
}

import { CalenderInputIcon, PDFImage, TimeIcon } from "@/assets";
import { TReport } from "@/types/common";
import Image from "next/image";

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
          <p className="text-lg">{report.createdAt.toLocaleDateString()}</p>
        </div>
        <div className="flex gap-1 items-center">
          <Image src={TimeIcon} alt="time-icon" className="w-5 h-5" />
          <p className="text-lg">
            {report.createdAt.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
      <Image
        src={PDFImage}
        alt="pdf image"
        className="rounded-2xl w-[300px] h-[200px]"
      />
      <p className="text-center text-green font-medium text-lg">
        {report.title}
      </p>
    </div>
  );
}

import { CalenderInputIconV2, PDFImage, TimeIconV2 } from "@/assets";
import { TReport } from "@/types/reports";
import { formatDate } from "@/utils/formatDateTime";
import Image from "next/image";
import { PdfDownload } from "./PdfDownload";
import PdfModal from "./ViewPdfModal";
import { getFileNameFromUrl } from "@/utils/getFileName";

interface LetterReportCardProps {
  report: TReport;
}

export default function LetterReportCard({ report }: LetterReportCardProps) {
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
          <p className="text-lg">{formatDate(report.createdAt)}</p>
        </div>
      </div>

      <div className="relative group w-full flex justify-center">
        <Image src={PDFImage} alt="pdf-image" className="z-0" />

        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10 rounded-md">
          <PdfModal
            pdfUrl={report.file ?? ""}
            trigger={
              <button className="bg-transparent text-white px-6 py-3 h-[60px] rounded-full border border-white shadow hover:bg-lightGray transition">
                View
              </button>
            }
          />
          <PdfDownload
            pdf={report.file ?? ""}
            fileName={getFileNameFromUrl(report.fileUrl)}
            trigger={
              <button className="bg-green text-white px-6 py-3 h-[60px] rounded-full border border-white shadow  hover:bg-greenHover transition">
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

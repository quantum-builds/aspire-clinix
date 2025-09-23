import { TReport } from "@/types/reports";
import LetterReportCard from "./LetterReportCard";
import UploadLetterForm from "../dentist/appointments/reports/new/components/UploadLetterForm";

interface LetterReportGridProps {
  reports: TReport[];
  isNewUploadPage?: boolean;
}

export default function LetterReportGrid({
  reports,
  isNewUploadPage = false,
}: LetterReportGridProps) {
  return (
    <div className="flex flex-col gap-10">
      <p className="font-medium text-2xl">
        {isNewUploadPage ? "Upload Letter" : "Letter Reports"}
      </p>
      <div className="grid grid-cols-4 gap-x-6 gap-y-10">
        {reports.map((report, index) => (
          <LetterReportCard key={index} report={report} />
        ))}
        {isNewUploadPage && <UploadLetterForm />}
      </div>
    </div>
  );
}

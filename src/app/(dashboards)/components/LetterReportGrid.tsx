import { TReport } from "@/types/common";
import LetterReportCard from "./LetterReportCard";

interface LetterReportGridProps {
  reports: TReport[];
}

export default function LetterReportGrid({ reports }: LetterReportGridProps) {
  return (
    <div className="flex flex-col gap-10">
      <p className="font-medium text-2xl">Letter Reports</p>
      <div className="grid grid-cols-4 gap-x-6 gap-y-10">
        {reports.map((report, index) => (
          <LetterReportCard key={index} report={report} />
        ))}
      </div>
    </div>
  );
}

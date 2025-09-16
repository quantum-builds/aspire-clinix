import { TReport } from "@/types/common";
import VideoReportCard from "./VideoReportCard";

interface VideoReportGridProps {
  reports: TReport[];
}

export default function VideoReportGrid({ reports }: VideoReportGridProps) {
  return (
    <div className="flex flex-col gap-10">
      <p className="font-medium text-2xl">Video Reports</p>
      <div className="grid grid-cols-3 gap-x-6 gap-y-10">
        {reports.map((report, index) => (
          <VideoReportCard key={index} report={report} />
        ))}
      </div>
    </div>
  );
}

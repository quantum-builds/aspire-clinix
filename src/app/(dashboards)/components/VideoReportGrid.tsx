import { TReport } from "@/types/reports";
import VideoReportCard from "./VideoReportCard";
import UploadVideoForm from "../dentist/appointments/reports/new/components/UploadVideoForm";

interface VideoReportGridProps {
  reports: TReport[];
  isNewUploadPage?: boolean;
}

export default function VideoReportGrid({
  reports,
  isNewUploadPage = false,
}: VideoReportGridProps) {
  return (
    <div className="flex flex-col gap-10">
      <p className="font-medium text-2xl">
        {isNewUploadPage ? "Upload Video" : "Video Reports"}
      </p>
      <div className="grid grid-cols-3 gap-x-6 gap-y-10">
        {reports.map((report, index) => (
          <VideoReportCard key={index} report={report} />
        ))}
        {isNewUploadPage && <UploadVideoForm />}
      </div>
    </div>
  );
}

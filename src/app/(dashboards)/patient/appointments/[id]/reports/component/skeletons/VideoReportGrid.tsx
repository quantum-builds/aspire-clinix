import { VideoReportCardSkeleton } from "./VideoReportCard";

export function VideoReportGridSkeleton() {
  return (
    <div className="flex flex-col gap-10 animate-pulse">
      <div className="w-40 h-6 bg-dashboardBackground rounded"></div>
      <div className="grid grid-cols-3 gap-x-6 gap-y-10">
        {[...Array(3)].map((_, i) => (
          <VideoReportCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

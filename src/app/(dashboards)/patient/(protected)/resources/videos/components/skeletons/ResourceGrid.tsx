import { VideoResourceCardSkeleton } from "./ResourceCard";

export function VideoResourceGridSkeleton() {
  return (
    <div className="flex flex-col gap-10 bg-dashboardBarBackground rounded-2xl p-6 animate-pulse">
      <div className="w-40 h-6 bg-dashboardBackground rounded"></div>
      <div className="grid grid-cols-3 gap-x-6 gap-y-10">
        {[...Array(3)].map((_, i) => (
          <VideoResourceCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

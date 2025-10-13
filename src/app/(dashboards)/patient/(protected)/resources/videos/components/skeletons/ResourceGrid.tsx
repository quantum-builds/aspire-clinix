import { VideoResourceCardSkeleton } from "./ResourceCard";

export function VideoResourceGridSkeleton() {
  return (
    <div className="min-h-screen flex flex-col gap-10 bg-dashboardBarBackground rounded-2xl p-6 animate-pulse">
        <div className="w-30 h-6 bg-dashboardBackground rounded "></div>
        <div className="grid grid-cols-4 gap-x-6 gap-y-10">
          {[...Array(4)].map((_, i) => (
            <VideoResourceCardSkeleton key={i} />
          ))}
        </div>
    </div>
  );
}

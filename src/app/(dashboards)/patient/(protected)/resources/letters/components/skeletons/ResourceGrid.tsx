import { LetterResourceCardSkeleton } from "./ResourceCard";

export function LetterReportGridSkeleton() {
  return (
    <div className="flex flex-col gap-10 animate-pulse bg-dashboardBarBackground p-6 rounded-2xl">
      <div className="w-40 h-6 bg-dashboardBackground rounded"></div>
      <div className="grid grid-cols-4 gap-x-6 gap-y-10">
        {[...Array(4)].map((_, i) => (
          <LetterResourceCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

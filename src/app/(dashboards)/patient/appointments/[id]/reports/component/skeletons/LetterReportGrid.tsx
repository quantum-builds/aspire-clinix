import { LetterReportCardSkeleton } from "./LetterReportCard";

export function LetterReportGridSkeleton() {
  return (
    <div className="flex flex-col gap-10 animate-pulse">
      <div className="w-40 h-6 bg-dashboardBackground rounded"></div>
      <div className="grid grid-cols-4 gap-x-6 gap-y-10">
        {[...Array(4)].map((_, i) => (
          <LetterReportCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

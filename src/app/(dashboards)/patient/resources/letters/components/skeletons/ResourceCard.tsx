export function LetterResourceCardSkeleton() {
  return (
    <div className="flex flex-col gap-5 p-6 rounded-2xl bg-dashboardBackground animate-pulse">
      <div className="w-full h-40 bg-dashboardBackground rounded"></div>
      <div className="w-32 h-4 bg-dashboardBackground rounded mx-auto"></div>
    </div>
  );
}

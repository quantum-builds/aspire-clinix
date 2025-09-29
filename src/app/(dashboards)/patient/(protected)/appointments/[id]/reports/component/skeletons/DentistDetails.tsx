export function DentistDetailsSkeleton() {
  return (
    <div className="flex flex-col gap-7 bg-dashboardBarBackground rounded-2xl p-6 animate-pulse">
      <div className="w-40 h-6 bg-dashboardBackground rounded"></div>
      <div className="flex flex-col gap-5">
        <div className="w-32 h-5 bg-dashboardBackground rounded"></div>
        <div className="grid grid-row-2 gap-y-5 gap-x-5">
          <div className="flex items-center gap-4">
            <div className="w-40 h-4 bg-dashboardBackground rounded"></div>
            <div className="w-40 h-4 bg-dashboardBackground rounded"></div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-40 h-4 bg-dashboardBackground rounded"></div>
            <div className="w-40 h-4 bg-dashboardBackground rounded"></div>
            <div className="w-64 h-4 bg-dashboardBackground rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FirstUpcomingAppointmentCardSkeleton() {
  return (
    <div className="w-full flex flex-col gap-10 bg-dashboardBarBackground p-6 rounded-2xl animate-pulse">
      <div className="flex justify-between">
        <div className="flex flex-col gap-3">
          <div className="h-6 w-48 bg-dashboardBackground rounded"></div>
          <div className="h-5 w-40 bg-dashboardBackground rounded"></div>
        </div>
        <div className="flex flex-col gap-3 items-end">
          <div className="flex items-center gap-3">
            <div className="h-5 w-28 bg-dashboardBackground rounded"></div>
            <div className="h-5 w-20 bg-dashboardBackground rounded"></div>
          </div>
          <div className="h-5 w-40 bg-dashboardBackground rounded"></div>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <div className="h-6 w-40 bg-dashboardBackground rounded"></div>
        <div className="grid grid-row-3 gap-y-5 gap-x-5">
          <div className="h-5 w-full bg-dashboardBackground rounded"></div>
          <div className="h-5 w-full bg-dashboardBackground rounded"></div>
          <div className="h-5 w-full bg-dashboardBackground rounded"></div>
        </div>
      </div>

      <div className="flex justify-between">
        <div className="h-10 w-32 bg-dashboardBackground rounded-full"></div>
        <div className="h-5 w-60 bg-dashboardBackground rounded"></div>
      </div>
    </div>
  );
}

export function UpcomingAppointmentCardSkeleton() {
  return (
    <div className="flex flex-col gap-8 p-6 rounded-2xl bg-dashboardBarBackground animate-pulse">
      <div className="flex justify-between">
        <div className="h-6 w-48 bg-dashboardBackground rounded"></div>
        <div className="flex flex-col gap-3 items-end">
          <div className="flex gap-3">
            <div className="h-5 w-28 bg-dashboardBackground rounded"></div>
            <div className="h-5 w-20 bg-dashboardBackground rounded"></div>
          </div>
          <div className="h-5 w-36 bg-dashboardBackground rounded"></div>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <div className="h-6 w-40 bg-dashboardBackground rounded"></div>
        <div className="grid grid-cols-2 gap-y-5 gap-x-5">
          <div className="h-5 w-full bg-dashboardBackground rounded"></div>
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

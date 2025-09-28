export function PastAppointmentCardSkeleton() {
  return (
    <div className="flex flex-col gap-8 p-10 rounded-2xl bg-dashboardBackground animate-pulse">
      {/* Header */}
      <div className="flex justify-between gap-3 items-center">
        <div className="h-5 w-32 bg-green rounded"></div>
        <div className="flex items-center gap-2">
          <div className="h-5 w-24 bg-dashboardTextBlack rounded"></div>
          <div className="h-5 w-16 bg-dashboardTextBlack rounded"></div>
        </div>
      </div>

      {/* Dentist Details */}
      <div className="flex flex-wrap gap-y-5 justify-between">
        <div className="h-5 w-40 bg-dashboardTextBlack rounded"></div>
        <div className="h-5 w-28 bg-dashboardTextBlack rounded"></div>
        <div className="h-5 w-36 bg-dashboardTextBlack rounded"></div>
        <div className="h-5 w-44 bg-dashboardTextBlack rounded"></div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center">
        <div className="h-10 w-32 bg-green rounded-full"></div>
        <div className="h-5 w-36 bg-dashboardTextBlack rounded"></div>
      </div>
    </div>
  );
}

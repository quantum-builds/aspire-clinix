export default function AppointmentCardSkeleton() {
  return (
    <div className="animate-pulse flex flex-col gap-8 p-6 rounded-2xl bg-dashboardBackground">
      {/* Header */}
      <div className="flex justify-between">
        <div className="h-6 w-32 rounded bg-green" />
        <div className="flex flex-col gap-3 items-end">
          <div className="flex items-center gap-3">
            <div className="h-5 w-24 rounded bg-dashboardTextBlack" />
            <div className="h-5 w-32 rounded bg-dashboardTextBlack" />
          </div>
        </div>
      </div>

      {/* Patient info */}
      <div className="grid grid-row-2 gap-y-5 gap-x-5">
        <div className="flex items-start gap-2">
          <div className="h-5 w-40 rounded bg-dashboardTextBlack" />
          <div className="h-5 w-32 rounded bg-dashboardTextBlack ml-auto" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-5 w-48 rounded bg-dashboardTextBlack" />
          <div className="h-5 w-16 rounded bg-dashboardTextBlack ml-auto" />
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center">
        <div className="h-10 w-40 rounded bg-green" />
        <div className="h-5 w-32 rounded bg-dashboardTextBlack" />
      </div>
    </div>
  );
}

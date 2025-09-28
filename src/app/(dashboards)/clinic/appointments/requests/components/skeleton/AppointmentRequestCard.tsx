export default function AppointmentRequestCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl p-6 space-y-10 bg-dashboardBackground">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="h-6 w-32 rounded bg-green" />
        <div className="flex items-center gap-3">
          <div className="h-5 w-24 rounded bg-dashboardTextBlack" />
          <div className="h-5 w-16 rounded bg-dashboardTextBlack" />
        </div>
      </div>

      {/* Patient info */}
      <div className="flex">
        <div className="space-y-3 flex-1">
          <div className="h-5 w-40 rounded bg-dashboardTextBlack" />
          <div className="h-5 w-36 rounded bg-dashboardTextBlack" />
        </div>
        <div className="space-y-3 flex-1">
          <div className="h-5 w-48 rounded bg-dashboardTextBlack" />
          <div className="h-5 w-20 rounded bg-dashboardTextBlack" />
        </div>
      </div>

      {/* Appointment date & reason */}
      <div className="flex">
        <div className="flex-1 space-y-3">
          <div className="h-5 w-32 rounded bg-green" />
          <div className="h-5 w-40 rounded bg-dashboardTextBlack" />
        </div>
        <div className="flex-1 space-y-3">
          <div className="h-5 w-36 rounded bg-green" />
          <div className="h-5 w-52 rounded bg-dashboardTextBlack" />
        </div>
      </div>

      {/* Note */}
      <div className="space-y-3">
        <div className="h-5 w-24 rounded bg-green" />
        <div className="h-5 w-64 rounded bg-dashboardTextBlack" />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="h-6 w-32 rounded bg-dashboardTextBlack" />
        <div className="h-10 w-40 rounded bg-green" />
      </div>
    </div>
  );
}

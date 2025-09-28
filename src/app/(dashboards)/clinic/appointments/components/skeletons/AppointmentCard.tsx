export default function AppointmentCardSkeleton() {
  return (
    <div className="animate-pulse flex flex-col gap-4 rounded-2xl border border-gray-200 bg-dashboardBackground p-6 shadow-sm">
      <div className="h-6 w-1/3 rounded bg-green" />
      <div className="grid grid-cols-2 gap-5 ">
        <div className="h-4 w-2/3 rounded bg-dashboardTextBlack" />
        <div className="h-4 w-1/2 rounded bg-dashboardTextBlack" />
        <div className="h-4 w-2/3 rounded bg-dashboardTextBlack" />
        <div className="h-4 w-1/2 rounded bg-dashboardTextBlack" />
      </div>
      <div className="h-10 rounded bg-green mt-4 w-20" />
    </div>
  );
}

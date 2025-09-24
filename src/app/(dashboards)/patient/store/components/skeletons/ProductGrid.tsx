export default function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-4 gap-x-6 bg-dashboardBarBackground rounded-2xl p-6  gap-y-10">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col gap-3 rounded-2xl p-6 bg-dashboardBackground animate-pulse"
        >
          <div className="relative">
            <div className="w-full h-[300px] rounded-2xl bg-gray-300" />
            <div className="absolute right-3 top-5 w-11 h-11 rounded-full bg-gray-200" />
            <div className="absolute right-3 top-20 w-11 h-11 rounded-full bg-gray-200" />
          </div>

          <div className="w-full flex justify-between items-center mt-2">
            <div className="h-4 w-24 bg-gray-300 rounded" />
            <div className="h-4 w-16 bg-gray-300 rounded" />
          </div>

          <div className="h-6 w-40 bg-gray-300 rounded mt-2" />

          <div className="w-full flex justify-between items-center mt-2">
            <div className="h-6 w-20 bg-gray-300 rounded" />
            <div className="h-4 w-28 bg-gray-300 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

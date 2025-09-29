    export function VideoReportCardSkeleton() {
      return (
        <div className="flex flex-col gap-5 p-6 rounded-2xl bg-dashboardBackground animate-pulse">
          <div className="flex gap-3 items-center justify-end">
            <div className="w-20 h-4 bg-dashboardBackground rounded"></div>
            <div className="w-16 h-4 bg-dashboardBackground rounded"></div>
          </div>
          <div className="bg-dashboardBackground rounded-2xl w-[420px] h-[240px]"></div>
          <div className="w-32 h-4 bg-dashboardBackground rounded mx-auto"></div>
        </div>
      );
    }

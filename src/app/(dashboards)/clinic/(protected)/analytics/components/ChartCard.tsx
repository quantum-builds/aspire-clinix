import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ChartCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export default function ChartCard({ title, children, className }: ChartCardProps) {
  return (
    <div
      className={cn("w-full py-5 px-6 space-y-4 rounded-2xl bg-white", className)}
    >
      <p className="text-dashboardTextBlack text-lg font-medium">{title}</p>
      {children}
    </div>
  );
}

export function NoChartData() {
  return (
    <div className="h-[260px] flex items-center justify-center text-[#a3a3a3]">
      No data for this period
    </div>
  );
}

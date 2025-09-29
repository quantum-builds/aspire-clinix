"use client";

import ProgressCircle from "./ProgressCircle";

interface StatsCardProps {
  points: number;
  title: string;
  percentage: number;
}

export default function StatsCard({
  title,
  points,
  percentage,
}: StatsCardProps) {
  return (
    <div className="max-w-[360px] p-6 space-y-5 rounded-2xl bg-white">
      <p className="tracking-tightest text-xl font-medium">{title}</p>
      <div className="flex items-center justify-between">
        <p className="font-medium text-2xl">{points}</p>
        <ProgressCircle percentage={percentage} />
      </div>
    </div>
  );
}

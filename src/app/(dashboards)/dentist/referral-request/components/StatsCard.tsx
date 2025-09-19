"use client";

import {
  GreenLine,
  GreenGradient,
  RedLine,
  RedGradient,
  GrayLine,
  GrayGradient,
} from "@/assets";
import Image from "next/image";

interface StatsCardProps {
  percentageChange: number;
  icon: string;
  title: string;
  count: number;
  link?: string;
}

export default function StatsCard({
  percentageChange,
  title,
  icon,
  link,
  count,
}: StatsCardProps) {
  const getPercentageStyles = () => {
    if (percentageChange > 0) {
      return {
        text: "text-[#00ec00]",
        line: GreenLine,
        gradient: GreenGradient,
      };
    } else if (percentageChange < 0) {
      return { text: "text-[#ff0000]", line: RedLine, gradient: RedGradient };
    } else {
      return {
        text: "text-dashboardTextBlack",
        line: GrayLine,
        gradient: GrayGradient,
      };
    }
  };

  const { text, line, gradient } = getPercentageStyles();

  return (
    <div className="max-w-[360px] py-5 px-6 space-y-5 rounded-2xl bg-white">
      <div className="flex justify-between items-start">
        <div className="bg-gray size-12 rounded-xl flex items-center justify-center">
          <Image src={icon} alt={title} />
        </div>
        <div className={`${text} font-semibold`}>{percentageChange}%</div>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-dashboardTextBlack text-xl font-medium">{title}</p>
        <p className="text-dashboardTextBlack text-xl font-medium">{count}</p>
      </div>
      <div className="flex justify-between items-center">
        <p className="underline text-[#a3a3a3]">{link}</p>
        <div className="relative">
          <Image src={line} alt="line icon" className="absolute -top-[2px]" />
          <Image src={gradient} alt="Gradient icon" />
        </div>
      </div>
    </div>
  );
}

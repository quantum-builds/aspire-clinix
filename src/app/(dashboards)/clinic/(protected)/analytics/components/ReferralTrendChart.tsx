"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  TReferralAnalyticsInterval,
  TReferralTrendPoint,
} from "@/types/referral-analytics";
import ChartCard, { NoChartData } from "./ChartCard";

const chartConfig = {
  received: {
    label: "Received",
    color: "var(--green)",
  },
  converted: {
    label: "Converted Appointment",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

interface ReferralTrendChartProps {
  interval: TReferralAnalyticsInterval;
  points: TReferralTrendPoint[];
}

export default function ReferralTrendChart({
  interval,
  points,
}: ReferralTrendChartProps) {
  const hasData = points.some((point) => point.received > 0);

  const formatTick = (value: string) => {
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(year, month - 1, day);

    if (interval === "month") {
      return date.toLocaleDateString("en-GB", {
        month: "short",
        year: "numeric",
      });
    }

    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  };

  return (
    <ChartCard title="Referrals Over Time">
      {hasData ? (
        <ChartContainer
          config={chartConfig}
          className="aspect-auto md:aspect-auto h-[300px] w-full"
        >
          <AreaChart data={points} margin={{ left: 0, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={24}
              tickFormatter={formatTick}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
              width={32}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => formatTick(String(value))}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Area
              dataKey="received"
              type="monotone"
              fill="var(--color-received)"
              fillOpacity={0.3}
              stroke="var(--color-received)"
              strokeWidth={2}
            />
            <Area
              dataKey="converted"
              type="monotone"
              fill="var(--color-converted)"
              fillOpacity={0.3}
              stroke="var(--color-converted)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      ) : (
        <NoChartData />
      )}
    </ChartCard>
  );
}

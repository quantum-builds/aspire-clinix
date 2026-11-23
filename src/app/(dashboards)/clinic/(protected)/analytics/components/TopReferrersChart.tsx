"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TTopReferrer } from "@/types/referral-analytics";
import ChartCard from "./ChartCard";

const chartConfig = {
  total: {
    label: "Total Referrals",
    color: "var(--green)",
  },
  converted: {
    label: "Converted Appointment",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

interface TopReferrersChartProps {
  referrers: TTopReferrer[];
}

// Both bars use the same width and a negative gap, so the converted bar is
// drawn inside the total bar as one single bar per dentist.
const BAR_SIZE = 36;

export default function TopReferrersChart({ referrers }: TopReferrersChartProps) {
  return (
    <ChartCard title="Top Referring Dentists">
      <ChartContainer
        config={chartConfig}
        className="aspect-auto md:aspect-auto h-[240px] w-full"
      >
        <BarChart
          data={referrers}
          barGap={-BAR_SIZE}
          margin={{ top: 4, right: 0, bottom: 0, left: 0 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={false}
            tickMargin={6}
            interval={0}
            tickFormatter={(value: string) =>
              value.length > 14 ? `${value.slice(0, 14)}…` : value
            }
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
            width={32}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar
            dataKey="total"
            fill="var(--color-total)"
            radius={[8, 8, 0, 0]}
            barSize={BAR_SIZE}
          />
          <Bar
            dataKey="converted"
            fill="var(--color-converted)"
            radius={[8, 8, 0, 0]}
            barSize={BAR_SIZE}
          />
        </BarChart>
      </ChartContainer>
    </ChartCard>
  );
}

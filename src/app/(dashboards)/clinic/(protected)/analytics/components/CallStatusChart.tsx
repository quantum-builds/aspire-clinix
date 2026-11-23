"use client";

import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TReferralBreakdown } from "@/types/referral-analytics";
import { formatStatus } from "@/utils/formateStatus";
import ChartCard, { NoChartData } from "./ChartCard";

const COLORS = [
  "var(--green)",
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

const chartConfig = {
  count: {
    label: "Referrals",
  },
} satisfies ChartConfig;

interface CallStatusChartProps {
  callStatus: TReferralBreakdown["callStatus"];
}

export default function CallStatusChart({ callStatus }: CallStatusChartProps) {
  const hasData = callStatus.some((item) => item.count > 0);

  const data = callStatus.map((item) => ({
    ...item,
    label: formatStatus(item.status),
  }));

  return (
    <ChartCard title="Patient Follow-up (Call Status)">
      {hasData ? (
        <ChartContainer
          config={chartConfig}
          className="aspect-auto md:aspect-auto h-[300px] w-full"
        >
          <BarChart data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
              width={32}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" radius={8}>
              {data.map((item, index) => (
                <Cell key={item.status} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      ) : (
        <NoChartData />
      )}
    </ChartCard>
  );
}

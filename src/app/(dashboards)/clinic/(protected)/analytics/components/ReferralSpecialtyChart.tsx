"use client";

import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TReferralBreakdown } from "@/types/referral-analytics";
import ChartCard, { NoChartData } from "./ChartCard";

const chartConfig = {
  count: {
    label: "Referrals",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

interface ReferralSpecialtyChartProps {
  specialty: TReferralBreakdown["specialty"];
}

export default function ReferralSpecialtyChart({
  specialty,
}: ReferralSpecialtyChartProps) {
  return (
    <ChartCard title="Referrals by Specialty (Top 4)">
      {specialty.length > 0 ? (
        <ChartContainer
          config={chartConfig}
          className="aspect-auto md:aspect-auto h-[300px] w-full"
        >
          <BarChart data={specialty} layout="vertical" margin={{ right: 40 }}>
            <YAxis
              dataKey="specialty"
              type="category"
              tickLine={false}
              axisLine={false}
              width={140}
            />
            <XAxis type="number" dataKey="count" hide />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="count" fill="var(--color-count)" radius={8}>
              <LabelList
                dataKey="count"
                position="right"
                className="fill-dashboardTextBlack"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      ) : (
        <NoChartData />
      )}
    </ChartCard>
  );
}

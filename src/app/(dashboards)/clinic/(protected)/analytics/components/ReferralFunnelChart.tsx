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
    color: "var(--green)",
  },
} satisfies ChartConfig;

interface ReferralFunnelChartProps {
  funnel: TReferralBreakdown["funnel"];
}

export default function ReferralFunnelChart({ funnel }: ReferralFunnelChartProps) {
  const hasData = funnel.some((item) => item.count > 0);

  return (
    <ChartCard title="Referral to Appointment Funnel">
      {hasData ? (
        <ChartContainer
          config={chartConfig}
          className="aspect-auto md:aspect-auto h-[300px] w-full"
        >
          <BarChart data={funnel} layout="vertical" margin={{ right: 40 }}>
            <YAxis
              dataKey="stage"
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

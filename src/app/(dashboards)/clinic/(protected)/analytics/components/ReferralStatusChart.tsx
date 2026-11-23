"use client";

import { Cell, Label, Pie, PieChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
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

interface ReferralStatusChartProps {
  status: TReferralBreakdown["status"];
}

export default function ReferralStatusChart({ status }: ReferralStatusChartProps) {
  const total = status.reduce((sum, item) => sum + item.count, 0);

  const chartConfig: ChartConfig = {};
  status.forEach((item, index) => {
    chartConfig[item.status] = {
      label: formatStatus(item.status),
      color: COLORS[index % COLORS.length],
    };
  });

  const data = status.filter((item) => item.count > 0);

  return (
    <ChartCard title="Referral Status">
      {total > 0 ? (
        <ChartContainer
          config={chartConfig}
          className="aspect-auto md:aspect-auto h-[300px] w-full"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="status" hideLabel />}
            />
            <Pie
              data={data}
              dataKey="count"
              nameKey="status"
              innerRadius={70}
              outerRadius={105}
              strokeWidth={4}
            >
              {data.map((item) => (
                <Cell key={item.status} fill={`var(--color-${item.status})`} />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-dashboardTextBlack text-3xl font-semibold"
                        >
                          {total}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-[#a3a3a3]"
                        >
                          Referrals
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="status" />}
              className="flex-wrap gap-2"
            />
          </PieChart>
        </ChartContainer>
      ) : (
        <NoChartData />
      )}
    </ChartCard>
  );
}

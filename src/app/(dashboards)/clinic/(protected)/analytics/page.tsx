import { Suspense } from "react";
import PageTopBar from "@/app/(dashboards)/components/custom-components/PageTopBar";
import ReferralTrendWrapper from "./components/ReferralTrendWrapper";
import ReferralBreakdownWrapper from "./components/ReferralBreakdownWrapper";
import TopReferrersWrapper from "./components/TopReferrersWrapper";
import ChartSkeleton from "./components/skeletons/ChartSkeleton";
import MonthFilter from "./components/MonthFilter";
import TopReferrersTableSkeleton from "./components/skeletons/TopReferrersTable";

export default async function ReferralAnalytics(props: {
  searchParams?: Promise<{
    month?: string;
  }>;
}) {
  const searchParams = await props.searchParams;

  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  // Selected month as "YYYY-MM", defaults to the current month.
  const month = /^\d{4}-\d{2}$/.test(searchParams?.month || "")
    ? (searchParams?.month as string)
    : currentMonth;

  const [year, monthNumber] = month.split("-").map(Number);

  // The analytics API takes after/before, so the month becomes a date range.
  // For the current month the range ends today.
  const lastDay =
    month === currentMonth
      ? now.getDate()
      : new Date(year, monthNumber, 0).getDate();

  const after = `${month}-01`;
  const before = `${month}-${String(lastDay).padStart(2, "0")}`;

  const suspenseKey = month;

  // e.g. "November 2026"
  const monthLabel = new Date(year, monthNumber - 1, 1).toLocaleDateString(
    "en-GB",
    { month: "long", year: "numeric" },
  );

  return (
    <div className="min-h-screen flex flex-col gap-5">
      <PageTopBar
        pageHeading="Overview"
        showSearch={false}
        showFilters={false}
        statusOptions={null}
        extraBtns={<MonthFilter />}
        note={`These records are for the month of ${monthLabel}.`}
      />

      <Suspense key={`trend-${suspenseKey}`} fallback={<ChartSkeleton />}>
        <ReferralTrendWrapper after={after} before={before} />
      </Suspense>

      <Suspense
        key={`breakdown-${suspenseKey}`}
        fallback={
          <div className="grid xl:grid-cols-2 grid-cols-1 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <ChartSkeleton key={i} />
            ))}
          </div>
        }
      >
        <ReferralBreakdownWrapper after={after} before={before} />
      </Suspense>

      <Suspense
        key={`top-referrers-${suspenseKey}`}
        fallback={
          <>
            <ChartSkeleton />
            <TopReferrersTableSkeleton />
          </>
        }
      >
        <TopReferrersWrapper after={after} before={before} />
      </Suspense>
    </div>
  );
}

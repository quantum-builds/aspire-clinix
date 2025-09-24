import DateFilter from "@/app/(dashboards)/components/DateFilter";
import NoContent1 from "@/app/(dashboards)/components/NoContent1";
import Pagination from "@/app/(dashboards)/components/Pagination";
import SearchBar from "@/app/(dashboards)/components/SearchBar";
import StatsCard from "@/app/(dashboards)/dentist/referral-request/components/StatsCard";
import {
  AttendedReferrals,
  AverageReferrals,
  CancelOrderIcon,
  CancelRequestIcon,
  TotalReferrals,
  UnattendedReferrals,
} from "@/assets";
import { TAppointmentRequestCards, TAppointmentRequests } from "@/types/common";
import { Suspense } from "react";
import { RequestsDataTable } from "./components/RequestDataTable";

const DATA_TABLE_ENTRIES: TAppointmentRequests[] = [
  {
    id: "REQ 112100",
    reason: "I have a gum-bleeding problem.",
    status: "Approved",
    requestDate: new Date("2025-09-17"),
  },
  {
    id: "REQ 112100",
    reason: "I have a gum-bleeding problem.",
    status: "Approved",
    requestDate: new Date("2025-09-17"),
  },
  {
    id: "REQ 112100",
    reason: "I have a gum-bleeding problem.",
    status: "Cancel",
    requestDate: new Date("2025-09-17"),
  },
  {
    id: "REQ 112100",
    reason: "I have a gum-bleeding problem.",
    status: "Pending",
    requestDate: new Date("2025-09-17"),
  },
  {
    id: "REQ 112100",
    reason: "I have a gum-bleeding problem.",
    status: "Pending",
    requestDate: new Date("2025-09-17"),
  },
  // {
  //   id: "REQ 112100",
  //   reason: "I have a gum-bleeding problem.",
  //   status: "Cancel",
  //   requestDate: new Date("2025-09-17"),
  // },
];

const REQUESTS_CARDS: TAppointmentRequestCards = {
  totalRequests: {
    icon: TotalReferrals,
    title: "Total Requests",
    count: 120,
    percentageChange: 100,
    link: "View all requests",
  },
  approvedRequest: {
    icon: AverageReferrals,
    title: "Approved Requests",
    count: 90,
    percentageChange: 75,
    link: "View approved",
  },
  pendingRequests: {
    icon: AttendedReferrals,
    title: "Pending Requests",
    count: 30,
    link: "View pending",
    percentageChange: -25,
  },
  cancelRequests: {
    icon: CancelRequestIcon,
    title: "Cancel Requests",
    count: 15,
    percentageChange: 12.5,
    link: "View cancel",
  },
};

export default async function ReferralHistory(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const page = Number(searchParams?.page) || 1;

  const filteredHistory = DATA_TABLE_ENTRIES.filter((history) =>
    history.id.toLowerCase().includes(query.toLowerCase())
  );

  // if (filteredHistory.length === 0) {
  //   return (
  //     <NoContent
  //       title="Referral History"
  //       placeholder="Enter Id or patient/dentist name"
  //     />
  //   );
  // }

  return (
    <div className=" w-full min-h-full flex flex-col gap-7">
      <div className="flex items-center justify-between">
        <h1 className="font-medium text-3xl">Referral History</h1>
        <div className="flex items-center gap-3">
          <SearchBar placeholder="Enter request no. for appointment requests" />
          <DateFilter />
        </div>
      </div>

      <Suspense key={query + page} fallback={<div>Loading.....</div>}>
        {filteredHistory.length === 0 ? (
          <NoContent1 />
        ) : (
          <>
            <div className="grid grid-cols-4 gap-6">
              {Object.entries(REQUESTS_CARDS).map(([key, card]) => (
                <StatsCard
                  key={key}
                  icon={card.icon}
                  title={card.title}
                  count={card.count}
                  link={card.link}
                  percentageChange={card.percentageChange}
                />
              ))}
            </div>
            <RequestsDataTable entries={DATA_TABLE_ENTRIES} />
          </>
        )}
        <Pagination page={page} />
      </Suspense>
    </div>
  );
}

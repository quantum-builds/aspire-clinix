import {
  TReferralHistoryDataTable,
  TReferraLRequestCards,
} from "@/types/common";
import DateFilter from "../../components/DateFilter";
import NoContent from "../../components/NoContent";
import SearchBar from "../../components/SearchBar";
import { Suspense } from "react";
import {
  AttendedReferrals,
  AverageReferrals,
  TotalReferrals,
  UnattendedReferrals,
} from "@/assets";
import StatsCard from "../referral-request/components/StatsCard";
import Pagination from "../../components/Pagination";
import { ReferralHistoryDataTable } from "./components/ReferralHistoryDataTable";

const DATA_TABLE_ENTRIES: TReferralHistoryDataTable[] = [
  {
    referenceId: "1",
    patientName: "John Doe",
    status: "Assigned",
    disease: "Cavity",
    referralDate: "2025-09-17",
  },
  {
    referenceId: "2",
    patientName: "Jane Roe",
    status: "Assigned",
    disease: "Gum Infection",
    referralDate: "2025-09-16",
  },
  {
    referenceId: "3",
    patientName: "Michael Brown",
    status: "Unassigned",
    disease: "Tooth Decay",
    referralDate: "2025-09-15",
  },
  {
    referenceId: "4",
    patientName: "Emily Davis",
    status: "Assigned",
    disease: "Wisdom Tooth",
    referralDate: "2025-09-14",
  },
  {
    referenceId: "5",
    patientName: "Daniel Wilson",
    status: "Unassigned",
    disease: "Tooth Fracture",
    referralDate: "2025-09-13",
  },
  {
    referenceId: "6",
    patientName: "Sophia Martinez",
    status: "Assigned",
    disease: "Root Canal",
    referralDate: "2025-09-12",
  },
];

const REFERRAL_CARDS: TReferraLRequestCards = {
  totalReferrals: {
    icon: TotalReferrals,
    count: 120,
    percentageChange: 100,
    title: "Total Referrals",
    link: "View all referrals",
  },
  attendedReferrals: {
    icon: AttendedReferrals,
    title: "Attended Referrals",
    count: 90,
    percentageChange: 75,
    link: "View attended",
  },
  unattendedReferrals: {
    icon: UnattendedReferrals,
    title: "Unattended Referrals",
    count: 30,
    link: "View unattended",
    percentageChange: -25,
  },
  averageReferrals: {
    icon: AverageReferrals,
    title: "Average Referrals",
    count: 15,
    percentageChange: 12.5,
  },
};

export default async function ReferralHistory(props: {
  searchParams?: Promise<{
    query?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";

  const filteredHistory = DATA_TABLE_ENTRIES.filter(
    (history) =>
      history.referenceId.toLowerCase().includes(query.toLowerCase()) ||
      history.patientName.toLowerCase().includes(query.toLowerCase())
  );

  if (filteredHistory.length === 0) {
    return (
      <NoContent
        title="Referral History"
        placeholder="Enter Id or patient/dentist name"
      />
    );
  }

  return (
    <div className=" w-full h-full flex flex-col gap-7">
      <div className="flex items-center justify-between">
        <h1 className="font-medium text-3xl">Referral History</h1>
        <div className="flex items-center gap-3">
          <SearchBar placeholder="Enter Id or patient/dentist name" />
          <DateFilter />
        </div>
      </div>

      <Suspense key={query} fallback={<div>Loading.....</div>}>
        <div className="grid grid-cols-4 gap-6">
          {Object.entries(REFERRAL_CARDS).map(([key, card]) => (
            <StatsCard
              key={key}
              icon={card.icon}
              title={card.title}
              count={card.count}
              link={card?.link}
              percentageChange={card.percentageChange}
            />
          ))}
        </div>
        <ReferralHistoryDataTable entries={DATA_TABLE_ENTRIES} />
      </Suspense>
      <Pagination page={10} />
    </div>
  );
}

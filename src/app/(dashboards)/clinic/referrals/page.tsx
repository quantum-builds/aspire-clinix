import {
  TClinicReferralDataTable,
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
import StatsCard from "../../dentist/referral-request/components/StatsCard";
import Pagination from "../../components/Pagination";
import { ClinicReferralDataTable } from "./components/ClinicReferralDataTable";

const DATA_TABLE_ENTRIES: TClinicReferralDataTable[] = [
  {
    referenceId: "1",
    patientName: "John Doe",
    status: "Assigned",
    disease: "Cavity",
    referralDate: "2025-09-17",
    dentistName: "Stone Wave",
    referralDentistName: "Billy David",
  },
  {
    referenceId: "2",
    patientName: "Jane Roe",
    status: "Assigned",
    disease: "Gum Infection",
    referralDate: "2025-09-16",
    dentistName: "Stone Wave",
    referralDentistName: "Billy David",
  },
  {
    referenceId: "3",
    patientName: "Michael Brown",
    status: "Unassigned",
    disease: "Tooth Decay",
    referralDate: "2025-09-15",
    dentistName: "Stone Wave",
    referralDentistName: "Billy David",
  },
  {
    referenceId: "4",
    patientName: "Emily Davis",
    status: "Assigned",
    disease: "Wisdom Tooth",
    referralDate: "2025-09-14",
    dentistName: "Stone Wave",
    referralDentistName: "Billy David",
  },
  {
    referenceId: "5",
    patientName: "Daniel Wilson",
    status: "Unassigned",
    disease: "Tooth Fracture",
    referralDate: "2025-09-13",
    dentistName: "Stone Wave",
    referralDentistName: "Billy David",
  },
  {
    referenceId: "6",
    patientName: "Sophia Martinez",
    status: "Assigned",
    disease: "Root Canal",
    referralDate: "2025-09-12",
    dentistName: "Stone Wave",
    referralDentistName: "Billy David",
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
    title: "Assigned Referrals",
    count: 90,
    percentageChange: 75,
    link: "View assigned",
  },
  unattendedReferrals: {
    icon: UnattendedReferrals,
    title: "Unassigned Referrals",
    count: 30,
    link: "View unassigned",
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
        <h1 className="font-medium text-3xl">Referrals</h1>
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
              link={card.link}
              percentageChange={card.percentageChange}
            />
          ))}
        </div>
        <ClinicReferralDataTable entries={DATA_TABLE_ENTRIES} />
      </Suspense>
      <Pagination page={10} />
    </div>
  );
}

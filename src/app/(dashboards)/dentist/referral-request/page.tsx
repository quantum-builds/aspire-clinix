import {
  TReferraLRequestCards,
  TReferralRequestDataTable,
} from "@/types/common";
import SearchBar from "@/app/(dashboards)/components/SearchBar";
import NoContent from "@/app/(dashboards)/components/NoContent";
import Button from "@/app/(dashboards)/components/Button";
import { Suspense } from "react";
import { ReferralRequestDataTable } from "./components/ReferralRequestDataTable";

const DATA_TABLE_ENTRIES: TReferralRequestDataTable[] = [
  {
    id: "1",
    patientName: "John Doe",
    referringDentistName: "Dr. Smith",
    disease: "Cavity",
    referralDate: "2025-09-17",
  },
  {
    id: "2",
    patientName: "Jane Roe",
    referringDentistName: "Dr. Adams",
    disease: "Gum Infection",
    referralDate: "2025-09-16",
  },
  {
    id: "3",
    patientName: "Michael Brown",
    referringDentistName: "Dr. Lee",
    disease: "Tooth Decay",
    referralDate: "2025-09-15",
  },
  {
    id: "4",
    patientName: "Emily Davis",
    referringDentistName: "Dr. Johnson",
    disease: "Wisdom Tooth",
    referralDate: "2025-09-14",
  },
  {
    id: "5",
    patientName: "Daniel Wilson",
    referringDentistName: "Dr. Clark",
    disease: "Tooth Fracture",
    referralDate: "2025-09-13",
  },
  {
    id: "6",
    patientName: "Sophia Martinez",
    referringDentistName: "Dr. Patel",
    disease: "Root Canal",
    referralDate: "2025-09-12",
  },
];

const REFERRAL_CARDS: TReferraLRequestCards = {
  totalReferrals: {
    count: 120,
    percentageChange: 100,
  },
  attendedReferrals: {
    count: 90,
    percentageChange: 75,
  },
  unattendedReferrals: {
    count: 30,
    percentageChange: -25,
  },
  averageReferrals: {
    percentage: 15,
    percentageChange: 12.5,
  },
};

export default async function ReferralHistoryPage(props: {
  searchParams?: Promise<{
    query?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";

  const filteredHistory = DATA_TABLE_ENTRIES.filter(
    (history) =>
      history.id.toLowerCase().includes(query.toLowerCase()) ||
      history.patientName.toLowerCase().includes(query.toLowerCase()) ||
      history.referringDentistName.toLowerCase().includes(query.toLowerCase())
  );

  if (filteredHistory.length === 0) {
    return (
      <NoContent
        title="Referral Requests"
        placeholder="Enter Id or patient/dentist name"
      />
    );
  }

  return (
    <div className=" w-full h-full flex flex-col gap-7">
      <div className="flex items-center justify-between">
        <h1 className="font-medium text-3xl">Referral Requests</h1>
        <div className="flex items-center gap-3">
          <SearchBar placeholder="Enter Id or patient/dentist name" />
        </div>
      </div>

      <Suspense key={query} fallback={<div>Loading.....</div>}>
        <ReferralRequestDataTable entries={DATA_TABLE_ENTRIES} />
      </Suspense>
    </div>
  );
}

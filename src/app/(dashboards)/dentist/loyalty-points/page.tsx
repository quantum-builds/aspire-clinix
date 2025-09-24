import { TLoyaltyPointsCards, TLoyaltyPointsDataTable } from "@/types/common";
import SearchBar from "@/app/(dashboards)/components/SearchBar";
import NoContent from "@/app/(dashboards)/components/NoContent";
import { Suspense } from "react";
import { LoyaltyPointsDataTable } from "./components/LoyaltyPointsDataTable";
import DateFilter from "../../components/DateFilter";
import StatsCard from "./components/StatsCard";
import { PointsIcon } from "@/assets";
import Pagination from "../../components/Pagination";
import Image from "next/image";

const DATA_TABLE_ENTRIES: TLoyaltyPointsDataTable[] = [
  {
    referenceId: "1",
    patientName: "John Doe",
    dentistName: "Dr. Smith",
    earnedPoints: 1000,
    otherPoints: 2000,
    referralDate: "2025-09-17",
  },
  {
    referenceId: "2",
    patientName: "Jane Roe",
    dentistName: "Dr. Adams",
    earnedPoints: 1000,
    otherPoints: 2000,
    referralDate: "2025-09-16",
  },
  {
    referenceId: "3",
    patientName: "Michael Brown",
    dentistName: "Dr. Lee",
    earnedPoints: 1000,
    otherPoints: 2000,
    referralDate: "2025-09-15",
  },
  {
    referenceId: "4",
    patientName: "Emily Davis",
    dentistName: "Dr. Johnson",
    earnedPoints: 1000,
    otherPoints: 2000,
    referralDate: "2025-09-14",
  },
  {
    referenceId: "5",
    patientName: "Daniel Wilson",
    dentistName: "Dr. Clark",
    earnedPoints: 1000,
    otherPoints: 2000,
    referralDate: "2025-09-13",
  },
  {
    referenceId: "6",
    patientName: "Sophia Martinez",
    dentistName: "Dr. Patel",
    earnedPoints: 1000,
    otherPoints: 2000,
    referralDate: "2025-09-12",
  },
];

const LOYALTY_POINTS_CARDS: TLoyaltyPointsCards = {
  totalPoints: {
    title: "Total Loyalty Points",
    points: 1200,
  },
  receivedPoints: {
    title: "Received Points",
    points: 900,
  },
  unreceivedPoints: {
    title: "Unreceived Points",
    points: 300,
  },
  otherPoints: {
    title: "Other Points",
    points: 150,
  },
};

function calculatePercentages(cards: TLoyaltyPointsCards) {
  const total = Object.values(cards).reduce(
    (sum, card) => sum + card.points,
    0
  );

  return Object.entries(cards).map(([, card]) => ({
    ...card,
    percentage: total > 0 ? (card.points / total) * 100 : 0,
  }));
}

export default async function ReferralHistoryPage(props: {
  searchParams?: Promise<{
    query?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";

  const filteredHistory = DATA_TABLE_ENTRIES.filter(
    (history) =>
      history.referenceId.toLowerCase().includes(query.toLowerCase()) ||
      history.patientName.toLowerCase().includes(query.toLowerCase()) ||
      history.dentistName.toLowerCase().includes(query.toLowerCase())
  );

  if (filteredHistory.length === 0) {
    return (
      <NoContent
        title="Referral Requests"
        placeholder="Enter Id or patient/dentist name"
      />
    );
  }

  const cardsWithPercentages = calculatePercentages(LOYALTY_POINTS_CARDS);

  const total = Object.values(LOYALTY_POINTS_CARDS).reduce(
    (sum, card) => sum + card.points,
    0
  );

  return (
    <div className=" w-full min-h-full flex flex-col gap-7">
      <div className="flex items-center justify-between">
        <h1 className="font-medium text-3xl">Loyalty Points</h1>
        <div className="flex items-center gap-3">
          <SearchBar placeholder="Enter Id or patient/dentist name" />
          <DateFilter />
        </div>
      </div>
      <div>
        <p className="italic">Total points earned</p>
        <div className="flex gap-5 items-center">
          <p className="text-5xl text-green font-semibold">
            {total.toFixed(2)}
          </p>
          <Image src={PointsIcon} alt="Loyalty Points Icon" />
        </div>
      </div>

      <Suspense key={query} fallback={<div>Loading.....</div>}>
        <div className="grid grid-cols-4 gap-6">
          {cardsWithPercentages.map((card) => (
            <StatsCard
              key={card.title}
              title={card.title}
              points={card.points}
              percentage={card.percentage}
            />
          ))}
        </div>
        <LoyaltyPointsDataTable entries={DATA_TABLE_ENTRIES} />
      </Suspense>
      <Pagination page={10} />
    </div>
  );
}

import StatsCard from "@/app/(dashboards)/dentist/(protected)/referral-request/components/StatsCard";
import {
  AttendedReferrals,
  AverageReferrals,
  TotalReferrals,
  UnattendedReferrals,
} from "@/assets";
import { TReferraLRequestCards, TTotalReferrals } from "@/types/common";
import { ReferralRequestStatus } from "@prisma/client";

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
    // statusParams: `/${ReferralRequestStatus.ASSIGNED.toLowerCase()}`,
  },
  unattendedReferrals: {
    icon: UnattendedReferrals,
    title: "Unassigned Referrals",
    count: 30,
    link: "View unassigned",
    percentageChange: -25,
    // statusParams: `/${ReferralRequestStatus.UNASSIGNED.toLowerCase()}`,
  },
  averageReferrals: {
    icon: AverageReferrals,
    title: "Average Referrals",
    count: 15,
    percentageChange: 12.5,
  },
};

export default function StatsCardWrapper() {
  return (
    <div className="grid xl:grid-cols-4 grid-cols-2 gap-6">
      {Object.entries(REFERRAL_CARDS).map(([key, card]) => (
        <StatsCard
          key={key}
          icon={card.icon}
          title={card.title}
          count={card.count}
          link={card.link}
          percentageChange={card.percentageChange}
          statusParam={"statusParams" in card ? card.statusParams : undefined}
        />
      ))}
    </div>
  );
}

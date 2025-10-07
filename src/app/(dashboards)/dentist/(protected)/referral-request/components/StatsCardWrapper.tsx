import StatsCard from "@/app/(dashboards)/dentist/(protected)/referral-request/components/StatsCard";
import {
  AttendedReferrals,
  AverageReferrals,
  TotalReferrals,
  UnattendedReferrals,
} from "@/assets";
import { DentistReferralPageTYpe, TReferraLRequestCards, TTotalReferrals } from "@/types/common";
import { TReferralRequestStasts } from "@/types/referral-request";
import { Response } from "@/types/common";
import { getReferralRequests } from "@/services/referralRequest/referralRequestQuery";
import { ReferralRequestStatus } from "@prisma/client";

export default async function StatsCardWrapper() {
  const response: Response<TReferralRequestStasts> =
    await getReferralRequests({
      statsOnly: true,
      pageType: DentistReferralPageTYpe.REQUEST
    });

  const REFERRAL_CARDS: TReferraLRequestCards = {
    totalReferrals: {
      icon: TotalReferrals,
      count: response?.data?.totalReferrals?.count || 0,
      percentageChange: response?.data?.totalReferrals?.percentageChange || 0,
      title: "Total Referrals",
      link: "View all referrals",
    },
    attendedReferrals: {
      icon: AttendedReferrals,
      title: "Assigned Referrals",
      count: response?.data?.assignedReferrals?.count || 0,
      percentageChange: response?.data?.assignedReferrals?.percentageChange || 0,
      link: "View assigned",
      statusParams: `${ReferralRequestStatus.ASSIGNED}`,
    },
    unattendedReferrals: {
      icon: UnattendedReferrals,
      title: "Unassigned Referrals",
      count: response?.data?.unassignedReferrals?.count || 0,
      percentageChange: response?.data?.unassignedReferrals?.percentageChange || 0,
      link: "View unassigned",
      statusParams: `${ReferralRequestStatus.UNASSIGNED}`,
    },
    averageReferrals: {
      icon: AverageReferrals,
      title: "Average Referrals",
      count: response?.data?.averageReferrals?.count || 0,
      percentageChange: response?.data?.averageReferrals?.percentageChange || 0,
    },
  };

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

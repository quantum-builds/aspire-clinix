export type TReferralAnalyticsFilters = {
  after?: string;
  before?: string;
  specialty?: string;
  practice?: string;
};

export type TReferralAnalyticsInterval = "day" | "week" | "month";

export type TReferralTrendPoint = {
  date: string;
  received: number;
  converted: number;
};

export type TReferralTrend = {
  interval: TReferralAnalyticsInterval;
  points: TReferralTrendPoint[];
};

export type TReferralBreakdown = {
  status: {
    status: string;
    count: number;
  }[];
  funnel: {
    stage: string;
    count: number;
  }[];
  specialty: {
    specialty: string;
    count: number;
  }[];
  callStatus: {
    status: string;
    count: number;
  }[];
};

export type TTopReferrer = {
  gdc: string;
  name: string;
  practice: string | null;
  total: number;
  accepted: number;
  converted: number;
  conversionRate: number;
  lastReferralAt: string;
};

export type TTopReferrers = {
  referrers: TTopReferrer[];
};

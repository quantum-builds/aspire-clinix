export interface WellnessBookingEmailData {
  firstName?: string;
  date: string;
  time: string;
  /** e.g. "60 minutes"; set for admin-managed sessions such as Breathwork. */
  duration?: string;
}

export interface WellnessBookingEmail {
  subject: string;
  build: (data: WellnessBookingEmailData) => string;
}

"use client";

import { useRouter } from "next/navigation";
import { useEffect, Suspense, ReactNode } from "react";
import { showToast } from "@/utils/defaultToastOptions";
import PageTopBar from "@/app/(dashboards)/components/custom-components/PageTopBar";
import CustomButton from "@/app/(dashboards)/components/custom-components/CustomButton";
import { AppointmentState } from "@/types/appointment";

interface UpcomingAppointmentsContentProps {
  status: { status?: boolean; data?: { status?: boolean } } | null;
  searchParams?: {
    status?: string;
    on?: string;
    before?: string;
    after?: string;
  };
  children: ReactNode;
}

export default function UpcomingAppointmentsContent({
  status,
  searchParams,
  children,
}: UpcomingAppointmentsContentProps) {
  const router = useRouter();

  useEffect(() => {
    if (status) {
      
      if (status.status === true || status.data?.status === true) {
        showToast(
          "success",
          "Payment successful! Your appointment is confirmed.",
        );
      } else {
        showToast(
          "error",
          "Payment verification failed. Please contact support.",
        );
      }
    }
  }, [status, router]);

  return (
    <div className="min-h-[103vh] flex flex-col gap-5">
      <PageTopBar
        pageHeading="Appointments"
        showSearch={false}
        showFilters={true}
        filtersBelow={true}
        lockAfterDate={true}
        statusOptions={[
          { value: AppointmentState.PENDING, label: AppointmentState.PENDING },
          {
            value: AppointmentState.CONFIRMED,
            label: AppointmentState.CONFIRMED,
          },
          { value: AppointmentState.ARRIVED, label: AppointmentState.ARRIVED },
          {
            value: AppointmentState.INSURGERY,
            label: AppointmentState.INSURGERY,
          },
          {
            value: AppointmentState.COMPLETED,
            label: AppointmentState.COMPLETED,
          },
          {
            value: AppointmentState.CANCELLED,
            label: AppointmentState.CANCELLED,
          },
          {
            value: AppointmentState.DIDNOTATTEND,
            label: AppointmentState.DIDNOTATTEND,
          },
        ]}
        preBtns={
          <CustomButton
            text="Book Wellness Appointment"
            href="/patient/plan-selection"
            style="white"
            className="border border-green hover:bg-[#ede9e4] "

          />
        }
        extraBtns={
          <CustomButton
            text="Book Dental Appointment"
            href="https://aspire-dental.portal.dental/"

          />
        }
      />
      <Suspense >{children}</Suspense>
    </div>
  );
}

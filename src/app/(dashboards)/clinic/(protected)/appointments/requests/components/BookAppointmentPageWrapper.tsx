import { Suspense } from "react";
import { getPractices } from "@/services/practice/practiceQuery";
import PageTopBar from "@/app/(dashboards)/components/custom-components/PageTopBar";
import CustomButton from "@/app/(dashboards)/components/custom-components/CustomButton";
import RequestDetailsModalWrapper from "./RequestDetailsModalWrapper";
import { getAppointmentRequest } from "@/services/appointmentRequests/appointmentRequestQuery";
import BookAppointmentFormSkeleton from "../[id]/components/skeletons/BookAppointmentForm";
import AppointmentRequestFormWrapper from "../[id]/components/AppointmentRequestFormWrapper";

interface AppointmentRequestPageWrapperProps {
  id: string;
  searchParams?: {
    practiceId?: string;
    showModal?: string;
  };
}

export default async function AppointmentRequestPageWrapper({
  id,
  searchParams,
}: AppointmentRequestPageWrapperProps) {
  const practiceId = searchParams?.practiceId || "";
  const showModal = searchParams?.showModal === "true";

  const [practicesResponse, appointmentRequestResponse] = await Promise.all([
    getPractices({}),
    showModal ? getAppointmentRequest(id) : Promise.resolve(null),
  ]);

  const practices = practicesResponse.data?.practices ?? [];
  const appointmentRequest = appointmentRequestResponse?.data;

  return (
    <div className="w-full min-h-screen flex flex-col gap-5">
      <PageTopBar
        pageHeading="Appointment Requests"
        statusOptions={null}
        showSearch={false}
        showFilters={false}
        showBackBtn={true}
        extraBtns={
          <CustomButton
            text="See Patient Details"
            style="secondary"
            href={`/clinic/appointments/requests/${id}/book?showModal=true`}
          />
        }
      />

      <Suspense key={id} fallback={<BookAppointmentFormSkeleton />}>
        <AppointmentRequestFormWrapper
          id={id}
          practiceId={practiceId}
          practices={practices}
        />
      </Suspense>

      {showModal && appointmentRequest && (
        <RequestDetailsModalWrapper
          request={appointmentRequest}
          practiceId={practiceId}
        />
      )}
    </div>
  );
}

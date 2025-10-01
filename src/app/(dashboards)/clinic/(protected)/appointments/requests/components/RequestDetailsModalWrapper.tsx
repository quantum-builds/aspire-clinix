// app/clinic/appointment-requests/components/RequestDetailsModalWrapper.tsx
"use client";

import { useRouter } from "next/navigation";
import { TAppointmentRequest } from "@/types/appointment-request";
import RequestDetailsModal from "./RequestDetailsModal";

interface RequestDetailsModalWrapperProps {
  request: TAppointmentRequest;
  practiceId: string;
}

export default function RequestDetailsModalWrapper({
  request,
}: RequestDetailsModalWrapperProps) {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  return (
    <RequestDetailsModal
      open={true}
      onClose={handleClose}
      request={request}
      showBtns={false}
    />
  );
}

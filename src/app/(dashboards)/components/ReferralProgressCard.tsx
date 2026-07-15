"use client";

import { formatDate } from "@/utils/formatDateTime";

interface ReferralProgressCardProps {
  requestStatus: string;
  assignedDentist?: { firstName: string; lastName: string; email: string } | null;
  dentistResponseStatus?: string | null;
  dentistComments?: string | null;
  proposedTreatmentDetails?: string | null;
  proposedConsultationTime?: string | null;
  respondedAt?: string | null;
}

const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
  UNASSIGNED: { label: "Unassigned", color: "text-yellow-600", dot: "bg-yellow-600" },
  PENDING_REVIEW: {
    label: "Pending Dentist Review",
    color: "text-blue-600",
    dot: "bg-blue-500",
  },
  ACCEPTED: {
    label: "Accepted by Dentist",
    color: "text-emerald-600",
    dot: "bg-emerald-500",
  },
  REJECTED: {
    label: "Rejected by Dentist",
    color: "text-red-600",
    dot: "bg-red-500",
  },
  ASSIGNED: {
    label: "Appointment Bound",
    color: "text-green-600",
    dot: "bg-green-500",
  },
};

export default function ReferralProgressCard({
  requestStatus,
  assignedDentist,
  dentistResponseStatus,
  dentistComments,
  proposedTreatmentDetails,
  proposedConsultationTime,
  respondedAt,
}: ReferralProgressCardProps) {
  const config = statusConfig[requestStatus] ?? {
    label: requestStatus,
    color: "text-gray-600",
    dot: "bg-gray-400",
  };

  return (
    <div className="bg-white w-full rounded-2xl p-6 space-y-4 border border-gray-100">
      <div className="flex items-center justify-between">
        <p className="font-medium text-dashboardTextBlack text-2xl">
          Referral Progress
        </p>
      </div>

      <div className="flex items-center gap-2">
        <div className={`size-3 rounded-full ${config.dot}`} />
        <span className={`font-semibold text-lg ${config.color}`}>
          {config.label}
        </span>
      </div>

      {assignedDentist && (
        <div className="bg-gray p-4 rounded-xl space-y-1">
          <p className="font-medium text-dashboardTextBlack">
            Assigned Dentist
          </p>
          <p className="text-gray-700">
            {assignedDentist.firstName} {assignedDentist.lastName}
          </p>
          <p className="text-gray-500 text-sm">{assignedDentist.email}</p>
        </div>
      )}

      {dentistResponseStatus && respondedAt && (
        <div className="bg-gray p-4 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <p className="font-medium text-dashboardTextBlack">
              Dentist Response
            </p>
            <span className="text-sm text-gray-500">
              {respondedAt ? formatDate(new Date(respondedAt)) : ""}
            </span>
          </div>

          {dentistComments && (
            <div>
              <p className="text-sm font-medium text-gray-600">Comments:</p>
              <p className="text-gray-800 mt-1">{dentistComments}</p>
            </div>
          )}

          {proposedTreatmentDetails && (
            <div>
              <p className="text-sm font-medium text-gray-600">
                Proposed Treatment:
              </p>
              <p className="text-gray-800 mt-1">{proposedTreatmentDetails}</p>
            </div>
          )}

          {proposedConsultationTime && (
            <div>
              <p className="text-sm font-medium text-gray-600">
                Proposed Consultation Time:
              </p>
              <p className="text-gray-800 mt-1">{proposedConsultationTime}</p>
            </div>
          )}

          {!dentistComments &&
            !proposedTreatmentDetails &&
            !proposedConsultationTime && (
              <p className="text-gray-500 italic">No details provided</p>
            )}
        </div>
      )}
    </div>
  );
}

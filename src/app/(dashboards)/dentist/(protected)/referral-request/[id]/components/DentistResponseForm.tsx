"use client";

import { useState } from "react";
import { showToast } from "@/utils/defaultToastOptions";
import { useRespondToReferralMutation } from "@/services/referralRequest/referralRequestMutation";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

interface DentistResponseFormProps {
  referralRequestId: string;
  existingComments?: string | null;
  existingTreatment?: string | null;
  existingTime?: string | null;
}

export default function DentistResponseForm({
  referralRequestId,
  existingComments,
  existingTreatment,
  existingTime,
}: DentistResponseFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: respond, isPending } = useRespondToReferralMutation();

  const [comments, setComments] = useState(existingComments || "");
  const [proposedTreatmentDetails, setProposedTreatmentDetails] = useState(
    existingTreatment || ""
  );
  const [proposedConsultationTime, setProposedConsultationTime] = useState(
    existingTime || ""
  );

  const handleSubmit = (action: "ACCEPTED" | "REJECTED") => {
    respond(
      {
        referralRequestId,
        action,
        comments,
        proposedTreatmentDetails,
        proposedConsultationTime,
      },
      {
        onSuccess: (data) => {
          if (data.status) {
            showToast(
              "success",
              action === "ACCEPTED"
                ? "Referral accepted successfully"
                : "Referral rejected"
            );
            queryClient.invalidateQueries({ queryKey: ["referral-requests"] });
            router.refresh();
          } else {
            showToast("error", data.message || "Failed to submit response");
          }
        },
        onError: (error) => {
          showToast("error", error.message || "An error occurred");
        },
      }
    );
  };

  return (
    <div className="bg-white w-full rounded-2xl p-6 space-y-4 border border-gray-100">
      <p className="font-medium text-dashboardTextBlack text-2xl">
        Respond to Referral
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Comments
          </label>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Add your comments about this referral..."
            rows={3}
            className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Proposed Treatment Details
          </label>
          <textarea
            value={proposedTreatmentDetails}
            onChange={(e) => setProposedTreatmentDetails(e.target.value)}
            placeholder="Describe the proposed treatment or consultation..."
            rows={2}
            className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Proposed Consultation / Availability Time
          </label>
          <input
            type="text"
            value={proposedConsultationTime}
            onChange={(e) => setProposedConsultationTime(e.target.value)}
            placeholder="e.g., Monday 10am-12pm, or 2026-07-20 at 2pm"
            className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={() => handleSubmit("ACCEPTED")}
          disabled={isPending}
          className="flex-1 px-6 py-2.5 bg-green text-white rounded-lg hover:bg-greenHover transition-colors disabled:opacity-50 font-medium"
        >
          {isPending ? "Submitting..." : "Accept Referral"}
        </button>
        <button
          onClick={() => handleSubmit("REJECTED")}
          disabled={isPending}
          className="flex-1 px-6 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 font-medium"
        >
          {isPending ? "Submitting..." : "Reject Referral"}
        </button>
      </div>
    </div>
  );
}

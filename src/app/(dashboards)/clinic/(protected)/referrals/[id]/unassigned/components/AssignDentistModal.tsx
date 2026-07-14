"use client";

import { useState } from "react";
import { X, Loader2, Check, UserX } from "lucide-react";
import { showToast } from "@/utils/defaultToastOptions";
import { useAssignDentistMutation, useUnassignDentistMutation } from "@/services/referralRequest/referralRequestMutation";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useGetDentallyPractitioners } from "@/services/dentallyPractitioner/dentallyPractitionerQuery";

interface AssignDentistModalProps {
  isOpen: boolean;
  onClose: () => void;
  referralRequestId: string;
  currentlyAssignedDentistId?: string | null;
}

export default function AssignDentistModal({
  isOpen,
  onClose,
  referralRequestId,
  currentlyAssignedDentistId,
}: AssignDentistModalProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [processingId, setProcessingId] = useState<number | null>(null);

  const { data: practitioners, isPending, error } = useGetDentallyPractitioners();
  const { mutate: assignDentist } = useAssignDentistMutation();
  const { mutate: unassignDentist } = useUnassignDentistMutation();

  const handleAssign = (practitionerId: number) => {
    setProcessingId(practitionerId);
    assignDentist(
      { referralRequestId, practitionerId },
      {
        onSuccess: (data) => {
          if (data.status) {
            showToast("success", "Referral assigned successfully");
            queryClient.invalidateQueries({ queryKey: ["referral-requests"] });
            onClose();
            router.refresh();
          } else {
            showToast("error", data.message || "Failed to assign referral");
          }
        },
        onError: (error) => {
          showToast("error", error.message || "An error occurred");
        },
        onSettled: () => setProcessingId(null),
      }
    );
  };

  const handleUnassign = () => {
    setProcessingId(-1);
    unassignDentist(
      { referralRequestId },
      {
        onSuccess: (data) => {
          if (data.status) {
            showToast("success", "Referral unassigned successfully");
            queryClient.invalidateQueries({ queryKey: ["referral-requests"] });
            onClose();
            router.refresh();
          } else {
            showToast("error", data.message || "Failed to unassign referral");
          }
        },
        onError: (error) => {
          showToast("error", error.message || "An error occurred");
        },
        onSettled: () => setProcessingId(null),
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col m-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-dashboardTextBlack">
              Assign Referral
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Select a Dentally practitioner to assign this referral
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {isPending ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-green mb-3" />
              <p className="text-gray-500">Loading practitioners...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-red-500 mb-2">
                Failed to load practitioners from Dentally
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-green text-white rounded-full text-sm hover:bg-greenHover transition-colors"
              >
                Retry
              </button>
            </div>
          ) : !practitioners || practitioners.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-gray-500 mb-2">
                No practitioners found in Dentally
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {practitioners.map((p: any) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium text-dashboardTextBlack">
                      {p.firstName} {p.lastName}
                    </p>
                    <p className="text-sm text-gray-500">{p.email}</p>
                    {p.gdcNumber && (
                      <p className="text-sm text-gray-400">
                        GDC: {p.gdcNumber}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {currentlyAssignedDentistId ? (
                      <button
                        onClick={handleUnassign}
                        disabled={processingId !== null}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50 text-sm"
                      >
                        {processingId === -1 ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <UserX className="w-4 h-4" />
                        )}
                        Unassign
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAssign(p.id)}
                        disabled={processingId !== null}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-green text-white hover:bg-greenHover transition-colors disabled:opacity-50 text-sm"
                      >
                        {processingId === p.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                        Assign
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

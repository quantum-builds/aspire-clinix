"use client";

import { FormEvent, useEffect, useState } from "react";
import { TAppointment } from "@/types/appointment";
import AppointmentListItem from "./AppointmentListItem";
import {
  X,
  Loader2,
  Search,
  UserRound,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { showToast } from "@/utils/defaultToastOptions";
import { getAxiosErrorMessage } from "@/utils/getAxiosErrorMessage";
import {
  SimilarPatient,
  useGetAppointmentsByPatient,
  useGetSimilarPatients,
} from "@/services/appointments/appointmentMutation";
import { useAppointmentBindingMutation } from "@/services/referralRequest/referralRequestMutation";
import { useRouter } from "next/navigation";
interface BindAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  practitionerId: number | null;
  referralRequestId: string;
  onAppointmentBound: () => void;
}

export default function BindAppointmentModal({
  isOpen,
  onClose,
  patientName,
  practitionerId,
  referralRequestId,
  onAppointmentBound,
}: BindAppointmentModalProps) {
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    string | null
  >(null);
  const router = useRouter();

  // Step 1: similar patient names. Step 2: the chosen patient's appointments.
  const [selectedPatient, setSelectedPatient] = useState<SimilarPatient | null>(
    null,
  );
  const [searchText, setSearchText] = useState(patientName);
  // undefined = search with the referral's own name (read on the server).
  const [submittedSearch, setSubmittedSearch] = useState<string | undefined>(
    undefined,
  );

  // Each time the modal opens, start from the referral's patient name.
  useEffect(() => {
    if (!isOpen) return;
    setSearchText(patientName);
    setSubmittedSearch(undefined);
    setSelectedPatient(null);
  }, [isOpen, patientName]);

  const {
    data: similarPatients,
    isPending: isLoadingPatients,
    error: patientsError,
  } = useGetSimilarPatients(referralRequestId, submittedSearch, isOpen);

  const {
    data: appointments,
    isPending,
    error,
  } = useGetAppointmentsByPatient(
    selectedPatient?.dentallyPatientId ?? null,
    practitionerId,
  );

  // Only appointments not already bound to a referral can be bound here.
  const availableAppointments = (appointments ?? []).filter(
    (appointment) => appointment.bindStatus !== "BOUND",
  );
  const hasBoundOnly =
    (appointments?.length ?? 0) > 0 && availableAppointments.length === 0;

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    const text = searchText.trim();
    setSelectedPatient(null);
    setSubmittedSearch(text && text !== patientName.trim() ? text : undefined);
  };
  const { mutate: updateAppointmentBinding, isPending: isUpdatingBinding } =
    useAppointmentBindingMutation();

  const handleSelectAppointment = (
    appointmentId: string,
    practitionerId: number,
  ) => {
    setSelectedAppointmentId(appointmentId);

    updateAppointmentBinding(
      {
        referralRequestId,
        appointmentId,
        practitionerId,
        requestStatus: "ASSIGNED",
      },
      {
        onSuccess: (data) => {
          if (data.status) {
            showToast("success", "Appointment bound successfully");
            onClose();

            onAppointmentBound();
            setTimeout(() => {
              router.refresh();
            }, 100);
          } else {
            showToast("error", data.message || "Failed to bind appointment");
          }
        },
        onError: (error) => {
          showToast(
            "error",
            getAxiosErrorMessage(error) ||
              "An error occurred while binding appointment",
          );
        },
      },
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col m-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-dashboardTextBlack">
              Bind Appointment
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {selectedPatient
                ? "Select an appointment to bind with this referral"
                : "Select the matching Dentally patient"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 relative">
          {selectedPatient && practitionerId && (
            <div className="mb-4 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSelectedPatient(null)}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to patients
              </button>
              <span className="text-sm font-medium text-dashboardTextBlack">
                {selectedPatient.name}
              </span>
            </div>
          )}
          {!practitionerId ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-gray-500 mb-2">
                The assigned dentist is not linked to Dentally, so their
                appointments can&apos;t be loaded.
              </p>
            </div>
          ) : !selectedPatient ? (
            <div className="flex flex-col gap-4">
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchText}
                    onChange={(event) => setSearchText(event.target.value)}
                    placeholder="Search patient name in Dentally"
                    className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm text-dashboardTextBlack outline-none focus:border-green"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green text-white rounded-lg text-sm hover:bg-greenHover transition-colors"
                >
                  Search
                </button>
              </form>

              <p className="text-sm text-gray-500">
                Similar patients for{" "}
                <span className="font-medium text-dashboardTextBlack">
                  &quot;{similarPatients?.searchName ?? patientName}&quot;
                </span>
              </p>

              {isLoadingPatients ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-green mb-3" />
                  <p className="text-gray-500">Searching Dentally...</p>
                </div>
              ) : patientsError ? (
                <p className="py-8 text-center text-red-500">
                  {getAxiosErrorMessage(patientsError) ||
                    "Failed to search patients in Dentally"}
                </p>
              ) : !similarPatients || similarPatients.patients.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-gray-500 mb-2">
                    No similar patient found in Dentally
                  </p>
                  <p className="text-sm text-gray-400">
                    Check the spelling, or search with a different name above
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {similarPatients.patients.map((patient, index) => {
                    const isBest = index === 0 && patient.match === "EXACT";

                    return (
                      <button
                        key={patient.dentallyPatientId}
                        type="button"
                        onClick={() => setSelectedPatient(patient)}
                        className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors hover:border-green ${
                          isBest ? "border-green bg-[#F3F5F7]" : "border-gray-200"
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <UserRound className="h-5 w-5 text-gray-400" />
                          <span className="font-medium text-dashboardTextBlack">
                            {patient.name}
                          </span>
                        </span>
                        <span className="flex items-center gap-2">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              patient.match === "EXACT"
                                ? "bg-green text-white"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {patient.match === "EXACT"
                              ? "Exact match"
                              : "Close match"}
                          </span>
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ) : isPending ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-green mb-3" />
              <p className="text-gray-500">Loading appointments...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-red-500 mb-2">
                {error instanceof Error ? (
                  <p>
                    No appointment was found for this patient in Dentally.
                    Please book an appointment in Dentally for this patient,
                    then try to bind it again.
                  </p>
                ) : (
                  "Failed to fetch appointments"
                )}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-green text-white rounded-full text-sm hover:bg-greenHover transition-colors"
              >
                Retry
              </button>
            </div>
          ) : availableAppointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-gray-500 mb-2">
                {hasBoundOnly
                  ? "All of this patient's appointments are already bound to other referrals"
                  : "No appointments found for this patient with the assigned dentist"}
              </p>
              <p className="text-sm text-gray-400">
                {hasBoundOnly
                  ? "Book a new appointment in Dentally to bind it to this referral"
                  : "Appointments must be created in Dentally first"}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {availableAppointments.map((appointment: TAppointment) => (
                <AppointmentListItem
                  key={appointment.id}
                  appointment={appointment}
                  onSelect={(id, practitionerId) =>
                    handleSelectAppointment(id, practitionerId)
                  }
                  isLoading={
                    isUpdatingBinding &&
                    selectedAppointmentId === String(appointment.id)
                  }
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
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

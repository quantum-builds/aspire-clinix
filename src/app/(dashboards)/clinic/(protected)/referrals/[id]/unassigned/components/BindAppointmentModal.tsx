"use client";

import { useState } from "react";
import { TAppointment } from "@/types/appointment";
import AppointmentListItem from "./AppointmentListItem";
import { X, Loader2 } from "lucide-react";
import { showToast } from "@/utils/defaultToastOptions";
import { useGetAppointmentsByPatient } from "@/services/appointments/appointmentMutation";
import { useBindAppointmentToReferral } from "@/services/referralRequest/referralRequestMutation";
import { useRouter } from "next/navigation";

interface BindAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string
  referralRequestId: string;
  onAppointmentBound: () => void;
}

export default function BindAppointmentModal({
  isOpen,
  onClose,
  patientName,
  referralRequestId,
  onAppointmentBound,
}: BindAppointmentModalProps) {
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const router = useRouter()

  const { data: appointments, isPending, error } = useGetAppointmentsByPatient(patientName);
  const { mutate: bindAppointment, isPending: isBinding } = useBindAppointmentToReferral();

  const handleSelectAppointment = (appointmentId: string, practitionerId: number) => {
    setSelectedAppointmentId(appointmentId);

    bindAppointment(
      {
        referralRequestId,
        appointmentId,
        practitionerId,
      },
      {
        onSuccess: (data) => {
          if (data.status) {
            showToast("success", "Appointment bound successfully");
            onClose();
            onAppointmentBound();
          } else {
            showToast("error", data.message || "Failed to bind appointment");
          }
        },
        onError: (error) => {
          showToast("error", error.message || "An error occurred while binding appointment");
        },
      }
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
              Select an appointment to bind with this referral
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
        <div className="flex-1 overflow-y-auto p-6">
          {isPending ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-green mb-3" />
              <p className="text-gray-500">Loading appointments...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-red-500 mb-2">
                {error instanceof Error ? error.message : "Failed to fetch appointments"}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-green text-white rounded-full text-sm hover:bg-greenHover transition-colors"
              >
                Retry
              </button>
            </div>
          ) : !appointments || appointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-gray-500 mb-2">No appointments found for this patient</p>
              <p className="text-sm text-gray-400">
                Appointments must be created in Dentally first
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {appointments.map((appointment: TAppointment) => (
                <AppointmentListItem
                  key={appointment.id}
                  appointment={appointment}
                  onSelect={(id) => handleSelectAppointment(id, appointment.practitionerId)}
                  isLoading={isBinding && selectedAppointmentId === String(appointment.id)}
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

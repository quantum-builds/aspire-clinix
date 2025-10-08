"use client"

import StatusBage from "@/app/(dashboards)/components/StatusBadge";
import ConfirmationModal from "@/app/(dashboards)/components/ConfirmationModal";
import CustomButton from "@/app/(dashboards)/components/custom-components/CustomButton";
import { CalenderInputIconV2, CancelIcon, DropDownIcon, TimeIcon, TimeIconV2 } from "@/assets";
import { usePatchAppointment } from "@/services/appointments/appointmentMutation";
import { TAppointment } from "@/types/appointment";
import { formatDate, formatTime } from "@/utils/formatDateTime";
import { AppointmentStatus } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { capitalize } from "@/utils/formatWords";
import Dropdown from "@/app/(dashboards)/components/custom-components/DropDown";
import { TokenRoles } from "@/constants/UserRoles";
import { getAxiosErrorMessage } from "@/utils/getAxiosErrorMessage";
import { showToast } from "@/utils/defaultToastOptions";

export default function AppointmentCard({
  appointment,
  role
}: {
  appointment: TAppointment;
  role: string
}) {
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsCOnfirmModelOpen] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] =
    useState<AppointmentStatus | null>(null);
  const router = useRouter();
  const { mutate: updateAppointment, isPending: updateAppointmentLoader } =
    usePatchAppointment();

  const handleStusChange = () => {
    if (!selectedStatus) return;
    updateAppointment(
      {
        id: appointment.id,
        appointment: { state: selectedStatus },
      },
      {
        onSuccess: () => {

          router.refresh()
          if (selectedStatus === "CANCELLED") {
            if (role === TokenRoles.ADMIN)
              router.replace(`/clinic/referrals?ts=${Date.now()}`)
            else if (role === TokenRoles.DENTIST || role === TokenRoles.RECIEVING_DENTIST)
              router.replace(`/dentist/referral-request?ts=${Date.now()}`)
          }
          setIsUpdateModalOpen(false);
          setIsCancelModalOpen(false);
          setIsCOnfirmModelOpen(false);
          setMenuOpen(false);
        },
        onError: (error) => {
          const err = getAxiosErrorMessage(error)
          showToast("error", err)
          setIsUpdateModalOpen(false);
          setIsCancelModalOpen(false);
          setIsCOnfirmModelOpen(false);
          setMenuOpen(false);
        },
      }
    )
  };

  const statusOptions: AppointmentStatus[] = [
    AppointmentStatus.COMPLETED,
    AppointmentStatus.CONFIRMED,
    // AppointmentStatus.CANCELLED,
    AppointmentStatus.DID_NOT_ATTEND,
    AppointmentStatus.ARRIVED,
    AppointmentStatus.IN_SURGERY,
    AppointmentStatus.PENDING
  ];
  return (
    <div className="bg-dashboardBarBackground rounded-2xl p-6 space-y-10">
      <p className="font-medium text-2xl">Appointment</p>
      <div className="lg50:w-3/4 1xl:w-2/3 2xl:w-1/2 bg-gray">
        <div
          className="border border-green rounded-2xl p-6 space-y-8"
          key={appointment.id}
        >
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <p className="text-dashboardTextBlack font-medium text-2xl">
                Appointment
              </p>
              <div className="flex gap-3 items-center">
                <p className="flex items-center gap-2 text-xl">
                  <Image src={CalenderInputIconV2} alt="Calender Icon" />
                  {formatDate(appointment.date)}
                </p>
                <p className="flex items-center gap-2 text-xl">
                  <Image src={TimeIconV2} alt="Time icon" />
                  {formatTime(appointment.startTime)}{" "} - {" "}{formatTime(appointment.finishTime)}
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <p className="italic text-green font-medium text-xl">
                Status: {appointment.state}
              </p>
            </div>
            {appointment.state !== AppointmentStatus.PENDING &&
              <div className="flex justify-between items-center mt-2">
                <div className="flex gap-1 items-center">
                  <p className="text-lg flex gap-1 items-center">
                    Status: <StatusBage status={appointment.state} />
                  </p>
                </div>
                <div className="relative">
                  <Dropdown
                    options={statusOptions.filter((status) => status !== appointment.state).map((status) => ({
                      value: status,
                      label: capitalize(status),
                    }))}
                    value={selectedStatus || ""}
                    onValueChange={(newStatus) => {
                      setSelectedStatus(newStatus as AppointmentStatus);
                      setIsUpdateModalOpen(true);
                    }}
                    placeholder="Select Status"
                    triggerClassName="text-green text-lg font-semibold cursor-pointer"
                    contentClassName="bg-white border border-green rounded-lg shadow-lg"
                    className="relative"
                  />

                </div>
              </div>
            }
          </div>
          <div className="flex justify-between items-end">
            {/* <Button text="See reports" href={`/dentist/appointments/${appointment.id}/reports`} /> */}
            <div className="flex justify-between w-full">
              {appointment.state === AppointmentStatus.PENDING &&
                <div className="flex items-center gap-2 w-full mt-7">
                  {role !== TokenRoles.ADMIN &&
                    <CustomButton
                      text="Confirm Appointment"
                      handleOnClick={() => {
                        setSelectedStatus(AppointmentStatus.CONFIRMED)
                        setIsCOnfirmModelOpen(true)
                      }
                      }
                    />
                  }
                  <CustomButton
                    handleOnClick={() => {
                      setSelectedStatus(AppointmentStatus.CANCELLED)
                      setIsCancelModalOpen(true)
                    }
                    }
                    text="Cancel"
                    style="white"
                    className="hover:bg-lightGray"
                  />
                </div>
              }
              {appointment.state !== AppointmentStatus.PENDING &&
                <div className="flex items-center gap-2 w-full mt-7">
                  <CustomButton
                    text="See Reports"
                    href={`/dentist/appointments/${appointment.id}/reports`}
                  />
                  <CustomButton
                    handleOnClick={() => {
                      setSelectedStatus(AppointmentStatus.CANCELLED)
                      setIsCancelModalOpen(true)
                    }
                    }
                    text="Cancel"
                    style="white"
                    className="hover:bg-lightGray"
                  />
                </div>
              }
            </div>
            <p className="font-medium italic text-xl text-green text-nowrap">
              Assigned to {appointment.dentist.fullName}
            </p>
          </div>
        </div>
      </div>
      <ConfirmationModal
        icon={CancelIcon}
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        isPending={updateAppointmentLoader}
        onConfirm={() => {
          handleStusChange()
        }}
        title="Cancel Appointemnt"
        description="Are you sure you want to cancel this appointment? This action cannot be undone."
        cancelText="No"
        confirmText="Yes"
      />
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsCOnfirmModelOpen(false)}
        isPending={updateAppointmentLoader}
        onConfirm={handleStusChange}
        title="Confirm Appointemnt"
        description="Are you sure you want to confirm this appointment?."
        cancelText="No"
        confirmText="Yes"
      />

      <ConfirmationModal
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setMenuOpen(false);
        }}
        isPending={updateAppointmentLoader}
        onConfirm={handleStusChange}
        title="Change Appointment Status"
        description={`Are you sure you want to set status to "${capitalize(
          selectedStatus || ""
        )}"?`}
        cancelText="No, keep current"
        confirmText="Yes, update status"
      />
    </div>
  );
}

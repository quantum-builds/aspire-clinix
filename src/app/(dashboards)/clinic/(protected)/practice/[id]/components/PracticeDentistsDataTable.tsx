"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { TDentistPractice } from "@/types/dentistRequest";
import { useState } from "react";
import { updateDentistPractice } from "@/services/dentistOnPractice/dentistOnPracticeQuery";
import { PracticeApprovalStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import { showToast } from "@/utils/defaultToastOptions";
import ConfirmationModal from "@/app/(dashboards)/components/ConfirmationModal";
import { getAxiosErrorMessage } from "@/utils/getAxiosErrorMessage";
import { TableActionMenu } from "@/app/(dashboards)/components/custom-components/TableActionMenu";
import { CancelIcon } from "@/assets";

interface RequestsDataTable {
  entries: TDentistPractice[];
  practiceId: string;
  status: string;
}

export function PracticeDentistDataTable({
  entries,
  practiceId,
  status,
}: RequestsDataTable) {
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [selectedDentistId, setIsSelectedDentistId] = useState("");

  const { mutate: updateStatus, isPending } = updateDentistPractice();
  const { refresh } = useRouter();

  const handleCancelRequest = () => {
    updateStatus(
      {
        practiceId,
        dentistId: selectedDentistId,
        status: PracticeApprovalStatus.CANCELLED,
      },
      {
        onSuccess: () => {
          refresh();
          setIsCancelModalOpen(false);
          showToast("success", "Dentist Request Rejected");
        },
        onError: (error) => showToast("error", getAxiosErrorMessage(error)),
      }
    );
  };

  const handleApprovalRequest = () => {
    updateStatus(
      {
        practiceId,
        dentistId: selectedDentistId,
        status: PracticeApprovalStatus.APPROVED,
      },
      {
        onSuccess: () => {
          refresh();
          setIsApproveModalOpen(false);
          showToast("success", "Dentist Request Accepted");
        },
        onError: (error) => showToast("error", getAxiosErrorMessage(error)),
      }
    );
  };

  const getMenuOptions = (dentistId: string) => {
    const options = [];

    if (status !== PracticeApprovalStatus.APPROVED) {
      options.push({
        label: "Approve",
        onClick: () => {
          setIsSelectedDentistId(dentistId);
          setIsApproveModalOpen(true);
        },
      });
    }

    if (status !== PracticeApprovalStatus.CANCELLED) {
      options.push({
        label: "Cancel",
        onClick: () => {
          setIsSelectedDentistId(dentistId);
          setIsCancelModalOpen(true);
        },
      });
    }

    return options;
  };

  return (
    <div className="w-full overflow-x-auto bg-dashboardBarBackground rounded-2xl px-4 pb-4 pt-4 tracking-tightest">
      <Table className="border-separate border-spacing-y-3 min-w-max">
        <TableHeader>
          <TableRow className="bg-dashboardBackground">
            <TableHead className="px-6 py-4 rounded-l-full text-xl text-dashboardTextBlack font-medium">
              Dentist Name
            </TableHead>
            <TableHead className="px-6 py-4 text-xl text-dashboardTextBlack font-medium">
              Dentist Email
            </TableHead>
            <TableHead className="px-6 py-4 text-xl text-dashboardTextBlack font-medium">
              Dentist Phone
            </TableHead>
            <TableHead className="px-6 py-4 text-xl text-dashboardTextBlack font-medium">
              GDC No.
            </TableHead>
            <TableHead className="px-6 py-4 rounded-r-full text-xl text-dashboardTextBlack font-medium">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {entries.map((entry) => (
            <TableRow
              key={entry.dentist.id}
              className="text-lg hover:bg-gray text-dashboardTextBlack cursor-pointer"
            >
              <TableCell className="px-6 py-4 rounded-l-full">
                {entry.dentist.fullName}
              </TableCell>
              <TableCell className="px-6 py-4">{entry.dentist.email}</TableCell>
              <TableCell className="px-6 py-4">{entry.dentist.phoneNumber}</TableCell>
              <TableCell className="px-6 py-4">{entry.dentist.gdcNo}</TableCell>

              <TableCell className="px-6 py-4 rounded-r-full">
                <TableActionMenu options={getMenuOptions(entry.dentistId)} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ConfirmationModal
        icon={CancelIcon}
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        isPending={isPending}
        onConfirm={handleCancelRequest}
        title="Cancel Dentist Request"
        description="Are you sure you want to cancel this request? This action cannot be undone."
        cancelText="No"
        confirmText="Yes"
      />

      <ConfirmationModal
        isOpen={isApproveModalOpen}
        onClose={() => setIsApproveModalOpen(false)}
        isPending={isPending}
        onConfirm={handleApprovalRequest}
        title="Approve Dentist Request"
        description="Are you sure you want to approve this request? This action cannot be undone."
        cancelText="No"
        confirmText="Yes"
      />
    </div>
  );
}
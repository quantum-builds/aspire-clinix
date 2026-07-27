"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import Image from "next/image";
import { CalenderInputIconV2, DeleteIconV2 } from "@/assets";
import { useRouter } from "next/navigation";
import { TReferralRequest } from "@/types/referral-request";
import { ReferralRequestStatus } from "@prisma/client";
import { formatDate } from "@/utils/formatDateTime";
import { useDeleteReferralRequests } from "@/services/referralRequest/referralRequestMutation";
import ConfirmationModal from "@/app/(dashboards)/components/ConfirmationModal";
import { useState } from "react";
import { getAxiosErrorMessage } from "@/utils/getAxiosErrorMessage";
import { showToast } from "@/utils/defaultToastOptions";
import { TableActionMenu } from "@/app/(dashboards)/components/custom-components/TableActionMenu";

interface ReferralHistoryDataTableProps {
  entries: TReferralRequest[];
}

const statusConfig: Record<string, { label: string; dot: string }> = {
  [ReferralRequestStatus.PENDING_REVIEW]: { label: "REVIEW PENDING", dot: "bg-blue-500" },
  [ReferralRequestStatus.ACCEPTED]: { label: "ACCEPTED", dot: "bg-emerald-400" },
  [ReferralRequestStatus.REJECTED]: { label: "REJECTED", dot: "bg-red-500" },
  [ReferralRequestStatus.UNASSIGNED]: { label: "UNASSIGNED", dot: "bg-[#fcd833]" },
  [ReferralRequestStatus.ASSIGNED]: { label: "ASSIGNED", dot: "bg-green" },
};

export function ReferralHistoryDataTable({ entries }: ReferralHistoryDataTableProps) {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const { mutate: deleteReferralRequest, isPending } = useDeleteReferralRequests();

  const handleDeleteReferralRequest = () => {
    if (!selectedRequestId) return;

    deleteReferralRequest(
      { id: selectedRequestId },
      {
        onSuccess: () => {
          router.refresh();
          setIsDeleteModalOpen(false);
          setSelectedRequestId(null);
          showToast("success", "Referral request deleted successfully");
        },
        onError: (error) => {
          const err = getAxiosErrorMessage(error);
          showToast("error", err);
        },
      }
    );
  };

  const getMenuOptions = (entry: TReferralRequest) => [
    {
      label: "View",
      onClick: () => router.push(`/dentist/referral-history/${entry.id}`),
    },
    {
      label: "Delete",
      onClick: () => {
        setSelectedRequestId(entry.id);
        setIsDeleteModalOpen(true);
      },
    },
  ];

  return (
    <div className="w-full overflow-x-auto">
      <Table className="table-auto border-separate border-spacing-y-3 min-w-max">
        <TableHeader>
          <TableRow>
            <TableHead className="px-6 py-4 bg-dashboardBarBackground rounded-l-full text-xl text-dashboardTextBlack font-medium">
               #
            </TableHead>
            <TableHead className="px-6 py-4 bg-dashboardBarBackground text-xl text-dashboardTextBlack font-medium">
              Patient Name
            </TableHead>
            <TableHead className="px-6 py-4 bg-dashboardBarBackground text-xl text-dashboardTextBlack font-medium">
              Status
            </TableHead>
            <TableHead className="px-6 py-4 bg-dashboardBarBackground text-xl text-dashboardTextBlack font-medium">
              Referral Date
            </TableHead>
            <TableHead className="px-6 py-4 bg-dashboardBarBackground rounded-r-full text-xl text-dashboardTextBlack font-medium">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {entries.map((entry, index) => (

            
            <TableRow
              key={entry.id}
              className="bg-dashboardBackground hover:bg-gray cursor-pointer text-lg text-dashboardTextBlack"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/dentist/referral-history/${entry.id}`);
              }}
            >
              <TableCell className="px-6 py-4 rounded-l-full">
                {index + 1}
              </TableCell>

              <TableCell className="px-6 py-4">
              {entry.referralForm.patientName}
              </TableCell>


              <TableCell className="px-6 py-4">
                <div className="flex gap-2 items-center">
                  {(() => {
                    const statusConf = statusConfig[entry.requestStatus] ?? {
                      label: entry.requestStatus,
                      dot: "bg-gray-400",
                    };
                    return (
                      <>
                        <div className={`size-3 rounded-[4px] ${statusConf.dot}`} />
                        {statusConf.label}
                      </>
                    );
                  })()}
                </div>
              </TableCell>

              <TableCell className="px-6 py-4 flex gap-1 items-center">
                <Image
                  src={CalenderInputIconV2}
                  alt="calendar input icon"
                  className="w-5 h-5"
                />
                {formatDate(entry.createdAt)}
              </TableCell>

              <TableCell className="px-6 py-4 rounded-r-full">
                <TableActionMenu options={getMenuOptions(entry)} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ConfirmationModal
        icon={DeleteIconV2}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        isPending={isPending}
        onConfirm={handleDeleteReferralRequest}
        title="Delete Referral Request"
        description="Are you sure you want to delete this request? This action cannot be undone."
        cancelText="No"
        confirmText="Yes"
      />
    </div>
  );
}

"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import Image from "next/image";
import { CalenderInputIconV2, DeleteIconV2 } from "@/assets";
import { useRouter } from "next/navigation";
import { TReferralRequest } from "@/types/referral-request";
import { ReferralRequestStatus } from "@prisma/client";
import { formatDate } from "@/utils/formatDateTime";
import ConfirmationModal from "@/app/(dashboards)/components/ConfirmationModal";
import { useState } from "react";
import { useDeleteReferralRequests } from "@/services/referralRequest/referralRequestMutation";
import { getAxiosErrorMessage } from "@/utils/getAxiosErrorMessage";
import { showToast } from "@/utils/defaultToastOptions";

interface ClinicReferralDataTableProps {
  entries: TReferralRequest[];
}

export function ClinicReferralDataTable({
  entries,
}: ClinicReferralDataTableProps) {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  const { mutate: deleteReferralRequest, isPending } =
    useDeleteReferralRequests();

  const handleDeleteReferralRequest = () => {
    if (!selectedRequestId) return;

    deleteReferralRequest(
      { id: selectedRequestId },
      {
        onSuccess: () => {
          router.refresh();
          setIsDeleteModalOpen(false);
          setSelectedRequestId(null);
        }, onError: (error) => {
          const err = getAxiosErrorMessage(error)
          showToast("error", err)
        }
      }
    );
  };

  return (
    <div className="w-full overflow-x-auto">
      <Table className="table-auto border-separate border-spacing-y-3 min-w-max">
        <TableHeader>
          <TableRow>
            <TableHead className="px-6 py-4 bg-dashboardBarBackground rounded-l-full text-xl text-dashboardTextBlack font-medium">
              Reference #
            </TableHead>
            <TableHead className="px-6 py-4 bg-dashboardBarBackground text-xl text-dashboardTextBlack font-medium">
              Patient Name
            </TableHead>
            <TableHead className="px-6 py-4 bg-dashboardBarBackground text-xl text-dashboardTextBlack font-medium">
              Dentist Name
            </TableHead>
            <TableHead className="px-6 py-4 bg-dashboardBarBackground text-xl text-dashboardTextBlack font-medium">
              Referral Dentist Name
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
          {entries.map((entry) => (
            <TableRow
              key={entry.id}
              className="bg-dashboardBackground hover:bg-gray cursor-pointer text-lg text-dashboardTextBlack"
              onClick={(e) => {
                e.stopPropagation();
                router.push(
                  `/clinic/referrals/${entry.id}/${entry.requestStatus === ReferralRequestStatus.ASSIGNED
                    ? ReferralRequestStatus.ASSIGNED.toLowerCase()
                    : ReferralRequestStatus.UNASSIGNED.toLowerCase()
                  }`
                )
              }}
            >
              <TableCell className="px-6 py-4 rounded-l-full">
                {entry.id.slice(0, 8)}
              </TableCell>
              <TableCell className="px-6 py-4">
                {entry.referralForm.patientName}
              </TableCell>
              <TableCell className="px-6 py-4">
                {entry.assignedDentist
                  ? entry.assignedDentist.fullName
                  : "-----"}
              </TableCell>
              <TableCell className="px-6 py-4">
                {entry.referralForm.referralName}
              </TableCell>
              <TableCell className="px-6 py-4">
                <div className="flex gap-2 items-center">
                  <div
                    className={`size-3 rounded-[4px] ${entry.requestStatus === ReferralRequestStatus.ASSIGNED
                      ? "bg-green"
                      : "bg-[#fcd833]"
                      }`}
                  />
                  {entry.requestStatus}
                </div>
              </TableCell>
              <TableCell className="px-6 py-4 flex gap-1 items-center">
                <Image
                  src={CalenderInputIconV2}
                  alt="calender input icon"
                  className="w-5 h-5"
                />
                {formatDate(entry.createdAt)}
              </TableCell>
              <TableCell className="px-6 py-4 rounded-r-full">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(
                          `/clinic/referrals/${entry.id}/${entry.requestStatus === ReferralRequestStatus.ASSIGNED
                            ? ReferralRequestStatus.ASSIGNED.toLowerCase()
                            : ReferralRequestStatus.UNASSIGNED.toLowerCase()
                          }`
                        )
                      }
                      }
                    >
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRequestId(entry.id);
                        setIsDeleteModalOpen(true);
                      }}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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

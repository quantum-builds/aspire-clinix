"use client";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { TableActionMenu } from "@/app/(dashboards)/components/custom-components/TableActionMenu";
import NoContent1 from "@/app/(dashboards)/components/NoContent1";
import { useGetTreatments } from "@/services/treatments/treatmentQuery";
import { TreatmentDataTableSkeleton } from "./skeletons/TreatmentDataTable";

export default function TreatmentDataTable() {
  const { push } = useRouter();
  const { data: treatments, isLoading, isError } = useGetTreatments();

  const getMenuOptions = (treatmentId: string) => {
    return [
      {
        label: "Update",
        onClick: () => push(`/clinic/treatments/${treatmentId}/edit`),
      },
    ];
  };

  if (isLoading) {
    return <TreatmentDataTableSkeleton />;
  }

  if (isError || !treatments || treatments.length === 0) {
    return <NoContent1 text="No treatment created yet!!!" />;
  }

  return (
    <div className="w-full overflow-x-auto  rounded-2xl px-4 pb-4 pt-4 tracking-tightest">
      <Table className="border-separate  border-spacing-y-3 min-w-max">
        <TableHeader>
          <TableRow className="bg-dashboardBarBackground">
            <TableHead className="px-6 py-4 rounded-l-full text-xl text-dashboardTextBlack font-medium">
              Name
            </TableHead>
            <TableHead className="px-6 py-4 text-xl text-dashboardTextBlack font-medium">
              Description
            </TableHead>
            <TableHead className="px-6 py-4 text-xl text-dashboardTextBlack font-medium">
              Price
            </TableHead>
            <TableHead className="px-6 py-4 text-xl text-dashboardTextBlack font-medium">
              Slots
            </TableHead>
            <TableHead className="px-6 py-4 text-xl text-dashboardTextBlack font-medium">
              Status
            </TableHead>
            <TableHead className="px-6 py-4 rounded-r-full text-xl text-dashboardTextBlack font-medium">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {treatments.map((entry) => (
            <TableRow
              key={entry.id}
              className="text-lg hover:bg-gray text-dashboardTextBlack"
            >
              <TableCell className="px-6 py-4 rounded-l-full">
                {entry.name}
              </TableCell>
              <TableCell className="px-6 py-4 max-w-[320px] truncate">
                {entry.description || "-"}
              </TableCell>
              <TableCell className="px-6 py-4">£{entry.price}</TableCell>
              <TableCell className="px-6 py-4">
                {entry.availabilities?.length ?? 0}
              </TableCell>
              <TableCell className="px-6 py-4">
                {entry.isActive ? (
                  <div className="flex gap-2 items-center">
                    <p className="size-3 rounded-sm bg-green" />
                    <p>Active</p>
                  </div>
                ) : (
                  <div className="flex gap-2 items-center">
                    <p className="size-3 rounded-sm bg-red-600" />
                    <p>Inactive</p>
                  </div>
                )}
              </TableCell>
              <TableCell className="px-6 py-4 rounded-r-full">
                <TableActionMenu options={getMenuOptions(entry.id)} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

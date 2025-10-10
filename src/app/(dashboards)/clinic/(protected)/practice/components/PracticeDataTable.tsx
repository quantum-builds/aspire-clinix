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
import { TPractice } from "@/types/practice";
import { TableActionMenu } from "@/app/(dashboards)/components/custom-components/TableActionMenu";

interface RequestsDataTable {
  entries: TPractice[];
}

export function PracticeDataTable({ entries }: RequestsDataTable) {
  const { push } = useRouter();

  const getMenuOptions = (practiceId: string) => {
    return [
      {
        label: "View",
        onClick: () => push(`/clinic/practice/${practiceId}`),
      },
    ];
  };

  return (
    <div className="w-full overflow-x-auto bg-dashboardBarBackground rounded-2xl px-4 pb-4 pt-4 tracking-tightest">
      <Table className="border-separate border-spacing-y-3 min-w-max">
        <TableHeader>
          <TableRow className="bg-dashboardBackground">
            <TableHead className="px-6 py-4 rounded-l-full text-xl text-dashboardTextBlack font-medium">
              Practice ID
            </TableHead>
            <TableHead className="px-6 py-4 text-xl text-dashboardTextBlack font-medium">
              Name
            </TableHead>
            <TableHead className="px-6 py-4 text-xl text-dashboardTextBlack font-medium">
              Email
            </TableHead>
            <TableHead className="px-6 py-4 text-xl text-dashboardTextBlack font-medium">
              Phone
            </TableHead>
            <TableHead className="px-6 py-4 text-xl text-dashboardTextBlack font-medium">
              NHS
            </TableHead>
            <TableHead className="px-6 py-4 rounded-r-full text-xl text-dashboardTextBlack font-medium">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry, index) => (
            <TableRow
              onClick={() => push(`/clinic/practice/${entry.id}`)}
              key={entry.id}
              className="text-lg hover:bg-gray text-dashboardTextBlack !cursor-pointer"
            >
              <TableCell className="px-6 py-4 rounded-l-full">
                PR # 100{index}
              </TableCell>
              <TableCell className="px-6 py-4">{entry.name}</TableCell>
              <TableCell className="px-6 py-4">{entry.email}</TableCell>
              <TableCell className="px-6 py-4">{entry.phoneNumber}</TableCell>
              <TableCell className="px-6 py-4 flex gap-1 items-center">
                {entry.nhs ? (
                  <div className="flex gap-2 items-center">
                    <p className="size-3 rounded-sm bg-green" />
                    <p>True</p>
                  </div>
                ) : (
                  <div className="flex gap-2 items-center">
                    <p className="size-3 rounded-sm bg-red-600" />
                    <p>False</p>
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
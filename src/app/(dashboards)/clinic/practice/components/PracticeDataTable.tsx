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
import { useRouter } from "next/navigation";
import { TPractice } from "@/types/practice";

interface RequestsDataTable {
  entries: TPractice[];
}

export function PracticeDataTable({ entries }: RequestsDataTable) {
  const { push } = useRouter();

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
            <TableHead className="px-6 py-4  text-xl text-dashboardTextBlack font-medium">
              Email
            </TableHead>
            <TableHead className="px-6 py-4  text-xl text-dashboardTextBlack font-medium">
              Phone
            </TableHead>
            <TableHead className="px-6 py-4  text-xl text-dashboardTextBlack font-medium">
              NHS
            </TableHead>
            <TableHead className="px-6 py-4  rounded-r-full text-xl text-dashboardTextBlack font-medium">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {entries.map((entry, index) => (
            <TableRow
              onClick={() => push(`/clinic/practice/${entry.id}`)}
              key={entry.id}
              className="text-lg hover:bg-gray text-dashboardTextBlack"
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => push(`/clinic/practice/${entry.id}`)}
                    >
                      View
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

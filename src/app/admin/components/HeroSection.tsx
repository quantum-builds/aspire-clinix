import { AspireDarkLogo, NotificationBell } from "@/assets";
import HeroMenu from "@/components/HeroMenu";
import { UserRoles } from "@/constants/UserRoles";
import Image from "next/image";
import Link from "next/link";
import DropDown from "./DropDown";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../../../components/ui/chart";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const chartData = [
  { month: "January", dentist: 200, patient: 80 },
  { month: "February", dentist: 305, patient: 200 },
  { month: "March", dentist: 237, patient: 120 },
  { month: "April", dentist: 73, patient: 190 },
  { month: "May", dentist: 209, patient: 130 },
  { month: "June", dentist: 214, patient: 140 },
];

const recentAppointments = [
  {
    patient: "John Doe",
    date: "Jan 20, 2025",
    time: "10:00 AM",
    doctor: "Dr. Smith",
    status: "Confirmed",
  },
  {
    patient: "Jane Smith",
    date: "Jan 20, 2025",
    time: "11:30 AM",
    doctor: "Dr. Brown",
    status: "Completed",
  },
  {
    patient: "Emily Johnson",
    date: "Jan 21, 2025",
    time: "9:00 AM",
    doctor: "Dr. Lee",
    status: "Pending",
  },
  {
    patient: "Emily Johnson",
    date: "Jan 21, 2025",
    time: "9:00 AM",
    doctor: "Dr. Lee",
    status: "Pending",
  },
  {
    patient: "Michael Davis",
    date: "Jan 22, 2025",
    time: "1:00 PM",
    doctor: "Dr. Wilson",
    status: "Confirmed",
  },
  {
    patient: "Sarah Miller",
    date: "Jan 22, 2025",
    time: "3:00 PM",
    doctor: "Dr. Taylor",
    status: "Cancelled",
  },
  {
    patient: "David Anderson",
    date: "Jan 23, 2025",
    time: "10:30 AM",
    doctor: "Dr. Carter",
    status: "Completed",
  },
];

const headers = [
  { label: "Patient", align: "left" },
  { label: "Date", align: "left" },
  { label: "Time", align: "left" },
  { label: "Doctor", align: "left" },
  { label: "Status", align: "right" },
];

const chartConfig = {
  dentist: {
    label: "Dentist",
    color: "#1D120C",
  },
  patient: {
    label: "Patient",
    color: "#423C36",
  },
} satisfies ChartConfig;

export default function HeroSection() {
  const renderHeader = () => (
    <header className="flex justify-between items-center absolute w-full top-0 h-20 md:h-32 px-5 lg:px-12 z-20">
      <div className="flex-1">
        <HeroMenu role={UserRoles.ADMIN} />
      </div>
      <Link href="/" scroll={false}>
        <Image
          src={AspireDarkLogo}
          alt="Aspire Clinix"
          width={80}
          height={88}
          className="zoom-out flex items-center justify-center w-[80px] h-[40px] md:w-[189px] md:h-[88px]"
        />
      </Link>
      <div className="zoom-out flex-1 flex gap-10 justify-end">
        <DropDown />
      </div>
    </header>
  );

  return (
    <div className="flex flex-col relative overflow-hidden bg-feeguidedark">
      {renderHeader()}

      {/* Main Content */}
      <div className="flex flex-col justify-start gap-5 md:gap-12 mt-20 md:mt-32 px-6 md:px-12 z-10">
        {/* Welcome Section */}
        <div className="text-5xl font-extrabold font-opus">
          <p>Welcome, Massab!</p>
        </div>

        {/* Cards Section */}
        <div className="flex gap-6">
          <Card className="bg-[#8A5E45]">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">
                Total Booked Treatments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl">3459 Treatments </p>
            </CardContent>
            <CardFooter>
              <p>70 treatments last month</p>
            </CardFooter>
          </Card>
          <Card className="bg-[#8A5E45]">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">
                Total Booked Appointment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl">3459 Appointments </p>
            </CardContent>
            <CardFooter>
              <p>70 appointments last month</p>
            </CardFooter>
          </Card>
        </div>

        {/* Graph + List Section */}
        <div className="flex flex-col xl:flex-row justify-between gap-4">
          {/* Chart Section */}
          <div className="rounded-md border border-[#423C36] flex-1 p-4">
            <ChartContainer config={chartConfig} className=" z-10">
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid
                  vertical={false}
                  stroke="#423C36" // Change the grid line color here
                  strokeDasharray="3 3"
                />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis
                  tickLine={false} // Optionally hide the ticks
                  axisLine={false} // Optionally hide the axis line
                  tickFormatter={(value) => `${value}`} // Format the Y-axis labels
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="dentist" fill="var(--color-dentist)" radius={4} />
                <Bar dataKey="patient" fill="var(--color-patient)" radius={4} />
              </BarChart>
            </ChartContainer>
          </div>

          <div className="rounded-md border border-[#1D120C] flex-1 p-4">
            <p className="text-lg font-bold mb-4">Recent Appointments</p>
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  {headers.map((header, index) => (
                    <TableHead
                      key={index}
                      className={`${
                        header.align === "right" ? "text-right" : ""
                      } text-lg text-[#1D120C]`}
                    >
                      {header.label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentAppointments.map((appointment, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {appointment.patient}
                    </TableCell>
                    <TableCell>{appointment.date}</TableCell>
                    <TableCell>{appointment.time}</TableCell>
                    <TableCell>{appointment.doctor}</TableCell>
                    <TableCell className="text-right">
                      {appointment.status}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}

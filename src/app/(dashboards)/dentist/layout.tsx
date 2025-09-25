import {
  AppointmentsIcon,
  ConsentIcon,
  InActiveIcon,
  LoyaltyPointsIcon,
  ReferralRequestIcon,
} from "@/assets";
import { SidebarPage } from "@/types/common";
import Sidebar from "../components/SideBar";
import TopBar from "../components/TopBar";

const SIDEBAR_CONTENT: SidebarPage[] = [
  {
    name: "Appointments",
    icon: AppointmentsIcon,
    href: "/dentist/appointments",
    pages: [
      {
        name: "Upcoming",
        icon: InActiveIcon,
        href: "/dentist/appointments/upcoming",
      },
      { name: "Past", icon: InActiveIcon, href: "/dentist/appointments/past" },
    ],
  },
  {
    name: "Referral Request",
    icon: ReferralRequestIcon,
    href: "/dentist/referral-request",
  },
  {
    name: "Referral History",
    icon: ConsentIcon,
    href: "/dentist/referral-history",
  },
  {
    name: "Loyalty Points",
    icon: LoyaltyPointsIcon,
    href: "/dentist/loyalty-points",
  },
];

export default function PatientLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="font-inter text-dashboardTextBlack bg-dashboardBackground h-screen grid grid-cols-[320px_1fr] grid-rows-[90px_1fr] overflow-hidden">
      <div className="row-span-2 border-r">
        <Sidebar sideBarContnent={SIDEBAR_CONTENT} />
      </div>

      <div className="col-start-2 border-b">
        <TopBar role="Dentist" profileLink="/dentist/profile" />
      </div>

      {/* make only main scrollable */}
      <main className="p-6 mb-6 col-start-2 overflow-y-auto">{children}</main>
    </div>
  );
}

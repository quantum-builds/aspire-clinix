import { SidebarPage } from "@/types/common";

import {
  AppointmentsIcon,
  ConsentIcon,
  InActiveIcon,
  PlansIcon,
  ResourcesIcon,
  StoreIcon,
} from "@/assets";
import Sidebar from "../components/SideBar";
import TopBar from "../components/TopBar";

const SIDEBAR_CONTENT: SidebarPage[] = [
  {
    name: "Appointments",
    icon: AppointmentsIcon,
    href: "/clinic/appointments",
    pages: [
      {
        name: "Upcoming",
        icon: InActiveIcon,
        href: "/clinic/appointments/upcoming",
      },
      { name: "Past", icon: InActiveIcon, href: "/clinic/appointments/past" },
      {
        name: "Requests",
        icon: InActiveIcon,
        href: "/clinic/appointments/requests",
      },
    ],
  },
  {
    name: "Referral",
    icon: ConsentIcon,
    href: "/clinic/referrals",
  },
  {
    name: "Resources",
    icon: ResourcesIcon,
    href: "/clinic/resources",
  },
  {
    name: "Plans & Packages",
    icon: PlansIcon,
    pages: [
      {
        name: "Plans",
        icon: InActiveIcon,
        href: "/clinic/plans",
      },
      {
        name: "Subscriptions",
        icon: InActiveIcon,
        href: "/clinic/subscriptions",
      },
    ],
  },
  {
    name: "Store",
    icon: StoreIcon,
    href: "/clinic/store",
  },
];

export default function ClinicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="font-inter text-dashboardTextBlack bg-dashboardBackground h-screen grid grid-cols-[320px_1fr] grid-rows-[90px_1fr] overflow-hidden">
      <div className="row-span-2 border-r">
        <Sidebar sideBarContnent={SIDEBAR_CONTENT} />
      </div>

      <div className="col-start-2 border-b">
        <TopBar name="Massab" role="Clinic" profileLink="/clinic/profile" />
      </div>

      <main className="p-6 col-start-2 overflow-y-auto mb-6">{children}</main>
    </div>
  );
}

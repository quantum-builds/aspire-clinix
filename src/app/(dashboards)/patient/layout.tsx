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
    href: "/patient/appointments",
    pages: [
      {
        name: "Upcoming",
        icon: InActiveIcon,
        href: "/patient/appointments/upcoming",
      },
      { name: "Past", icon: InActiveIcon, href: "/patient/appointments/past" },
      {
        name: "Requests",
        icon: InActiveIcon,
        href: "/patient/appointments/requests",
      },
    ],
  },
  {
    name: "Resources",
    icon: ResourcesIcon,
    pages: [
      { name: "Videos", icon: InActiveIcon, href: "/patient/resources/videos" },
      {
        name: "Letters",
        icon: InActiveIcon,
        href: "/patient/resources/letters",
      },
    ],
  },
  {
    name: "Plans & Subscriptions",
    icon: PlansIcon,
    pages: [
      {
        name: "Plans",
        icon: InActiveIcon,
        href: "/patient/plans",
      },
      {
        name: "Subscriptions",
        icon: InActiveIcon,
        href: "/patient/subscriptions",
      },
    ],
  },
  {
    name: "Consent",
    icon: ConsentIcon,
    href: "/patient/consent",
  },
  {
    name: "Store",
    icon: StoreIcon,
    href: "/patient/store",
  },
];

export default function PatientLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className={`font-inter text-dashboardTextBlack bg-dashboardBackground h-screen grid grid-cols-[320px_1fr] grid-rows-[90px_1fr] overflow-hidden `}
    >
      <div className="row-span-2 border-r">
        <Sidebar sideBarContnent={SIDEBAR_CONTENT} />
      </div>

      <div className="col-start-2 border-b">
        <TopBar role="Patient" profileLink="/patient/profile" />
      </div>

      {/* make only main scrollable */}
      <main className="xl:p-5 p-4 col-start-2 overflow-y-auto mb-2">
        {children}
      </main>
    </div>
  );
}

import { SidebarPage } from "@/types/common";

import {
  AppointmentsIcon,
  ConsentIcon,
  InActiveIcon,
  PlansIcon,
  PracticeIcon,
  ResourcesIcon,
  StoreIcon,
} from "@/assets";
import Sidebar from "../../components/SideBar";
import { toTitleCase } from "@/utils/formatWords";
import { getAdmin } from "@/services/admin/adminQuery";
import TopBarWrapper from "../../components/TopBarWrapper";

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
    pages: [
      {
        name: "Videos",
        icon: InActiveIcon,
        href: "/clinic/resources/videos",
      },
      {
        name: "Letters",
        icon: InActiveIcon,
        href: "/clinic/resources/letters",
        
      },
    ],
  },
];

export default async function ClinicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const response = await getAdmin();
  const admin = response?.data ?? null;
  const role = "admin";
  const name = admin?.fullName ?? "";
  const profilePic = admin?.file ?? null;

  return (
    <div className="font-inter text-dashboardTextBlack bg-dashboardBackground h-full grid grid-cols-[320px_1fr] grid-rows-[90px_1fr] overflow-hidden">
      <div className="row-span-2 border-r">
        <Sidebar sideBarContnent={SIDEBAR_CONTENT} />
      </div>

      <div className="col-start-2 border-b">
        <TopBarWrapper
          name={name || ""}
          role={toTitleCase(role || "")}
          profileLink="/clinic/profile"
          profilePic={profilePic}
        />
      </div>

      <main className="p-6 col-start-2 overflow-y-auto mb-6">{children}</main>
    </div>
  );
}

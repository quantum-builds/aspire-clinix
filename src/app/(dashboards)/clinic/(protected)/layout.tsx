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
import { getServerSession } from "next-auth";
import { toTitleCase } from "@/utils/formatWords";
import { authOptions } from "@/lib/auth";
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
    pages: [
      {
        name: "Videos",
        icon: InActiveIcon,
        href: "/clinic/resources/videos",
      },
      { name: "Letters", icon: InActiveIcon, href: "/clinic/resources/letters" },
    ],
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
  {
    name: "Practice",
    icon: PracticeIcon,
    href: "/clinic/practice",
  },
];

export default async function ClinicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession(authOptions);

  const role = session?.user.role;
  const name = session?.user.name;
  const profilePic = session?.user.image;

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

import {
  AppointmentsIcon,
  ConsentIcon,
  InActiveIcon,
  LoyaltyPointsIcon,
  ReferralRequestIcon,
} from "@/assets";
import { SidebarPage } from "@/types/common";
import Sidebar from "../../components/SideBar";
import TopBar from "../../components/TopBar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { toTitleCase } from "@/utils/formatWords";

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
      {
        name: "Requests",
        icon: InActiveIcon,
        href: "/dentist/appointments/requests",
      },
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

const RECIEVING_SIDEBAR_CONTENT: SidebarPage[] = [
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
];

const REFERRING_SIDEBAR_CONTENT: SidebarPage[] = [
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

export default async function DentistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const cookieStore = cookies();
  // const tokenCookie = cookieStore.get("next-auth.session-token")?.value;
  // console.log("token cookie", tokenCookie);
  // let token: any = null;

  // if (tokenCookie) {
  //   try {
  //     const { payload } = await jwtDecrypt(
  //       tokenCookie,
  //       new TextEncoder().encode(process.env.NEXTAUTH_SECRET!)
  //     );
  //     token = payload;
  //   } catch (err) {
  //     console.log("Invalid token", err);
  //   }
  // }

  // console.log("dentist token is ", token);

  const session = await getServerSession(authOptions);

  console.log("Session is ", session);
  const role = session?.user.role;
  const name = session?.user.name;

  // Pick sidebar based on role
  let sidebarContent = SIDEBAR_CONTENT;
  if (role === "RECIEVING_DENTIST") {
    sidebarContent = RECIEVING_SIDEBAR_CONTENT;
  } else if (role === "REFERRING_DENTIST") {
    sidebarContent = REFERRING_SIDEBAR_CONTENT;
  }

  return (
    <div className="font-inter text-dashboardTextBlack bg-dashboardBackground h-screen grid grid-cols-[320px_1fr] grid-rows-[90px_1fr] overflow-hidden">
      {/* Sidebar */}
      <div className="row-span-2 border-r">
        <Sidebar sideBarContnent={sidebarContent} />
      </div>

      {/* Topbar */}
      <div className="col-start-2 border-b">
        <TopBar
          name={name || "Dentist"}
          role={toTitleCase(role || "DENTIST")}
          profileLink="/dentist/profile"
        />
      </div>

      {/* Main Content (scrollable) */}
      <main className="p-6 mb-6 col-start-2 overflow-y-auto">{children}</main>
    </div>
  );
}

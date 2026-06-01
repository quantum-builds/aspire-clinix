import { SidebarPage } from "@/types/common";

import {
  AppointmentsIcon,
  ConsentIcon,
  InActiveIcon,
  PlansIcon,
  ResourcesIcon,
  StoreIcon,
} from "@/assets";
import Sidebar from "../../components/SideBar";
import TopBar from "../../components/TopBar";
import { getServerSession } from "next-auth";
import { toTitleCase } from "@/utils/formatWords";
import { authOptions } from "@/lib/auth";
import TopBarWrapper from "../../components/TopBarWrapper";
import prisma from "@/lib/db";
import { getAMedia } from "@/services/s3/s3Query";

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
    name: "Consent",
    icon: ConsentIcon,
    href: "/patient/consent",
  },
];

export default async function PatientLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession(authOptions);
  const role = "patient";
  const name = session?.user.name;
  const patientDentallyId = Number(session?.user.id ?? "");

  const patient = Number.isFinite(patientDentallyId)
    ? await prisma.patient.findUnique({
        where: { dentallyId: patientDentallyId },
      })
    : null;

  const profilePic = patient?.imageUrl
    ? (await getAMedia(patient.imageUrl))?.files?.[0] ?? null
    : null;
  const familyId = patient?.familyId ?? "";

  return (
    <div
      className={`font-inter text-dashboardTextBlack bg-dashboardBackground min-h-full grid grid-cols-[320px_1fr] grid-rows-[90px_1fr] overflow-hidden `}
    >
      <div className="row-span-2 border-r">
        <Sidebar sideBarContnent={SIDEBAR_CONTENT} />
      </div>

      <div className="col-start-2 border-b">
        <TopBarWrapper
          name={name || ""}
          role={toTitleCase(role || "")}
          profileLink="/patient/profile"
          profilePic={profilePic}
          familyId={familyId}
        />
      </div>

      {/* make only main scrollable */}
      <main className="xl:p-5 p-4 col-start-2 overflow-y-auto mb-2">
        {children}
      </main>
    </div>
  );
}

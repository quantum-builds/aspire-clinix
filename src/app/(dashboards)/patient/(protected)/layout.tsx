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
import { toTitleCase } from "@/utils/formatWords";
import TopBarWrapper from "../../components/TopBarWrapper";
import { getPatient } from "@/services/patient/patientQuery";

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
  const response = await getPatient();
  const patient = response?.data ?? null;
  const role = "patient";
  // const name = patient?.fullName ?? "";
  const profilePic = patient?.file ?? null;

  // Derive name from fresh patient data, not the stale session token
  const name = patient
    ? [patient.firstName, patient.lastName].filter(Boolean).join(" ").trim()
    : "";

  const familyId = patient?.familyId ?? "";
  const currentPatientId = patient?.id ? Number(patient.id) : undefined;

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
          currentPatientId={currentPatientId}
        />
      </div>

      {/* make only main scrollable */}
      <main className="xl:p-5 p-4 col-start-2 overflow-y-auto mb-2">
        {children}
      </main>
    </div>
  );
}

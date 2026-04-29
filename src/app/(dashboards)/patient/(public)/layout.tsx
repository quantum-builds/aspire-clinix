import Patient from "@/app/patient-1/page";
import TopBarWrapper from "../../components/TopBarWrapper";

export default async function PatientLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // <div
    //   className={`font-inter text-dashboardTextBlack bg-dashboardBackground min-h-screen px-20  py-9  `}
    // >
    //   <div className="col-start-2 border-b">
    //     <TopBarWrapper
    //       name={"Asif"}
    //       role={"PATIENT"}
    //       profileLink="/patient/profile"
    //       profilePic={""}
    //     />
    //   </div>
    //   {children}
    // </div>

    <div
      className={`font-inter text-dashboardTextBlack bg-dashboardBackground min-h-full grid grid-cols-[320px_1fr] grid-rows-[90px_1fr] overflow-hidden `}
    >
      <div className="col-start-2 border-b">
        <TopBarWrapper
          name={"Asif"}
          role={"PATIENT"}
          profileLink="/patient/profile"
          profilePic={""}
        />
      </div>

      {/* make only main scrollable */}
      <main className="xl:p-5 p-4 col-start-2 overflow-y-auto mb-2">
        {children}
      </main>
    </div>
  );
}

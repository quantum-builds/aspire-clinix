import Footer from "@/components/Footer";
import PatientSideBar from "@/app/patient/components/PatientSideBar";
import Link from "next/link";
import Image from "next/image";
import BackNavigation from "./components/BackNavigation";

export default function PatientLandingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <div className="flex min-h-screen bg-feeguidedark">
        <PatientSideBar />
        <BackNavigation />
        {children}
      </div>
      <Footer />
    </>
  );
}

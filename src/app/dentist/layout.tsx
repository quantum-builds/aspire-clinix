import Footer from "@/components/Footer";
import DentistSideBar from "@/app/dentist/components/DentistSideBar";
import DentistHeader from "./components/DentistHeader";

export default function DentistLandingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <div className="flex min-h-screen">
        <DentistSideBar />
        <div className="min-h-screen bg-feeguidedark p-16 w-full flex flex-col gap-12">
          <DentistHeader />
          {children}
        </div>
      </div>
      <Footer />
    </>
  );
}

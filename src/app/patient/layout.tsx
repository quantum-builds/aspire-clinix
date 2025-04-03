import Footer from "@/components/Footer";
import PatientSideBar from "@/app/patient/components/PatientSideBar";

export default function PatientLandingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <div className="flex min-h-screen">
        <PatientSideBar />
        {children}
      </div>
      <Footer />
    </>
  );
}

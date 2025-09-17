import Footer from "@/components/Footer";
import SideBar from "./components/SideBar";

export default function LandingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <div className="flex min-h-screen">
        <SideBar />
        {children}
      </div>
      <Footer />
    </>
  );
}

import Footer from "@/components/Footer";

export default function LandingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="">
      {children}
      <Footer />
    </div>
  );
}

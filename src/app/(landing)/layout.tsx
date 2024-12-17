import Footer from "@/components/Footer";

export default function LandingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const inputBackgroundColor = "#1D120C";
  return (
    <div className="">
      {children}
      <Footer inputBackgroundColor={inputBackgroundColor} />
    </div>
  );
}

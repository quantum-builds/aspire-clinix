import Footer from "@/components/Footer";

export default function LandingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const backgroundColor = " #1D120C";
  const inputBackgroundColor = "#1D120C";
  return (
    <div className="w-full h-full flex flex-col">
      {children}
      <Footer
        backgroundColor={backgroundColor}
        inputBackgroundColor={inputBackgroundColor}
      />
    </div>
  );
}

import BackButton from "@/app/(dashboards)/components/BackButton";

export default async function PatientLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="relative min-h-[117.7vh] bg-[#0B0A08]">
      <div className="pointer-events-none absolute inset-x-0 top-20 z-10 left-80">
        <div className="pointer-events-auto">
          <BackButton />
        </div>
      </div>
      {children}
    </div>
  );
}

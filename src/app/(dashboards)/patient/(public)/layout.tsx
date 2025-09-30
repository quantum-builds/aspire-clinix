export default async function PatientLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className={`font-inter text-dashboardTextBlack bg-dashboardBackground min-h-full p-10`}
    >
      {children}
    </div>
  );
}

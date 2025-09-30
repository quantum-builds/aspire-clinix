export default async function PatientLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className={`font-inter text-dashboardTextBlack bg-dashboardBackground h-full p-10  overflow-hidden `}
    >
      {children}
    </div>
  );
}

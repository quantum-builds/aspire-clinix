export default async function PatientLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className={`font-inter text-dashboardTextBlack bg-dashboardBackground min-h-screen px-20  py-9  `}
    >
      {children}
    </div>
  );
}

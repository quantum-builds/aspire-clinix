export default async function DentistLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className={`font-inter text-dashboardTextBlack bg-dashboardBackground min-h-screen p-10  `}
    >
      {children}
    </div>
  );
}

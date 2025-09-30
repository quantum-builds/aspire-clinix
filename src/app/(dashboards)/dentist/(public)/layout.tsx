export default async function DentistLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className={`font-inter text-dashboardTextBlack bg-dashboardBackground h-full p-10  `}
    >
      {children}
    </div>
  );
}

import Link from "next/link";

export default function DentistHeader() {
  return (
    <header className="flex justify-between">
      <h2 className="text-3xl font-opus">Referral Dashboard</h2>
      <div className="flex flex-col lg:flex-row gap-3 items-center">
        <Link href="/dentist">
          <div className="h-28 w-28 rounded-full bg-gray-300" />
        </Link>
        <Link href="/dentist">
          <div className="w-16 md:w-32 font-gillSans text-lg">
            Dr. Raheel Malik <span className="italic">Periodontist</span>
          </div>
        </Link>
      </div>
    </header>
  );
}

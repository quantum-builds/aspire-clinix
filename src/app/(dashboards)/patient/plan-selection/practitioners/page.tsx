import PractitionersPage from "./component/practitioners";

export default async function Page(props: {
  searchParams?: Promise<{
    treatmentId?: string;
    duration?: string;
  }>;
}) {
  const searchParams = await props.searchParams;

  return (
    <div className="relative h-full">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-[#0B0A08]"
      />
      <PractitionersPage
        treatmentId={searchParams?.treatmentId}
        duration={searchParams?.duration}
      />
    </div>
  );
}
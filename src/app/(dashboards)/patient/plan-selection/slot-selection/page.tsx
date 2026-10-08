import SlotSelectionShell from "./component/slot-selection";

export default async function Page(props: {
  searchParams?: Promise<{
    practitionerId?: string;
    treatmentId?: string;
    duration?: string;
  }>;
}) {
  const searchParams = await props.searchParams;

  return (
    <div className="min-h-screen bg-[#0B0A08]">
      <SlotSelectionShell
        practitionerId={searchParams?.practitionerId}
        treatmentId={searchParams?.treatmentId}
        duration={searchParams?.duration}
      />
    </div>
  );
}

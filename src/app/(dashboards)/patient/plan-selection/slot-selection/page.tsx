import SlotSelectionShell from "./component/slot-selection";
import WellnessTopActions from "@/app/(dashboards)/patient/plan-selection/components/WellnessTopActions";

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
      <WellnessTopActions />
      <SlotSelectionShell
        practitionerId={searchParams?.practitionerId}
        treatmentId={searchParams?.treatmentId}
        duration={searchParams?.duration}
      />
    </div>
  );
}

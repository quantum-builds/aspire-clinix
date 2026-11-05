import SlotSelectionShell from "./component/slot-selection";
import WellnessTopActions from "@/app/(dashboards)/patient/plan-selection/components/WellnessTopActions";

export default async function Page(props: {
  searchParams?: Promise<{
    treatmentId?: string;
  }>;
}) {
  const searchParams = await props.searchParams;

  return (
    <div className="min-h-screen ">
      <WellnessTopActions />
      <SlotSelectionShell treatmentId={searchParams?.treatmentId} />
    </div>
  );
}

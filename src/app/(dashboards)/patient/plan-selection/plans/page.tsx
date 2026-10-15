import PlansPage from "./component/plans";
import WellnessTopActions from "@/app/(dashboards)/patient/plan-selection/components/WellnessTopActions";

export default function Page() {
  return (
    <div className="relative h-full">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 "
      />
      <WellnessTopActions />
      <PlansPage />
    </div>
  );
}
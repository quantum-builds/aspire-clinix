import WellnessTreatments from "./component/wellness-treatments";
import WellnessTopActions from "@/app/(dashboards)/patient/plan-selection/components/WellnessTopActions";

export default function Page() {
  return (
    <div className="relative min-h-screen ">
      <WellnessTopActions />
      <WellnessTreatments />
    </div>
  );
}

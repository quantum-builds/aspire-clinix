import TreatmentSlots from "./component/TreatmentSlots";
import WellnessTopActions from "@/app/(dashboards)/patient/plan-selection/components/WellnessTopActions";

export default function Page() {
  return (
    <div className="min-h-screen ">
      <WellnessTopActions />
      <TreatmentSlots />
    </div>
  );
}

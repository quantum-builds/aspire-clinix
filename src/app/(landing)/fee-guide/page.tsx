import HeroSection from "@/components/HeroSection";
import CheckupAndRoutine from "./components/CheckupAndRoutine";
import ConsultationCosts from "./components/ConsultationCosts";
import DentalImplants from "./components/DentalImplants";
import DentureAndBridges from "./components/DenturesAndBridges";
import FillingsAndExtractions from "./components/FillingsAndExtractions";
import InvisalignAndRetainer from "./components/InvisalignAndRetainer";

export default function FeeGuidePage() {
  const heroBackgroundColor = "#1D120C";
  const herobuttonColor = "#ECE8E3";

  return (
    <div className="flex flex-col w-full h-full">
      <HeroSection
        title="Dental Treatment Fee Guide"
        titleTextSize={48}
        titleLineHeight={60}
        descTextSize={18}
        descLineHeight={28}
        description="Explore our fee structure and treatment options."
        backgroundColor={heroBackgroundColor}
        buttonColor={herobuttonColor}
        textColor="white"
      />
      <CheckupAndRoutine />

      <InvisalignAndRetainer />

      <DentalImplants />

      <FillingsAndExtractions />

      <DentureAndBridges />
      <ConsultationCosts />
    </div>
  );
}

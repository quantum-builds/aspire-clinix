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
        description="Lorem ipsum odor amet, consectetuer adipiscing elit. 
    Sociosqu a nec magna habitant nec. Ullamcorper dui varius volutpat primis lacinia elit morbi velit"
        backgroundColor={heroBackgroundColor}
        descLineHeight={40.86}
        buttonColor={herobuttonColor}
        textColor="white"
        titleFontSize="md:text-[48px] text-[25px]"
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

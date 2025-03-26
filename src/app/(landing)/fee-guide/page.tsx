import HeroSection from "@/components/HeroSection";
import CheckupAndRoutine from "./components/CheckupAndRoutine";
import DentalImplants from "./components/DentalImplants";
import CosmeticsDentistry from "./components/CosmeticsDentistry";
import Gums from "./components/Gums";
import RootCanal from "./components/RootCanal";
import OralSurgery from "./components/OralSurgery";
import Orthodontics from "./components/Orthodontics";
import Dentures from "./components/Dentures";
import ChildrenDentistry from "./components/ChildrenDentistry";

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
      <CosmeticsDentistry />
      <Gums />
      <RootCanal />
      <DentalImplants />
      <OralSurgery />
      <Orthodontics />
      <Dentures />
      <ChildrenDentistry />
    </div>
  );
}

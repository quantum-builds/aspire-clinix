import HeroSection from "@/components/HeroSection";
import CheckupAndRoutine from "./components/CheckupAndRoutine";
import ConsultationCosts from "./components/ConsultationCosts";
import DentalImplants from "./components/DentalImplants";
import DentureAndBridges from "./components/DenturesAndBridges";
import FillingsAndExtractions from "./components/FillingsAndExtractions";
import InvisalignAndRetainer from "./components/InvisalignAndRetainer";
import Footer from "@/components/Footer";
export default function FeeGuidePage() {
  const backgroundColor = " #1D120C";
  const inputBackgroundColor = "#1D120C";
  const heroBackgroundColor = "#1D120C";
  const heroButtonColor = "#ECE8E3";

  return (
    <div className="flex flex-col w-full h-full">
      <HeroSection
        title="Dental Treatment Fee Guide"
        title_text_size={48}
        title_line_height={60}
        desc_text_size={18}
        desc_line_height={28}
        description="Explore our fee structure and treatment options."
        background_color={heroBackgroundColor}
        button_color={heroButtonColor}
        textColor="white"
      />
      <CheckupAndRoutine />

      <InvisalignAndRetainer />

      <DentalImplants />

      <FillingsAndExtractions />

      <DentureAndBridges />
      <ConsultationCosts />
      <Footer
        background_color={backgroundColor}
        input_background_color={inputBackgroundColor}
        customClasses="text-white"
        inputProps={{
          borderColor: "white",
          textColor: "white",
          placeholderColor: "white",
          arrowColor: "white",
        }}
      />
    </div>
  );
}

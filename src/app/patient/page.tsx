// "use client";

import HeroSection from "@/components/HeroSection";
import PricingPlans from "./components/PricingPlans";
import AppointmentsView from "./components/AppointmentView";
import SubscribeComponent from "./components/Subscribe";

const HERO_SECTION_DATA = {
  title: "STAY ON TOP OF YOUR WELLNESS",
  description: null,
  descTextSize: null,
  contentWidth: 100,
  backgroundColor: "#FFFFFF",
  buttonColor: "#ECE8E3",
  backgroundContent: "/videos/landing-page-video.mp4",
};

export default function Patient() {
  return (
    <div className="flex flex-col w-full h-full">
      {/* <HeroSection
        title={HERO_SECTION_DATA.title}
        description={HERO_SECTION_DATA.description}
        contentWidth={HERO_SECTION_DATA.contentWidth}
        backgroundColor={HERO_SECTION_DATA.backgroundColor}
        buttonColor={HERO_SECTION_DATA.buttonColor}
        headingFontSize="md:text-[45px] text-[23px] lg:text-[70px]"
        isVideo={true}
        backgroundContent={HERO_SECTION_DATA.backgroundContent}
      />
  
      <AppointmentsView />
      <PricingPlans /> */}
      <SubscribeComponent
        priceId={"price_1QsMlWRsBYmDUkzANYBPoU0U"}
        price={"50.00"}
        description={"Yearly Payment"}
      />
    </div>
  );
}

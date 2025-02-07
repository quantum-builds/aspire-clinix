import HeroSection from "@/components/HeroSection";
import Component1 from "./components/component1";

const HERO_SECTION_DATA = {
  title: "THE PURSUIT OF BALANCED LONGEVITY",
  description:
    "Lorem ipsum odor amet, consectetuer adipiscing elit. Sociosqu a nec magna habitant nec. Ullamcorper dui varius volutpat primis lacinia elit morbi velit.",
  descTextSize: 32,
  descLineHeight: 36.36,
  heading: "ASPIRE CLINIC’S PHILOPSOPHY",
  contentWidth: 100,
  backgroundColor: "#FFFFFF",
  buttonColor: "#ECE8E3",
  backgroundContent: "/videos/landing-page-video-1.mp4",
};

const FIRST_COMPONENT1 = {
  title: "A Holistic Approach to Longevity",
  descriptionText:
    "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
  descriptionBullets: [
    "Lorem ipsum odor amet, consectetuer adipiscing elit. ",
    "Lorem ipsum odor amet, consectetuer adipiscing elit. ,",
    "Lorem ipsum odor amet, consectetuer adipiscing elit. ",
  ],
};
export default function OurPhilosophy() {
  return (
    <div id="" className="flex flex-col">
      <HeroSection
        title={HERO_SECTION_DATA.title}
        description={HERO_SECTION_DATA.description}
        heading={HERO_SECTION_DATA.heading}
        descTextSize={HERO_SECTION_DATA.descTextSize}
        descLineHeight={HERO_SECTION_DATA.descLineHeight}
        contentWidth={HERO_SECTION_DATA.contentWidth}
        backgroundColor={HERO_SECTION_DATA.backgroundColor}
        buttonColor={HERO_SECTION_DATA.buttonColor}
        titleFontSize="md:text-[45px] text-[23px] lg:text-[70px]"
        isVideo={true}
        backgroundContent={HERO_SECTION_DATA.backgroundContent}
      />
      <Component1
        title={FIRST_COMPONENT1.title}
        descriptionText={FIRST_COMPONENT1.descriptionText}
        descriptionBullets={FIRST_COMPONENT1.descriptionBullets}
        backgroundColor="#FFFFFF"
        titleFontSize="md:text-[40px] text-[20px] lg:text-[60px]"
      />
    </div>
  );
}

import HeroSection from "@/components/HeroSection";
import GeneralDentistryService from "./components/GeneralDentistryService";
import AboutUsSection from "@/components/AboutUsSection";
import {
  AiCartoon,
  AspireAesthetic,
  ClinicChair,
  DentistTreatment,
  TeethCartoon,
} from "@/assets";

import ServiceDetailCard from "@/components/ServiceDetailCard";

const HERO_SECTION_DATA = {
  title: "General Dentistry",
  titleTextSize: 64,
  titleLineHeight: 72.64,
  description:
    "Lorem ipsum odor amet, consectetuer adipiscing elit. Sociosqu a nec magna habitant nec. Ullamcorper dui varius volutpat primis lacinia elit morbi velit.",
  descTextSize: 32,
  descLineHeight: 36.36,
  contentWidth: 100,
  backgroundColor: "#D9D9D9",
  buttonColor: "#ECE8E3",
};

const GENERAL_DENTISTRY_SERVICE = [
  {
    title: "Fillings",
    description:
      "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
    container_side: "left",
    imagePath: AiCartoon,
  },

  {
    title: " Porcelain Crowns & Inlays",
    description:
      "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
    container_side: "right",
    imagePath: TeethCartoon,
  },

  {
    title: "Bridges & Dentures",
    description:
      "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
    container_side: "left",
    imagePath: TeethCartoon,
  },
];

const ABOUT_US_SECTION_DATA = {
  description:
    "Lorem ipsum odor amet, consectetuer adipiscing elit. Sociosqu a nec magna habitant nec. Ullamcorper dui varius volutpat primis lacinia elit morbi velit.",
  descriptionTextSize: 40,
  descriptionLeadingHeight: 45.4,
  hasButton: true,
  buttonText: "Fee Guide",
  backgroundColor: "#1D120C",
  textColor: "#EBEBEB",
  descriptionWidth: 60,
};
const CARD_DATA = [
  {
    path: "/path1",
    card_width: 424,
    buttonText: "Read Bio",
    card_height: 613,
    doc_name: "Dr. Richard Porter",
    backgroundContent: TeethCartoon,
  },
  {
    path: "/path2",
    card_width: 424,
    buttonText: "Read Bio",
    card_height: 613,
    doc_name: "Dr. Raheel Malik",
    backgroundContent: AspireAesthetic,
  },
  {
    path: "/path3",
    card_width: 424,
    buttonText: "Read Bio",
    card_height: 613,
    doc_name: "Dr. Raheel Malik",
    backgroundContent: DentistTreatment,
  },
];

export default function GeneralDentistry() {
  return (
    <div className="flex flex-col" id="dentistry">
      <HeroSection
        title={HERO_SECTION_DATA.title}
        description={HERO_SECTION_DATA.description}
        contentWidth={HERO_SECTION_DATA.contentWidth}
        backgroundColor={HERO_SECTION_DATA.backgroundColor}
        buttonColor={HERO_SECTION_DATA.buttonColor}
        descLineHeight={36.6}
        headingFontSize="md:text-[45px] text-[25px] lg:text-[64px]"
        isVideo={false}
        backgroundContent={ClinicChair}
      />
      {GENERAL_DENTISTRY_SERVICE.map((service, index) => (
        <GeneralDentistryService
          key={index}
          title={service.title}
          description={service.description}
          container_side={service.container_side}
          imagePath={service.imagePath}
        />
      ))}
      <AboutUsSection
        description={ABOUT_US_SECTION_DATA.description}
        descriptionTextSize={ABOUT_US_SECTION_DATA.descriptionTextSize}
        descriptionLeadingHeight={
          ABOUT_US_SECTION_DATA.descriptionLeadingHeight
        }
        hasButton={ABOUT_US_SECTION_DATA.hasButton}
        buttonText={ABOUT_US_SECTION_DATA.buttonText}
        backgroundColor={ABOUT_US_SECTION_DATA.backgroundColor}
        textColor={ABOUT_US_SECTION_DATA.textColor}
        descriptionWidth={ABOUT_US_SECTION_DATA.descriptionWidth}
        buttonBackgroundColor="#ECE8E3"
      />

      <div className="bg-feeGuide flex flex-col gap-20 w-full mx-auto">
        <h2 className="text-[40px] font-opus md:text-[52px] mx-auto container text-center lg:text-left text-black font-normal pt-[3.5rem] lg:px-12">
          Meet the team
        </h2>
        <div className="grid grid-cols-1 justify-items-center gap-[3rem] container lg:gap-16 lg:grid-cols-2 xl:gap-0 xl:grid-cols-3 mx-auto h-full pb-[10%] lg:px-12">
          {CARD_DATA.map((card, index) => (
            <ServiceDetailCard
              key={index}
              path={card.path}
              backgroundContent={card.backgroundContent}
              card_width={card.card_width}
              buttonText={card.buttonText}
              card_height={card.card_height}
              doc_name={card.doc_name}
              className="w-[320px] sm:w-[360px] md:w-[424px] h-auto xl:w-[380px] 2xl:w-[424px]"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

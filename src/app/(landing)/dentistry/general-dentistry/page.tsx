import HeroSection from "@/components/HeroSection";
import GeneralDentistryService from "./components/GeneralDentistryService";
import AboutUsSection from "@/components/AboutUsSection";
import { Dentist } from "@/assets";

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
    imagePath: Dentist,
  },

  {
    title: " Porcelain Crowns & Inlays",
    description:
      "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
    container_side: "right",
    imagePath: Dentist,
  },

  {
    title: "Bridges & Dentures",
    description:
      "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
    container_side: "left",
    imagePath: Dentist,
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
  },
  {
    path: "/path2",
    card_width: 424,
    buttonText: "Read Bio",
    card_height: 613,
    doc_name: "Dr. Raheel Malik",
  },
  {
    path: "/path3",
    card_width: 424,
    buttonText: "Read Bio",
    card_height: 613,
    doc_name: "Dr. Raheel Malik",
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
      />

      <div className="bg-[#ECE8E3] flex flex-col gap-20 w-full mx-auto">
        <h2 className="text-[40px] md:text-[52px] text-center lg:text-left text-black font-normal lg:pl-[12%] xl:pl-[15%] pt-[3.5rem]">
          Meet the team
        </h2>
        <div className="grid grid-cols-1 gap-[3rem] lg:gap-16 lg:grid-cols-2 xl:grid-cols-3 mx-auto h-full pb-[10%]">
          {CARD_DATA.map((card, index) => (
            <ServiceDetailCard
              key={index}
              path={card.path}
              card_width={card.card_width}
              buttonText={card.buttonText}
              card_height={card.card_height}
              doc_name={card.doc_name}
              className="w-[360px] md:w-[424px] h-auto"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

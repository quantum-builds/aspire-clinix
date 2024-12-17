import HeroSection from "@/components/HeroSection";
import GeneralDentistryService from "./components/GeneralDentistryService";
import AboutUsSection from "@/components/AboutUsSection";

import ServiceDetailCard from "@/components/ServiceDetailCard";

const HERO_SECTION_DATA = {
  title: "General Dentistry",
  titleTextSize: 64,
  titleLineHeight: 72.64,
  decription:
    "Lorem ipsum odor amet, consectetuer adipiscing elit. Sociosqu a nec magna habitant nec. Ullamcorper dui varius volutpat primis lacinia elit morbi velit.",
  descTextSize: 32,
  descLineHeight: 36.36,
  contentWidth: 60,
  backgroundColor: "#D9D9D9",
  buttonColor: "#EBEBEB",
};

const GENERAL_DENTISTRY_SERVICE = [
  {
    title: "Fillings",
    description:
      "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
    container_side: "left",
  },

  {
    title: " Porcelain Crowns & Inlays",
    description:
      "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
    container_side: "right",
  },

  {
    title: "Bridges & Dentures",
    description:
      "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
    container_side: "left",
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
    card_width: 550,
    buttonText: "Read Bio",
    card_height: 513,
    doc_name: "Dr. Richard Porter",
  },
  {
    path: "/path2",
    card_width: 550,
    buttonText: "Read Bio",
    card_height: 513,
    doc_name: "Dr. Raheel Malik",
  },
  {
    path: "/path3",
    card_width: 550,
    buttonText: "Read Bio",
    card_height: 513,
    doc_name: "Dr. Raheel Malik",
  },
];

export default function GeneralDentistry() {
  return (
    <div className="flex flex-col" id="dentistry">
      <HeroSection
        title={HERO_SECTION_DATA.title}
        description={HERO_SECTION_DATA.decription}
        descLineHeight={HERO_SECTION_DATA.descLineHeight}
        contentWidth={HERO_SECTION_DATA.contentWidth}
        backgroundColor={HERO_SECTION_DATA.backgroundColor}
        buttonColor={HERO_SECTION_DATA.buttonColor}
      />
      {GENERAL_DENTISTRY_SERVICE.map((service, index) => (
        <GeneralDentistryService
          key={index}
          title={service.title}
          description={service.description}
          container_side={service.container_side}
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
      <div className="flex flex-col justify-center items-center mt-20 mt- pb-32">
        <h1 className="text-22px md:text-[52px] font-bold mb-8 relative right-96">
          Meet the team
        </h1>
        {/* <div className="flex flex-row gap-8 justify-center"> */}
        <div className="flex flex-col sm:flex-row md:flex-row gap-8 justify-center items-center">
          {CARD_DATA.map((card, index) => (
            <ServiceDetailCard
              key={index}
              path={card.path}
              card_width={card.card_width}
              card_height={card.card_height}
              buttonText={card.buttonText}
              doc_name={card.doc_name}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

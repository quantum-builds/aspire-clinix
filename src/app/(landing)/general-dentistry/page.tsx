import HeroSection from "@/components/HeroSection";
import GeneralDentistryService from "@/app/(landing)/general-dentistry/components/GeneralDentistryService";
import AboutUsSection from "@/components/AboutUsSection";
import {
  AiCartoon,
  AspireAesthetic,
  ClinicChair,
  Dentist1,
  Dentist2,
  Dentist3,
  DentistTreatment,
  DropDown4,
  DropDown8,
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
    imagePath: DropDown8,
  },

  {
    title: " Porcelain Crowns & Inlays",
    description:
      "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
    container_side: "right",
    imagePath: Dentist1,
  },

  {
    title: "Bridges & Dentures",
    description:
      "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
    container_side: "left",
    imagePath: DropDown4,
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
    path: "/dr-richardporter",
    card_width: 424,
    buttonText: "Read Bio",
    card_height: 613,
    doc_name: "Dr. Richard Porter",
    backgroundContent: "/videos/general-dentistry-01.mp4",
    is_video: true,
  },
  {
    path: "/dr-raheelmalik",
    card_width: 424,
    buttonText: "Read Bio",
    card_height: 613,
    doc_name: "Dr. Raheel Malik",
    backgroundContent: "/videos/general-dentistry-02.mp4",
    is_video: true,
  },
  {
    path: "/dr-aspireclinic",
    card_width: 424,
    buttonText: "Read Bio",
    card_height: 613,
    doc_name: "Dr. Raheel Malik",
    backgroundContent: "/videos/landing-page-video-1.mp4",
    is_video: true,
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
        titleFontSize="md:text-[45px] text-[25px] lg:text-[64px]"
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
    </div>
  );
}

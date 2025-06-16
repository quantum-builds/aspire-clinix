import AboutUsSection from "../../../components/AboutUsSection";

import HeroSection from "../../../components/HeroSection";
import DentistryDetailSection from "../../../components/DentistryDetailSection";
import {
  AiCartoon,
  ClinicChair,
  DentistTreatment,
  image1,
  image2,
  image3,
  TeethCartoon,
} from "@/assets";

const HERO_SECTION_DATA = {
  title: "WELLNESS",
  titleTextSize: 64,
  titleLineHeight: 72.64,
 description: "At Aspire Wellness, we adopt an integrative approach to your health, offering services that nourish both body and mind.<br/>Our focus — cultivating long-term vitality, relaxation, and equilibrium, empowering you to achieve a flourished and energised life of true balance.",

  descTextSize: 32,
  descLineHeight: 36.36,
  contentWidth: 100,
  backgroundColor: "#D9D9D9",
  buttonColor: "#EBEBEB",
};

const ABOUT_US_SECTION_DATA = {
 description: "While many speak of prevention being better than cure, few truly put it into practice. At our wellness clinic, we offer you that very opportunity.<br/><br/>We believe the mind and body are inseparable, and true wellness must address both. At Aspire, we combine advanced therapies such as red light treatment, invigorating cold exposure, and the healing power of touch, with in-depth analysis of your body’s stress levels, inflammatory profile, and psychological wellbeing.<br/><br/>The answers you’ve been searching for may begin here.",

  descriptionTextSize: 40,
  descriptionLeadingHeight: 45.4,
  hasButton: false,
  buttonText: null,
  backgroundColor: "#ECE8E3",
  textColor: "#382F26",
  descriptionWidth: 60,
};

const WELLNESS_SERVICES = {
  services: [
    {
      title: "General Dentistry",
      description:
        "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
      path: "/",
      backgroundContent: image1,
    },
    {
      title: "General Dentistry",
      description:
        "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
      path: "/",
      backgroundContent: image2,
    },
    {
      title: "General Dentistry",
      description:
        "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
      path: "/",
      backgroundContent: image3,
    },
    {
      title: "General Dentistry",
      description:
        "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
      path: "/",
      backgroundContent: image1,
    },
    {
      title: "General Dentistry",
      description:
        "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
      path: "/",
      backgroundContent: image2,
    },
    {
      title: "General Dentistry",
      description:
        "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
      path: "/",
      backgroundContent: image3,
    },
    {
      title: "General Dentistry",
      description:
        "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
      path: "/",
      backgroundContent: image1,
    },
    {
      title: "General Dentistry",
      description:
        "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
      path: "/",
      backgroundContent: image2,
    },
    {
      title: "General Dentistry",
      description:
        "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
      path: "/",
      backgroundContent: image3,
    },
    {
      title: "General Dentistry",
      description:
        "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
      path: "/",
      backgroundContent: image1,
    },
  ],
};

export default function Wellness() {
  return (
    <div className="flex flex-col" id="wellness">
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
      <AboutUsSection
        description={ABOUT_US_SECTION_DATA.description}
        buttonBackgroundColor="#ECE8E3"
        hasButton={ABOUT_US_SECTION_DATA.hasButton}
        buttonText={ABOUT_US_SECTION_DATA.buttonText}
        backgroundColor={ABOUT_US_SECTION_DATA.backgroundColor}
        textColor={ABOUT_US_SECTION_DATA.textColor}
        buttonClickLink={"/"}
      />
      <DentistryDetailSection services={WELLNESS_SERVICES.services} />
    </div>
  );
}

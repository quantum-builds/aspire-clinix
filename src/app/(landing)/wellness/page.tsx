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
  description:
    "At Aspire Wellness, we adopt an integrative approach to your health, offering services that nourish both body and mind.<br/>Our focus — cultivating long-term vitality, relaxation, and equilibrium, empowering you to achieve a flourished and energised life of true balance.",

  descTextSize: 32,
  descLineHeight: 36.36,
  contentWidth: 100,
  backgroundColor: "#D9D9D9",
  buttonColor: "#EBEBEB",
};

const ABOUT_US_SECTION_DATA = {
  description:
    "While many speak of prevention being better than cure, few truly put it into practice. At our wellness clinic, we offer you that very opportunity.<br/><br/>We believe the mind and body are inseparable, and true wellness must address both. At Aspire, we combine advanced therapies such as red light treatment, invigorating cold exposure, and the healing power of touch, with in-depth analysis of your body’s stress levels, inflammatory profile, and psychological wellbeing.<br/><br/>The answers you’ve been searching for may begin here.",

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
      title: "Cryotherapy",
      description:
        "Cryotherapy is a cutting-edge wellness treatment that harnesses the power of cold to promote recovery, dramatically reduce inflammation, and boost overall well-being. ",
      path: "/services/cryotherapy-chamber",
      backgroundContent: image1,
    },
    {
      title: "Infra-red Sauna",
      description:
        "Our Sunlighten Infrared Sauna offers a relaxing and rejuvenating experience that promotes deep detoxification, improved circulation, and enhanced relaxation. ",
      path: "/services/sauna",
      backgroundContent: image2,
    },
    {
      title: "Contrast Therapy",
      description:
        "Contrast Therapy combines the powerful benefits of heat and cold to support recovery, improve circulation, and ease muscle tension. ",
      path: "/services/contrast",
      backgroundContent: image3,
    },
    {
      title: "Hyperbaric Oxygen",
      description:
        "Hyperbaric Oxygen Therapy is a powerful treatment designed to accelerate healing and promote overall wellness. ",
      path: "/services/oxygen",
      backgroundContent: image1,
    },
    {
      title: "Ice Baths",
      description:
        "Ice Baths are a powerful and dynamic recovery tool that helps reduce muscle soreness, promote healing, and boost overall wellness. ",
      path: "/services/ice",
      backgroundContent: image2,
    },
    {
      title: "Massage",
      description:
        "Our Massage Therapy services at Aspire are designed to relax both body and mind, helping to ease tension, improve circulation, and enhance overall wellness.",
      path: "/services/massage",
      backgroundContent: image3,
    },
    {
      title: "Compression Therapy",
      description:
        "Experience the rejuvenating benefits of Compression Therapy at Aspire. ",
      path: "/services/compression",
      backgroundContent: image1,
    },
    {
      title: "IV Lounge",
      description:
        "Revitalise your body and mind at Aspire's IV Lounge, where personalised intravenous treatments deliver essential nutrients ",
      path: "/services/lounge",
      backgroundContent: image2,
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
        titleFontSize="text-[35]px md:text-[60px] lg:text-[64px]"
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

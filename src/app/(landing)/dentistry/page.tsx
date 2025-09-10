import AboutUsSection from "../../../components/AboutUsSection";

import HeroSection from "../../../components/HeroSection";
import DentistryDetailSection from "../../../components/DentistryDetailSection";
import {
  ClinicChair,
  image1,
  image2,
  image3,
} from "@/assets";

const HERO_SECTION_DATA = {
  title: "DENTISTRY",
  titleTextSize: 64,
  titleLineHeight: 72.64,
  description:
    "We provide advanced general and specialist dental care with a personal touch. Our hand-picked and superbly skilled team offers a wide range of treatments, all tailored to your unique needs.<br/>We are committed to ensuring your comfort while helping you achieve a healthy, radiant smile.",
  descTextSize: 32,
  descLineHeight: 36.36,
  contentWidth: 100,
  backgroundColor: "#D9D9D9",
  buttonColor: "#EBEBEB",
};

const ABOUT_US_SECTION_DATA = {
  description:
    "Our team shares a common goal: to prevent every patient from ever experiencing tooth loss or dental problems. When issues do arise, you'll be cared for by a team led by renowned educators in dentistry, who have handpicked clinicians with deep expertise in their respective fields — delivering the highest standards of care you deserve.<br/><br/>At Aspire, we use only the world's finest equipment and materials. Combined with our collaborative, multidisciplinary approach, we are confident in offering you dental care of the very highest standard.<br/><br/>Our experienced team is dedicated to providing personalised, high-quality care in a comfortable and supportive environment. We focus on achieving long-term health and beautiful smiles through expert care and the latest techniques.",
  descriptionTextSize: 28,
  descriptionLeadingHeight: 35,
  hasButton: false,
  buttonText: null,
  backgroundColor: "#ECE8E3",
  textColor: "#382F26",
  descriptionWidth: 60,
};

const DENTISTRY_SERVICES = {
  services: [
    {
      title: "General ",
      description:
        "Your oral health is one of the foundations of your overall well-being and at Aspire we treat it with the care it deserves.",
      path: "/",
      backgroundContent: image1,
    },
    {
      title: "Emergency ",
      description:
        "When urgent dental care is needed, Aspire is here to provide prompt, professional support.we can to relieve your discomfort as quickly as possible.",
      path: "/services/emergency",
      backgroundContent: image2,
    },
    {
      title: "Cosmetic ",
      description:
        "At our Cosmetic Clinic, we specialise in enhancing your smile to reflect your true confidence and individuality.",
      path: "/services/cosmetic",
      backgroundContent: image3,
    },
    {
      title: "Implants ",
      description:
        "Dental implants are a long-lasting, natural-looking solution for replacing missing teeth—restoring both function and confidence.",
      path: "/services/implants",
      backgroundContent: image1,
    },
    {
      title: "Gums ",
      description:
        "Your gums are the foundation of a strong, beautiful smile. Having healthy and beautiful gums is a key foundation to all dental health.",
      path: "/services/gums",
      backgroundContent: image2,
    },
    {
      title: "Oral Surgery",
      description:
        "Our expert team at Aspire specialises in a wide range of oral surgical procedures, from managing wisdom tooth problems to simple dental extractions.",
      path: "/services/surgery",
      backgroundContent: image3,
    },
    {
      title: "Dentures ",
      description:
        "Our expert team at Aspire specialises in a wide range of oral surgical procedures, from managing wisdom tooth problems to simple dental extractions.",
      path: "/services/dentures",
      backgroundContent: image1,
    },
    {
      title: "Root Canals",
      description:
        "Root canal treatment (Endodontics) is often the best way to preserve a natural tooth that has been damaged by decay or trauma reaching the nerve.",
      path: "/services/root",
      backgroundContent: image2,
    },
    {
      title: "Orthodontic",
      description:
        "Our Orthodontic Clinic offers expert care to help you achieve a beautifully aligned smile",
      path: "/services/orthodontic",
      backgroundContent: image3,
    },
    {
      title: "Kids ",
      description:
        "Our Kids' Clinic is dedicated to providing a welcoming and friendly environment where children can receive top-quality dental care.",
      path: "/services/kid",
      backgroundContent: image1,
    },
  ],
};

export default function Denistry() {
  return (
    <div className="flex flex-col" id="dentistry">
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
      <DentistryDetailSection services={DENTISTRY_SERVICES.services} />
    </div>
  );
}

import AboutUsSection from "../../../components/AboutUsSection";

import HeroSection from "../../../components/HeroSection";
import DentistryDetailSection from "../../../components/DentistryDetailSection";
import {
  ClinicChair,
  image1,
  image2,
} from "@/assets";

const HERO_SECTION_DATA = {
  title: "ASTHETICS",
  titleTextSize: 64,
  titleLineHeight: 72.64,
  description:
    "We provide a wide range of tailored treatments to subtly enhance your natural beauty with precision and care.<br/>Our facial aesthetics team, carefully selected for their expertise, takes the time to understand your unique desires and offer the best treatments to achieve them.",

  descTextSize: 32,
  descLineHeight: 36.36,
  contentWidth: 100,
  backgroundColor: "#D9D9D9",
  buttonColor: "#EBEBEB",
};

const ABOUT_US_SECTION_DATA = {
  description:
    "Utilising the latest, cutting-edge techniques, we are committed to<br/>delivering refined, harmonious, and natural-looking results that<br/>complement your unique features",
  descriptionTextSize: 40,
  descriptionLeadingHeight: 45.4,
  hasButton: false,
  buttonText: null,
  backgroundColor: "#ECE8E3",
  textColor: "#382F26",
  descriptionWidth: 60,
};

const ASTHETICS_SERVICES = {
  services: [
    {
      title: "Anti Wrinkle Injections",
      description:
        "Our Anti-Wrinkle Injections are designed to help you achieve a smoother, more youthful appearance with minimal downtime.",
      path: "/services/anti-wrinkle",
      backgroundContent: image1,
    },
    {
      title: "Fillers",
      description:
        "Our Dermal Fillers are crafted to enhance your natural features and restore youthful volume.Each treatment is designed to smooth lines, restore balance",
      path: "/services/fillers",
      backgroundContent: image2,
    },

    {
      title: "Skin Boosters",
      description:
        "Our Skin Boosters are designed to deeply hydrate and rejuvenate your skin from within, restoring a radiant, glowing complexion.",
      path: "/services/boosters",
      backgroundContent: image1,
    },
  ],
};

export default function Asthetics() {
  return (
    <div className="flex flex-col" id="asthetics">
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
      <DentistryDetailSection services={ASTHETICS_SERVICES.services} />
    </div>
  );
}

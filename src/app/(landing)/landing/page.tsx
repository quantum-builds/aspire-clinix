import LandingPageImage from "@/components/LandingPageImage";
import AboutUsSection from "../../../components/AboutUsSection";

import HeroSection from "../../../components/HeroSection";
import ServiceDetailSection from "./components/ServiceDetailsSection";
import ServiceSection from "./components/ServicesSection";
import SupplementSection from "./components/SupplementSection";

const DENTAL_SERVICES = {
  title: "Dentistry",
  description:
    "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit.",
  services: [
    {
      title: "General Dentistry",
      description:
        "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
      path: "/",
    },
    {
      title: "General Dentistry",
      description:
        "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
      path: "/",
    },
    {
      title: "General Dentistry",
      description:
        "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
      path: "/",
    },
    {
      title: "General Dentistry",
      description:
        "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
      path: "/",
    },
    {
      title: "General Dentistry",
      description:
        "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
      path: "/",
    },
    {
      title: "General Dentistry",
      description:
        "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
      path: "/",
    },
    {
      title: "General Dentistry",
      description:
        "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
      path: "/",
    },
    {
      title: "General Dentistry",
      description:
        "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
      path: "/",
    },
    {
      title: "General Dentistry",
      description:
        "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
      path: "/",
    },
    {
      title: "General Dentistry",
      description:
        "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
      path: "/",
    },
  ],
};

const ASTHETIC_SERVICE = {
  title: "Asthetic",
  description:
    "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
  services: [
    {
      title: "General Dentistry",
      description:
        "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
      path: "/",
    },
    {
      title: "General Dentistry",
      description:
        "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
      path: "/",
    },
    {
      title: "General Dentistry",
      description:
        "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
      path: "/",
    },
    {
      title: "General Dentistry",
      description:
        "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
      path: "/",
    },
    {
      title: "General Dentistry",
      description:
        "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
      path: "/",
    },
    {
      title: "General Dentistry",
      description:
        "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
      path: "/",
    },
  ],
};

const WELLNESS_SERVICE = {
  title: "Wellness",
  description:
    "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
  services: [
    {
      title: "General Dentistry",
      description:
        "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
      path: "/",
    },
    {
      title: "General Dentistry",
      description:
        "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
      path: "/",
    },
    {
      title: "General Dentistry",
      description:
        "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
      path: "/",
    },
    {
      title: "General Dentistry",
      description:
        "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
      path: "/",
    },
    {
      title: "General Dentistry",
      description:
        "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
      path: "/",
    },
    {
      title: "General Dentistry",
      description:
        "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
      path: "/",
    },
    {
      title: "General Dentistry",
      description:
        "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
      path: "/",
    },
    {
      title: "General Dentistry",
      description:
        "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
      path: "/",
    },
    {
      title: "General Dentistry",
      description:
        "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
      path: "/",
    },
  ],
};

const HERO_SECTION_DATA = {
  title: "HOLISTIC WELLNESS IS A JOURNEY THAT STARTS HERE",
  description: null,
  descTextSize: null,
  contentWidth: 100,
  backgroundColor: "#FFFFFF",
  buttonColor: "#EBEBEB",
};

const ABOUT_US_SECTION_DATA = {
  description:
    "Lorem ipsum odor amet, consectetuer adipiscing elit. Sociosqu a nec magna habitant nec. Ullamcorper dui varius volutpat primis lacinia elit morbi velit.",
  descriptionTextSize: 40,
  descriptionLeadingHeight: 45.4,
  hasButton: true,
  buttonText: "Our Philosophy",
  backgroundColor: "#1D120C",
  textColor: "#C9BCA9",
  descriptionWidth: 60,
};

export default function LandingPage() {
  return (
    <div id="landing" className="flex flex-col">
      <HeroSection
        title={HERO_SECTION_DATA.title}
        description={HERO_SECTION_DATA.description}
        contentWidth={HERO_SECTION_DATA.contentWidth}
        backgroundColor={HERO_SECTION_DATA.backgroundColor}
        buttonColor={HERO_SECTION_DATA.buttonColor}
      />
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
      <LandingPageImage />
      <ServiceSection />
      <ServiceDetailSection
        title={DENTAL_SERVICES.title}
        description={DENTAL_SERVICES.description}
        services={DENTAL_SERVICES.services}
      />
      <ServiceDetailSection
        title={ASTHETIC_SERVICE.title}
        description={ASTHETIC_SERVICE.description}
        services={ASTHETIC_SERVICE.services}
      />
      <ServiceDetailSection
        title={WELLNESS_SERVICE.title}
        description={WELLNESS_SERVICE.description}
        services={WELLNESS_SERVICE.services}
      />
      <SupplementSection />
    </div>
  );
}

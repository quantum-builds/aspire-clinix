import AboutUsSection from "../components/AboutUsSection";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import ServiceDetailSection from "./components/ServiceDetailsSection";
import ServiceSection from "./components/ServicesSection";
import SupplementSection from "./components/SupplementSection";

const DENTAL_SERVICES = {
  title: "Aspire Dental",
  description: null,
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

const ASTHETIC_SERVICE = {
  title: "Aspire Asthetic",
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
  title: "Aspire Wellness",
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
  title_text_size: 70,
  title_line_height: 79.45,
  decription: null,
  desc_text_size: null,
  desc_line_height: null,
  content_width: 70,
  background_color: "#FFFFFF",
  button_color: "#EBEBEB",
};

const ABOUT_US_SECTION_DATA = {
  description:
    "Lorem ipsum odor amet, consectetuer adipiscing elit. Sociosqu a nec magna habitant nec. Ullamcorper dui varius volutpat primis lacinia elit morbi velit.",
  description_text_size: 40,
  description_leading_height: 45.4,
  has_button: true,
  button_text: "Our Philosophy",
  background_color: "#382F26",
  text_color: "#C9BCA9",
  description_width: 60,
};

const FOOTET_DATA = {
  background_color: "#FFFFFF",
  input_background_color: "#FFFFFF",
};

export default function LandingPage() {
  return (
    <div id="landing" className="flex flex-col">
      <HeroSection
        title={HERO_SECTION_DATA.title}
        title_text_size={HERO_SECTION_DATA.title_text_size}
        title_line_height={HERO_SECTION_DATA.title_line_height}
        description={HERO_SECTION_DATA.decription}
        desc_text_size={HERO_SECTION_DATA.desc_text_size}
        desc_line_height={HERO_SECTION_DATA.desc_line_height}
        content_width={HERO_SECTION_DATA.content_width}
        background_color={HERO_SECTION_DATA.background_color}
        button_color={HERO_SECTION_DATA.button_color}
      />
      <AboutUsSection
        description={ABOUT_US_SECTION_DATA.description}
        description_text_size={ABOUT_US_SECTION_DATA.description_text_size}
        description_leading_height={
          ABOUT_US_SECTION_DATA.description_leading_height
        }
        has_button={ABOUT_US_SECTION_DATA.has_button}
        button_text={ABOUT_US_SECTION_DATA.button_text}
        background_color={ABOUT_US_SECTION_DATA.background_color}
        text_color={ABOUT_US_SECTION_DATA.text_color}
        description_width={ABOUT_US_SECTION_DATA.description_width}
      />
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
      <Footer
        background_color={FOOTET_DATA.background_color}
        input_background_color={FOOTET_DATA.input_background_color}
      />
    </div>
  );
}

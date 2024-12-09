import AboutUsSection from "../components/AboutUsSection";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import DentistryDeatilSection from "./components/DentistryDetailSection";

const HERO_SECTION_DATA = {
  title: "DENTISTRY",
  title_text_size: 64,
  title_line_height: 72.64,
  decription:
    "Lorem ipsum odor amet, consectetuer adipiscing elit. Sociosqu a nec magna habitant nec. Ullamcorper dui varius volutpat primis lacinia elit morbi velit.",
  desc_text_size: 32,
  desc_line_height: 36.36,
  content_width: 60,
  background_color: "#D9D9D9",
  button_color: "#EBEBEB",
};

const ABOUT_US_SECTION_DATA = {
  description:
    "Lorem ipsum odor amet, consectetuer adipiscing elit. Sociosqu a nec magna habitant nec. Ullamcorper dui varius volutpat primis lacinia elit morbi velit.",
  description_text_size: 40,
  description_leading_height: 45.4,
  has_button: false,
  button_text: null,
  background_color: "#FFFFFF",
  text_color: "#382F26",
  description_width: 60,
};

const FOOTET_DATA = {
  background_color: "#D9D9D9",
  input_background_color: "#D9D9D9",
};

const DENTISTRY_SERVICES = {
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
export default function Denistry() {
  return (
    <div className="flex flex-col" id="dentistry">
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
      <DentistryDeatilSection services={DENTISTRY_SERVICES.services} />
      <Footer
        background_color={FOOTET_DATA.background_color}
        input_background_color={FOOTET_DATA.input_background_color}
      />
    </div>
  );
}

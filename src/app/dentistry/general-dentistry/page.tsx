import HeroSection from "@/app/components/HeroSection";
import GeneralDentistryService from "./components/GeneralDentistryService";
import { title } from "process";
import AboutUsSection from "@/app/components/AboutUsSection";
import Footer from "@/app/components/Footer";

const HERO_SECTION_DATA = {
  title: "General Dentistry",
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
  description_text_size: 40,
  description_leading_height: 45.4,
  has_button: true,
  button_text: "Fee Guide",
  background_color: "#ADADAD",
  text_color: "#EBEBEB",
  description_width: 60,
};

const FOOTET_DATA = {
  background_color: "#D9D9D9",
  input_background_color: "#D9D9D9",
};

export default function GeneralDentistry() {
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
      <Footer
        background_color={FOOTET_DATA.background_color}
        input_background_color={FOOTET_DATA.input_background_color}
      />
    </div>
  );
}

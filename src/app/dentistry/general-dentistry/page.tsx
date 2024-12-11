import HeroSection from "@/components/HeroSection";
import GeneralDentistryService from "./components/GeneralDentistryService";
import AboutUsSection from "@/components/AboutUsSection";
import Footer from "@/components/Footer";
import ServiceDetailCard from "@/components/ServiceDetailCard";

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
const CARD_DATA = [
  {
    path: "/path1",
    card_width: 550,
    button_text: "Read Bio",
    card_height: 513,
    doc_name: "Dr. Richard Porter",
  },
  {
    path: "/path2",
    card_width: 550,
    button_text: "Read Bio",
    card_height: 513,
    doc_name: "Dr. Raheel Malik",
  },
  {
    path: "/path3",
    card_width: 550,
    button_text: "Read Bio",
    card_height: 513,
    doc_name: "Dr. Raheel Malik",
  },
];

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
      <div className="flex flex-col justify-center items-center mt-20 mt- pb-32">
        <h1 className="text-[52px] font-bold mb-8 relative right-96">
          Meet the team
        </h1>
        <div className="flex flex-row gap-8 justify-center">
          {CARD_DATA.map((card, index) => (
            <ServiceDetailCard
              key={index}
              path={card.path}
              card_width={card.card_width}
              card_height={card.card_height}
              button_text={card.button_text}
              doc_name={card.doc_name}
            />
          ))}
        </div>
      </div>

      <Footer
        background_color={FOOTET_DATA.background_color}
        input_background_color={FOOTET_DATA.input_background_color}
      />
    </div>
  );
}

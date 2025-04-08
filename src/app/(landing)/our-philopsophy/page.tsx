import HeroSection from "@/components/HeroSection";
import Component1 from "./components/Component1";
import Component2 from "./components/Component2";
import { image1 } from "@/assets/index";
import SupplementSection from "@/app/(landing)/components/SupplementSection";

const HERO_SECTION_DATA = {
  title: "THE PURSUIT OF BALANCED LONGEVITY",
  description:
    "Lorem ipsum odor amet, consectetuer adipiscing elit. Sociosqu a nec magna habitant nec. Ullamcorper dui varius volutpat primis lacinia elit morbi velit.",
  descTextSize: 32,
  descLineHeight: 36.36,
  heading: "ASPIRE CLINIC’S PHILOSOPHY",
  contentWidth: 100,
  backgroundColor: "#ECE8E3",
  buttonColor: "#ECE8E3",
  backgroundContent: image1,
};

const FIRST_COMPONENT1 = {
  title: "A Holistic Approach to Longevity",
  descriptionText:
    "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
  descriptionBullets: [
    "Lorem ipsum odor amet, consectetuer adipiscing elit. ",
    "Lorem ipsum odor amet, consectetuer adipiscing elit. ,",
    "Lorem ipsum odor amet, consectetuer adipiscing elit. ",
  ],
};
const FIRST_COMPONENT2 = {
  title: "The Science of Balance & Well-being",
  firstDescriptionText:
    "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
  secondDescriptionText:
    "Sociosqu a nec magna habitant nec. Ullamcorper dui varius volutpat primis lacinia elit morbi velit. ",
  imagePath: image1,
};

const SECOND_COMPONENT1 = {
  title: "Integrating Health, Movement and Nurtrition",
  descriptionText:
    "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
  descriptionBullets: [
    "Lorem ipsum odor amet, consectetuer adipiscing elit. ",
    "Lorem ipsum odor amet, consectetuer adipiscing elit. ,",
    "Lorem ipsum odor amet, consectetuer adipiscing elit. ",
  ],
};
const SECOND_COMPONENT2 = {
  title: "Transformative Programs for a Longer, Healthier Life",
  firstDescriptionText:
    "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. Lorem ipsum odor amet, consectetuer adipiscing elit. ",
  secondDescriptionText:
    "Sociosqu a nec magna habitant nec. Ullamcorper dui varius volutpat primis lacinia elit morbi velit. ",
  imagePath: image1,
};

const CONTACT_US_SECTION = {
  description:
    "Your uniqueness deserves a health partner just as exceptional. Sociosqu anec magna habitant nec. Ullamcorper dui varius volutpat primis lacinia elit morbi velitt",
  descriptionTextSize: 60,
  descriptionLeadingHeight: 80,
  hasButton: true,
  buttonText: "Contact Us",
  buttonClickLink: "/contact-us",
  backgroundColor: "#1D120C",
  textColor: "#C9BCA9",
  descriptionWidth: 60,
  buttonBackgroundColor: "#ECE8E3",
};
export default function OurPhilosophy() {
  return (
    <div id="" className="flex flex-col">
      <HeroSection
        title={HERO_SECTION_DATA.title}
        description={HERO_SECTION_DATA.description}
        heading={HERO_SECTION_DATA.heading}
        descTextSize={HERO_SECTION_DATA.descTextSize}
        descLineHeight={HERO_SECTION_DATA.descLineHeight}
        contentWidth={HERO_SECTION_DATA.contentWidth}
        backgroundColor={HERO_SECTION_DATA.backgroundColor}
        buttonColor={HERO_SECTION_DATA.buttonColor}
        titleFontSize="md:text-[45px] text-[23px] lg:text-[70px]"
        isVideo={false}
        backgroundContent={HERO_SECTION_DATA.backgroundContent}
      />
      <Component1
        title={FIRST_COMPONENT1.title}
        descriptionText={FIRST_COMPONENT1.descriptionText}
        descriptionBullets={FIRST_COMPONENT1.descriptionBullets}
        backgroundColor="#ECE8E3"
        titleFontSize="md:text-[40px] text-[20px] lg:text-[60px]"
      />
      <Component2
        title={FIRST_COMPONENT2.title}
        firstDescriptionText={FIRST_COMPONENT2.firstDescriptionText}
        secondDescriptionText={FIRST_COMPONENT2.secondDescriptionText}
        backgroundColor="#DCD4C9"
        imagePath={FIRST_COMPONENT2.imagePath}
        titleFontSize="md:text-[35px] text-[23px] lg:text-[50px] xl:text-[65px]"
      />
      <Component1
        title={FIRST_COMPONENT1.title}
        descriptionText={SECOND_COMPONENT1.descriptionText}
        descriptionBullets={SECOND_COMPONENT1.descriptionBullets}
        backgroundColor="#ECE8E3"
        titleFontSize="md:text-[40px] text-[20px] lg:text-[60px]"
      />
      <Component2
        title={FIRST_COMPONENT2.title}
        firstDescriptionText={SECOND_COMPONENT2.firstDescriptionText}
        secondDescriptionText={SECOND_COMPONENT2.secondDescriptionText}
        backgroundColor="#DCD4C9"
        imagePath={SECOND_COMPONENT2.imagePath}
        titleFontSize="md:text-[35px] text-[23px] lg:text-[50px] xl:text-[65px]"
      />
      <SupplementSection
        description={CONTACT_US_SECTION.description}
        buttonClickLink={CONTACT_US_SECTION.buttonClickLink}
        hasButton={CONTACT_US_SECTION.hasButton}
        buttonText={CONTACT_US_SECTION.buttonText}
        backgroundColor={CONTACT_US_SECTION.backgroundColor}
        textColor={CONTACT_US_SECTION.textColor}
        buttonBackgroundColor={CONTACT_US_SECTION.buttonBackgroundColor}
      />
    </div>
  );
}

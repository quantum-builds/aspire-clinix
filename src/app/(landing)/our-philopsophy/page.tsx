import HeroSection1 from "@/components/HeroSection";
import Component1 from "./components/Component1";
import Component2 from "./components/Component2";
import { image1, image2 } from "@/assets/index";
import SupplementSection from "@/app/(landing)/components/SupplementSection";
import AboutUsSection from "@/components/AboutUsSection";

const HERO_SECTION_DATA = {
  title: "THE PURSUIT OF BALANCED FLOURISHING",
  description:
    "Life isn’t about simply living longer it’s about living fully. At Aspire, we combine preventative medicine, dentistry, aesthetics, and whole-body wellness to help you live with strength, balance, and joy.<br/><br/>We focus on your long-term health and happiness, creating an environment where emotional well-being, vitality, and lifestyle can thrive.",
  descTextSize: 20,
  descLineHeight: 25,
  heading: "ASPIRE CLINIC'S PHILOSOPHY",
  contentWidth: 55,
  backgroundColor: "#ECE8E3",
  buttonColor: "#ECE8E3",
  backgroundContent: image1,
};

const PHILOSOPHY_SECTION = {
  description:
    "Our philosophy centres on the holistic care of each individual, combining preventative medicine, dentistry, full body wellness, and aesthetic services to cultivate a healthier, happier, and more empowered you.<br/><br/>We are deeply committed to fostering an environment where your emotional health, vitality, and lifestyle thrive, with personalised care that focuses on your long-term health and happiness. We don't just treat – we enable you to live a life full of balance, strength, and lasting wellness.",
  hasButton: false,
  buttonText: null,
  backgroundColor: "#F5F5F5",
  textColor: "#1D120C",
  buttonBackgroundColor: "#ECE8E3",
  buttonClickLink: "",
};

const FIRST_COMPONENT1 = {
  title: "A Holistic Approach to Longevity",
  descriptionText:
    "True longevity is about quality, not just years. Our integrative approach blends science and evidence-based practice to support mind, body, and spirit at every stage of life.<br/><br/>We take time to understand your health, goals, and lifestyle so every treatment contributes to lasting results, not quick fixes.",
};

const SCIENCE_COMPONENT1 = {
  title: "The Science of Balance and Well-being",
  descriptionText:
    "Well-being is a foundation, not a luxury. Drawing on research in medicine, psychology, dentistry, nutrition, and neuroscience, we design personalised care that builds resilience, clarity, and long-term health.<br/><br/>By recognising the powerful link between mind and body, we move beyond reactive medicine. The future is proactive, holistic care helping you thrive, flourish, and feel exactly how you want to feel.",
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
    <div id="" className="flex flex-col overflow-hidden">
      <HeroSection1
        title={HERO_SECTION_DATA.title}
        description={HERO_SECTION_DATA.description}
        heading={HERO_SECTION_DATA.heading}
        descTextSize={HERO_SECTION_DATA.descTextSize}
        descLineHeight={HERO_SECTION_DATA.descLineHeight}
        contentWidth={HERO_SECTION_DATA.contentWidth}
        backgroundColor={HERO_SECTION_DATA.backgroundColor}
        buttonColor={HERO_SECTION_DATA.buttonColor}
        titleFontSize="text-[20px] sm:text-[28px] md:text-[36px] lg:text-[50px] xl:text-[60px]"
        isVideo={false}
        backgroundContent={HERO_SECTION_DATA.backgroundContent}
      />

      {/* New Philosophy Section */}
      {/* <AboutUsSection
        description={PHILOSOPHY_SECTION.description}
        hasButton={PHILOSOPHY_SECTION.hasButton}
        buttonText={PHILOSOPHY_SECTION.buttonText}
        backgroundColor={PHILOSOPHY_SECTION.backgroundColor}
        textColor={PHILOSOPHY_SECTION.textColor}
        buttonBackgroundColor={PHILOSOPHY_SECTION.buttonBackgroundColor}
        buttonClickLink={PHILOSOPHY_SECTION.buttonClickLink}
      /> */}

      <Component1
        title={FIRST_COMPONENT1.title}
        descriptionText={FIRST_COMPONENT1.descriptionText}
        backgroundColor="#ECE8E3"
        titleFontSize="text-[18px] sm:text-[24px] md:text-[32px] lg:text-[42px] xl:text-[52px]"
      />
      <Component2
        title={SCIENCE_COMPONENT1.title}
        descriptionText={SCIENCE_COMPONENT1.descriptionText}
        backgroundColor="#DCD4C9"
        titleFontSize="text-[18px] sm:text-[24px] md:text-[32px] lg:text-[42px] xl:text-[52px]"
        imagePath={image2}
      />
      {/* <SupplementSection
        description={CONTACT_US_SECTION.description}
        buttonClickLink={CONTACT_US_SECTION.buttonClickLink}
        hasButton={CONTACT_US_SECTION.hasButton}
        buttonText={CONTACT_US_SECTION.buttonText}
        backgroundColor={CONTACT_US_SECTION.backgroundColor}
        textColor={CONTACT_US_SECTION.textColor}
        buttonBackgroundColor={CONTACT_US_SECTION.buttonBackgroundColor}
      /> */}
    </div>
  );
}

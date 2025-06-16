import HeroSection1 from "@/components/HeroSection"
import Component1 from "./components/Component1"
import Component2 from "./components/Component2"
import { image1 } from "@/assets/index"
import SupplementSection from "@/app/(landing)/components/SupplementSection"
import AboutUsSection from "@/components/AboutUsSection"

const HERO_SECTION_DATA = {
  title: "THE PURSUIT OF BALANCED FLOURISHING",
  description:
    "Life isn't simply about living longer — it's about living fully. A life filled with joy, enriching experiences, and moments that bring hope and excitement to each and every day.",
  descTextSize: 20,
  descLineHeight: 25,
  heading: "ASPIRE CLINIC'S PHILOSOPHY",
  contentWidth: 55,
  backgroundColor: "#ECE8E3",
  buttonColor: "#ECE8E3",
  backgroundContent: image1,
}

const PHILOSOPHY_SECTION = {
  description:
    "Our philosophy centres on the holistic care of each individual, combining preventative medicine, dentistry, full body wellness, and aesthetic services to cultivate a healthier, happier, and more empowered you.<br/><br/>We are deeply committed to fostering an environment where your emotional health, vitality, and lifestyle thrive, with personalised care that focuses on your long-term health and happiness. We don't just treat – we enable you to live a life full of balance, strength, and lasting wellness.",
  hasButton: false,
  buttonText: null,
  backgroundColor: "#F5F5F5",
  textColor: "#1D120C",
  buttonBackgroundColor: "#ECE8E3",
  buttonClickLink: "",
}

const FIRST_COMPONENT1 = {
  title: "A Holistic Approach to Longevity",
  descriptionText:
    "Our approach blends cutting-edge science with evidence-based practices to support your health, vitality, and well-being at every stage of life. It's no longer just about how long you live — it's about how much joy you feel along the way.<br/><br/>We go beyond quick fixes and isolated treatments. Instead, we take the time to understand you—your body, your lifestyle, and your goals.<br/><br/>From dental health and aesthetic treatments to wellness therapies and lifestyle guidance, everything we do is grounded in the belief that true longevity comes from balance: of mind, body, and spirit.<br/><br/>Whether you're here to prevent, restore, or enhance, our integrative approach ensures that every element of your care contributes to long-term health, not just short-term results. Because real longevity is intentional—and it starts today.",
}

const SCIENCE_COMPONENT1 = {
  title: "The Science of Balance and Well-being",
  descriptionText:
    "Well-being isn't a luxury—it's a foundation. At Aspire, we view health through a scientific lens, where every system in the body is interconnected and balance is key to optimal performance.<br/><br/>Our team draws from the latest research in medicine, psychology, dentistry, nutrition, and neuroscience to craft tailored strategies that support physical health, mental clarity, and emotional resilience.<br/><br/>We use in-depth consultations to create care plans that are as personal as they are effective, delivering long-term improvements that feel as good as they look.<br/><br/>For too long, the connection between our emotions, psychology, and physical health has been overlooked. But the evidence is now overwhelming—and deeply compelling.<br/><br/>By understanding the mind-body link, we can offer you a far richer opportunity to thrive in every aspect of life. Reactive medicine is a relic of the past—the future lies in a happier, healthier you.",
}

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
}

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
      <AboutUsSection
        description={PHILOSOPHY_SECTION.description}
        hasButton={PHILOSOPHY_SECTION.hasButton}
        buttonText={PHILOSOPHY_SECTION.buttonText}
        backgroundColor={PHILOSOPHY_SECTION.backgroundColor}
        textColor={PHILOSOPHY_SECTION.textColor}
        buttonBackgroundColor={PHILOSOPHY_SECTION.buttonBackgroundColor}
        buttonClickLink={PHILOSOPHY_SECTION.buttonClickLink}
      />
      
      <Component1
        title={FIRST_COMPONENT1.title}
        descriptionText={FIRST_COMPONENT1.descriptionText}
        backgroundColor="#ECE8E3"
        titleFontSize="text-[16px] sm:text-[20px] md:text-[28px] lg:text-[36px] xl:text-[44px]"
      />
      <Component1
        title={SCIENCE_COMPONENT1.title}
        descriptionText={SCIENCE_COMPONENT1.descriptionText}
        backgroundColor="#DCD4C9"
        titleFontSize="text-[18px] sm:text-[24px] md:text-[32px] lg:text-[42px] xl:text-[52px]"
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
  )
}
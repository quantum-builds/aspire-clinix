import { image1 } from "@/assets";
import HeroSection from "@/components/HeroSection";
import ServiceSection from "@/app/(landing)/components/ServicesSection";
import GeneralDentistryService from "@/app/(landing)/general-dentistry/components/GeneralDentistryService";
import ContactForm from "./components/ContactForm";

const HERO_SECTION_DATA = {
  heading: "CONTACT US",
  title: "OUR DEDICATED TEAM IS AT YOUR SERVICE",
  description:
    "Embark on your path to a healthier, revitalized you with just a click or call. Discover the luxury and expert care that make Aspire Clinic exceptional.",
  descTextSize: 32,
  descLineHeight: 36.36,
  contentWidth: 100,
  backgroundColor: "#FFFFFF",
  buttonColor: "#ECE8E3",
  backgroundContent: image1,
};

const CONTACT_INFO = {
  title: "Contact Us",
  isContact: true,
  phoneNumber: "+44 XXXXXXXXXX",
  email: "hello@aspireclinic.com",
  address: "27 Mortimer Street, W1N 7RJ, London, UK",
  container_side: "left",
  imagePath: image1,
};

export default function ContactUs() {
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
      <ContactForm />
      <GeneralDentistryService
        title={CONTACT_INFO.title}
        isContact={CONTACT_INFO.isContact}
        phoneNumber={CONTACT_INFO.phoneNumber}
        email={CONTACT_INFO.email}
        address={CONTACT_INFO.address}
        container_side={CONTACT_INFO.container_side}
        imagePath={CONTACT_INFO.imagePath}
      />
      <ServiceSection />
    </div>
  );
}

import HeroSection from "@/components/HeroSection"
import GeneralDentistryService from "@/app/(landing)/general-dentistry/components/GeneralDentistryService"
import { ClinicChair, Dentist1, DropDown4, DropDown8 } from "@/assets"
import AboutUsSection from "@/components/AboutUsSection"

const HERO_SECTION_DATA = {
  title: "General Dentistry",
  titleTextSize: 64,
  titleLineHeight: 72.64,
  description:
    "Your oral health is one of the foundations of your overall well-being—and at Aspire, we treat it with the care it deserves. Our general dentistry services go beyond check-ups and cleanings.",
  descTextSize: 32,
  descLineHeight: 36.36,
  contentWidth: 100,
  backgroundColor: "#D9D9D9",
  buttonColor: "#ECE8E3",
}

const GENERAL_DENTISTRY_SERVICE = [
  {
    title: "Fillings",
    description:
      "Fillings play a vital role in restoring teeth that have been affected by decay or minor damage",
    container_side: "left",
    imagePath: DropDown8,
    buttonLink: "/services/fillings",
  },

  {
    title: "Porcelain Crowns and Onlays",
    description:
      "Porcelain crowns and onlays are advanced solutions for restoring teeth that are heavily worn, damaged, or weakened",
    container_side: "right",
    imagePath: Dentist1,
    buttonLink: "/services/crowns-onlays",
  },

  {
    title: "Bridges and Denture Clinic",
    description:
      "Replacing missing teeth may be crucial not only for restoring your smile but also for maintaining proper bite function and oral health.",
    container_side: "left",
    imagePath: DropDown4,
    buttonLink: "/services/bridges-dentures",
  },
]

const ABOUT_US_SECTION_DATA = {
  description:
    "We take a proactive, prevention-first approach to protect your smile and support your long-term health. If you're experiencing a dental problem, it will be our pleasure to help. We'll guide you towards the solution that suits you best. Once resolved, our focus shifts to prevention — and doing everything we can to ensure you never face the same issue again. Your personalised prevention programme will be thoughtfully designed around you, your needs, and your long-term health.<br/><br/>From precise diagnostics and gentle hygiene treatments to advanced restorative care, every visit is designed to be calm, thorough, and tailored to your needs. We prioritise upmost patient comfort, clear honest two-way communication, and genuine clinical excellence. Kindness is at the heart of everything we do. From the moment you arrive, and every time you visit, you can expect to be treated with warmth, respect, and genuine care.<br/><br/>Whether you're maintaining your oral health or addressing specific concerns, our goal is to help you keep your natural teeth healthy, functional, and beautiful for life.",
  descriptionTextSize: 40,
  descriptionLeadingHeight: 45.4,
  hasButton: false,
  buttonText: null,
  backgroundColor: "#F5F5F5",
  textColor: "#1D120C",
}

const CARD_DATA = [
  {
    path: "/dr-richardporter",
    card_width: 424,
    buttonText: "Read Bio",
    card_height: 613,
    doc_name: "Dr. Richard Porter",
    backgroundContent: "/videos/general-dentistry-01.mp4",
    is_video: true,
  },
  {
    path: "/dr-raheelmalik",
    card_width: 424,
    buttonText: "Read Bio",
    card_height: 613,
    doc_name: "Dr. Raheel Malik",
    backgroundContent: "/videos/general-dentistry-02.mp4",
    is_video: true,
  },
  {
    path: "/dr-aspireclinic",
    card_width: 424,
    buttonText: "Read Bio",
    card_height: 613,
    doc_name: "Dr. Raheel Malik",
    backgroundContent: "/videos/landing-page-video-1.mp4",
    is_video: true,
  },
]

export default function GeneralDentistry() {
  return (
    <div className="flex flex-col" id="dentistry">
      <HeroSection
        title={HERO_SECTION_DATA.title}
        description={HERO_SECTION_DATA.description}
        contentWidth={HERO_SECTION_DATA.contentWidth}
        backgroundColor={HERO_SECTION_DATA.backgroundColor}
        buttonColor={HERO_SECTION_DATA.buttonColor}
        descLineHeight={36.6}
        titleFontSize="md:text-[45px] text-[25px] lg:text-[64px]"
        isVideo={false}
        backgroundContent={ClinicChair}
      />
      <AboutUsSection
        description={ABOUT_US_SECTION_DATA.description}
        hasButton={ABOUT_US_SECTION_DATA.hasButton}
        buttonText={ABOUT_US_SECTION_DATA.buttonText}
        backgroundColor={ABOUT_US_SECTION_DATA.backgroundColor}
        textColor={ABOUT_US_SECTION_DATA.textColor}
        buttonBackgroundColor="#ECE8E3"
        buttonClickLink=""
      />
      {GENERAL_DENTISTRY_SERVICE.map((service, index) => (
        <GeneralDentistryService
          key={index}
          title={service.title}
          description={service.description}
          container_side={service.container_side}
          imagePath={service.imagePath}
          buttonLink={service.buttonLink}
        />
      ))}
    </div>
  )
}

import HeroSection from "@/components/HeroSection";
import ServicePageCard from "../../service-page/components/ServicePageCard";
import { Dentist1, Dentist2, Dentist3, DropDown4 } from "@/assets";
import ServiceProvider from "../../components/ServiceProvider";

const SERVICE_PAGE_CARD_DATA = [
  {
    title: "Dental Implants",
    description:
      "Implants act as strong, stable foundations for crowns, bridges, or dentures, offering one of the most reliable ways to replace teeth. Whether you need to restore a single tooth or your full smile, every treatment plan is tailored to you—ensuring comfort, precision, and natural aesthetics.<br/><br/><strong>Our goal is simple:</strong> to give you a healthy, secure smile that looks and feels exactly as it should for life.",
    descrptionList: [
      "Restores function and confidence",
      "Strong, stable foundation for crowns or bridges",
      "Preserves bone and oral health",
      "Designed to last for decades",
      "Looks, feels, and functions like natural teeth",
    ],
    image: DropDown4,
    centerOnly: false,
  },
];

const CARD_DATA = [
  {
    path: "/dr-richardporter",
    cardWidth: 424,
    buttonText: "Read Bio",
    cardHeight: 613,
    docName: "Dr. Richard Porter",
    backgroundContent: Dentist1,
  },
  {
    path: "/dr-raheelmalik",
    cardWidth: 424,
    buttonText: "Read Bio",
    cardHeight: 613,
    docName: "Dr. Raheel Malik",
    backgroundContent: Dentist2,
  },
  {
    path: "/dr-liuxinyang",
    cardWidth: 424,
    buttonText: "Read Bio",
    cardHeight: 613,
    docName: "Dr. Liu Xin Yang",
    backgroundContent: Dentist3,
  },
];

export default function ServiceDetailPage() {
  return (
    <div className="flex flex-col w-full h-full">
      <HeroSection
        title="Dental Implants"
        description={
          "Dental implants are a long-lasting, natural-looking solution for missing teeth restoring both function and confidence. At Aspire, we use advanced techniques and world-leading implant systems designed to work in harmony with your body for predictable, lasting results."
        }
        backgroundColor="#1D120C"
        descLineHeight={40.86}
        buttonColor="#ECE8E3"
        textColor="white"
        titleFontSize="text-[35px] md:text-[60px] "
        heroScreenHieght="min-h-[55vh] md:min-h-[70vh]"
      />
      <div className="bg-feeGuide">
        {SERVICE_PAGE_CARD_DATA.map((data, index) => {
          return (
            <ServicePageCard
              key={index}
              title={data.title}
              description={data.description}
              descriptionList={data.descrptionList}
              {...(data.image && { image: data.image })}
              centerOnly={data.centerOnly}
            />
          );
        })}
      </div>
      <ServiceProvider
        text="The following clinicians provide Dental Implants at Aspire:"
        cardData={CARD_DATA}
      />
    </div>
  );
}

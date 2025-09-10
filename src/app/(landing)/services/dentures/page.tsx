import HeroSection from "@/components/HeroSection";
import ServicePageCard from "../../service-page/components/ServicePageCard";
import { Dentist1, Dentist2, Dentist3, DropDown4 } from "@/assets";
import ServiceProvider from "../../components/ServiceProvider";

const SERVICE_PAGE_CARD_DATA = [
  {
    title: "Denture Clinic",
    description:
      "At Aspire, we provide bespoke full and partial dentures designed to restore both function and confidence. Our team works closely with you tocreate solutions that fit comfortably, look natural, and support your overall oral health.<br/><br/>Using advanced techniques and high-quality, non-allergenic materials, we craft dentures that feel secure and look like natural teeth—helping you eat, speak, and smile with confidence every day.",
    descrptionList: [],
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
        title="Denture Clinic"
        description={
          "At Aspire, we provide bespoke full and partial dentures designed to restore both function and confidence. Our team works closely with you tocreate solutions that fit comfortably, look natural, and support your overall oral health.<br/><br/>Using advanced techniques and high-quality, non-allergenic materials, we craft dentures that feel secure and look like natural teeth—helping you eat, speak, and smile with confidence every day."
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
        text="The following clinicians provide Denture Clinic at Aspire:"
        cardData={CARD_DATA}
      />
    </div>
  );
}

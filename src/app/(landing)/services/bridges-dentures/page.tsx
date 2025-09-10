import HeroSection from "@/components/HeroSection";
import ServicePageCard from "../../service-page/components/ServicePageCard";
import { Dentist1, Dentist2, Dentist3, DropDown4 } from "@/assets";
import ServiceProvider from "../../components/ServiceProvider";

const SERVICE_PAGE_CARD_DATA = [
  {
    title: "Bridges and Denture Clinic",
    description:
      "At Aspire, we offer a variety of custom-made bridges and dentures to suit your individual needs and lifestyle.<br/><br/>Dental bridges are an excellent option for filling gaps left by missing teeth. They are designed to anchor securely to adjacent healthy teeth, providing a stable, definitive solution that restores your smile and bite.<br/><br/>Bridges may be either adhesive or conventional and can be made with a inert metal core or all ceramic. These options will be discussed with you in detail so you can make the choice that best suits you.<br/><br/>We offer a comprehensive range of denture services designed to restore both function and confidence. Whether you're looking for full or partial dentures, our experienced team works closely with you to create custom solutions that fit comfortably and naturally. Using the latest techniques and high-quality - non-allergenic materials, we ensure that your dentures not only enhance your smile but also improve your overall oral health.<br/><br/>Our goal is to provide you with dentures that look and feel like your natural teeth, helping you regain comfort and confidence in your daily life.",
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
        title="Bridges and Denture Clinic"
        description="Replacing missing teeth may be crucial not only for restoring your smile but also for maintaining proper bite function and oral health."
        backgroundColor="#1D120C"
        descLineHeight={40.86}
        buttonColor="#ECE8E3"
        textColor="white"
        titleFontSize="text-[35px] md:text-[60px]"
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
        text="The following clinicians provide Bridges and Denture Clinic at Aspire:"
        cardData={CARD_DATA}
      />
    </div>
  );
}

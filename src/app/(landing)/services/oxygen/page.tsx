import HeroSection from "@/components/HeroSection";
import ServicePageCard from "../../service-page/components/ServicePageCard";
import { Dentist1, Dentist2, Dentist3, DropDown4 } from "@/assets";
import ServiceProvider from "../../components/ServiceProvider";

const SERVICE_PAGE_CARD_DATA = [
  {
    title: "Hyperbaric Oxygen",
    description:
      "Unlock your body's true potential as every breath of enriched oxygen gently restores vitality, promotes deep cellular healing, and enhances your overall well-being.<br/><br/>By breathing in oxygen at higher-than-normal pressures, your body's cells are infused, aiding in faster recovery, improved circulation, and enhanced detoxification.",
    descrptionList: [
      "Accelerates recovery and cellular repair",
      "Improves circulation and oxygen delivery",
      "Supports immune function and detoxification",
      "Boosts energy and vitality",
      "Enhances skin health and anti-ageing",
    ],
    image: DropDown4,
    centerOnly: false,
  },
  {
    title: "Our Approach",
    description:
      "Simply sit back and relax as your body is infused with enriched oxygen awakening its natural ability to heal, restore, and thrive.",
    descrptionList: [],
    centerOnly: true,
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
        title="Hyperbaric Oxygen"
        description="Hyperbaric Oxygen Therapy is a powerful treatment designed to accelerate healing and promote wellness. It is completely safe, painless and effective."
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
              image={data.image}
              centerOnly={data.centerOnly}
            />
          );
        })}
      </div>
      <ServiceProvider
        text="The following clinicians provide Hyperbaric Oxygen at Aspire:"
        cardData={CARD_DATA}
      />
    </div>
  );
}

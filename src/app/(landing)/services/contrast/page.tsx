import HeroSection from "@/components/HeroSection";
import ServicePageCard from "../../service-page/components/ServicePageCard";
import { Dentist1, Dentist2, Dentist3, DropDown4 } from "@/assets";
import ServiceProvider from "../../components/ServiceProvider";

const SERVICE_PAGE_CARD_DATA = [
  {
    title: "Contrast Therapy",
    description:
      "Contrast Therapy combines the powerful benefits of heat and cold to support recovery, improve circulation, and ease muscle tension. By alternating between hot and cold treatments, this therapy stimulates the body's natural healing processes, helping to reduce inflammation, relieve soreness, and boost overall vitality.<br/><br/>Designed to enhance recovery, reduce stress, and improve energy levels, each session is tailored to fit your specific wellness goals, leaving you feeling refreshed, revitalised, and balanced.<br/><br/>The use of alternating hot and cold therapy known as contrast therapy is well supported by scientific evidence for promoting enhanced healing, recovery, and resilience across a range of conditions and wellness goals.",
    descrptionList: [
      "Speeds up recovery after exercise",
      "Reduces muscle soreness and stiffness",
      "Boosts circulation and energy",
      "Lowers stress and restores balance",
      "Strengthens overall resilience",
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
        title="Contrast Therapy"
        description={
          "Contrast therapy alternates hot and cold treatments to trigger the body’s natural healing response"
        }
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
        text="The following clinicians provide Contrast Therapy at Aspire:"
        cardData={CARD_DATA}
      />
    </div>
  );
}

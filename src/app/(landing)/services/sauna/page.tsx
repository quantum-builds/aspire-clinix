import HeroSection from "@/components/HeroSection";
import ServicePageCard from "../../service-page/components/ServicePageCard";
import { Dentist1, Dentist2, Dentist3, DropDown4, DropDown8 } from "@/assets";
import ServiceProvider from "../../components/ServiceProvider";

const SERVICE_PAGE_CARD_DATA = [
  {
    title: "Infrared Sauna",
    description:
      "Using infrared wavelengths of healing light, this therapy penetrates deep beyond the skin to stimulate your body's natural healing processes, helping to relieve muscle tension, reduce stress, and promote better sleep.<br/><br/>Every cell in your body runs on an energy source and our Sunlighten Sauna refills the batteries providing that energy. The results can be remarkable to every system and part of your body.",
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
  {
    title: "What can you expect?",
    description:
      "<strong>IMPROVED CARDIOVASCULAR HEALTH:</strong><br/>Improved circulation: Infrared heat increases core body temperature, dilating blood vessels, boosting circulation, and reducing arterial stiffness. Blood pressure regulation: Regular infrared sauna sessions have shown potential for lowering blood pressure, contributing significantly to cardiovascular disease prevention.<br/><br/><strong>MUSCLE RELAXATION AND PAIN RELIEF:</strong><br/>Reduction in muscle tension: Heat from infrared penetrates deeply, promoting muscle relaxation, reducing spasms, and alleviating chronic pain conditions such as Tension Myositis Syndrome (TMS). Joint health improvement: Infrared therapy has shown effectiveness in managing arthritis and chronic pain through reduced inflammation and enhanced joint mobility.<br/><br/><strong>IMPROVED SKIN HEALTH AND ANTI AGING AFFECT:</strong><br/>Collagen stimulation: Near-infrared wavelengths promote collagen production, reducing wrinkles, improving elasticity, and promoting faster wound healing. Improved skin appearance: Regular infrared sauna use leads to clearer, healthier skin through enhanced circulation, toxin removal, and cellular regeneration.",
    descrptionList: [],
    image: DropDown8,
    reverse: true,
    centerOnly: false,
  },
  {
    title: "Our Approach",
    description:
      "Each session is personalised to your goals, helping you feel refreshed, energised, and in balance.",
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
        title="Infrared Sauna"
        description="Our Sunlighten Infrared Sauna offers a relaxing and rejuvenating experience that promotes deep detoxification, improved circulation, and enhanced relaxation."
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
              reverse={data.reverse}
              centerOnly={data.centerOnly}
            />
          );
        })}
      </div>
      <ServiceProvider
        text="The following clinicians provide Infrared Sauna at Aspire:"
        cardData={CARD_DATA}
      />
    </div>
  );
}

import HeroSection from "@/components/HeroSection";
import ServicePageCard from "../../service-page/components/ServicePageCard";
import { Dentist1, Dentist2, Dentist3, DropDown4 } from "@/assets";
import ServiceProvider from "../../components/ServiceProvider";

const SERVICE_PAGE_CARD_DATA = [
  {
    title: "IV Lounge",
    description:
      "Revitalise your body and mind at Aspire's IV Lounge, where personalised intravenous treatments deliver essential nutrients, vitamins, and hydration directly to your bloodstream.<br/><br/>Most people suffer from deficiencies and that can be due to natural decline, a gap in your nourishment or indeed illness and poor health. Delivery of an infusion tailored to meet your exact needs can have an immediate powerful and long lasting beneficial effect.",
    descrptionList: [
      "Corrects nutrient deficiencies quickly",
      "Boosts energy and focus",
      "Supports immune function",
      "Improves skin health and hydration",
      "Helps combat fatigue and stress",
    ],
    image: DropDown4,
    centerOnly: false,
  },
  {
    title: "Our Approach",
    description:
      "Relax in a calming environment while your bespoke IV infusion restores balance, leaving you recharged, refreshed, and revitalised.",
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
        title="IV Lounge"
        description={
          "Our IV Lounge delivers tailored infusions of vitamins, nutrients, and hydration directly into the bloodstream for rapid results."
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
        text="The following clinicians provide IV Lounge at Aspire:"
        cardData={CARD_DATA}
      />
    </div>
  );
}

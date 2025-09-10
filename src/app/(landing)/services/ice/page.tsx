import HeroSection from "@/components/HeroSection";
import ServicePageCard from "../../service-page/components/ServicePageCard";
import { Dentist1, Dentist2, Dentist3, DropDown4 } from "@/assets";
import ServiceProvider from "../../components/ServiceProvider";

const SERVICE_PAGE_CARD_DATA = [
  {
    title: "Ice Baths",
    description:
      "Ice Baths are a powerful and dynamic recovery tool that helps reduce muscle soreness, promote healing, and boost overall wellness. They offer a huge dopamine hit to anyone who uses them!<br/><br/>By immersing the body in cold water, this therapy reduces inflammation, flushes out toxins, and supports faster recovery. Ideal for athletes or anyone seeking quick relief after intense physical activity, ice baths also enhance circulation and improve mental focus.<br/><br/>Many clients seek guidance when deciding which form of cold exposure is right for them and we're always happy to help you make the best choice for your needs and goals.",
    descrptionList: [],
    image: DropDown4,
    centerOnly: false,
  },
  {
    description:
      "<strong>The Deep Effects</strong><br/><br/><strong>Depth of Effect:</strong> Cold water immersion penetrates deeper, rapidly affecting deep muscle tissue, joints, and the core temperature, resulting in potent systemic anti-inflammatory responses.<br/><br/><strong>Emotional Response:</strong> Ice baths trigger a robust activation of the calming parasympathetic nervous system post-immersion, facilitating deep relaxation afterward and profound restorative sleep.<br/><br/><strong>Circulation:</strong> Intense constriction of your bodies out blood vessels occurs rapidly, followed by significant rebound upon warming, promoting deep circulatory enhancement and metabolic waste clearance.<br/><br/></br><strong>Our Approach</strong></br></br>We guide you through every stage, starting gently if needed, so you build confidence and resilience while experiencing the powerful benefits of cold immersion.",
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
        title="Ice Baths"
        description={
          "Ice baths provide an invigorating reset for both body and mind, using deep cold immersion to reduce inflammation and boost recovery."
        }
        backgroundColor="#1D120C"
        descLineHeight={40.86}
        buttonColor="#ECE8E3"
        textColor="white"
        titleFontSize="text-[35]px md:text-[60px]"
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
        text="The following clinicians provide Ice Baths at Aspire:"
        cardData={CARD_DATA}
      />
    </div>
  );
}

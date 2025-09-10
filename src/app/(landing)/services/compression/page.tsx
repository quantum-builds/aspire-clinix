import HeroSection from "@/components/HeroSection";
import ServicePageCard from "../../service-page/components/ServicePageCard";
import { Dentist1, Dentist2, Dentist3, DropDown4 } from "@/assets";
import ServiceProvider from "../../components/ServiceProvider";

const SERVICE_PAGE_CARD_DATA = [
  {
    title: "Compression Therapy",
    description:
      "Experience the rejuvenating benefits of Compression Therapy at Aspire. This non-invasive treatment uses controlled pressure to stimulate circulation, reduce swelling, and enhance lymphatic drainage.<br/><br/>Ideal for those seeking relief from muscle tension, soreness, or inflammation, our advanced compression therapy technology promotes quicker recovery and boosts overall well-being.",
    descrptionList: [
      "Reduces swelling and fluid retention",
      "Speeds up muscle recovery",
      "Improves lymphatic drainage",
      "Relieves soreness and fatigue",
    ],
    image: DropDown4,
    centerOnly: false,
  },
  {
    title: "Our Approach",
    description:
      "Comfortable and non-invasive, this therapy is personalised to support recovery and leave you feeling refreshed and energised.",
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
        title="Compression Therapy"
        description={
          "Compression therapy uses controlled pressure to stimulate circulation and recovery."
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
        text="The following clinicians provide Compression Therapy at Aspire:"
        cardData={CARD_DATA}
      />
    </div>
  );
}

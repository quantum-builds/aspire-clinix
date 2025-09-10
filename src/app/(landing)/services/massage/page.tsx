import HeroSection from "@/components/HeroSection";
import ServicePageCard from "../../service-page/components/ServicePageCard";
import { Dentist1, Dentist2, Dentist3, DropDown4 } from "@/assets";
import ServiceProvider from "../../components/ServiceProvider";

const SERVICE_PAGE_CARD_DATA = [
  {
    title: "Massage",
    description:
      "Our Massage Therapy services at Aspire are designed to relax both body and mind, helping to ease tension, improve circulation, and enhance overall wellness.<br/><br/>Whether you're seeking relief from muscle stiffness, stress, or simply want to unwind, our skilled therapists use a variety of techniques tailored to your specific needs.<br/><br/>Human touch is not a luxury but a fundamentally therapeutic experience that heals and nourishes us. Combined with massage expertise we can ensure you leave feeling your massage has made you feel nothing short of amazing.",
    descrptionList: [
      "Reduces stress and muscle tightness",
      "Improves flexibility and circulation",
      "Relieves aches, pains, and stiffness",
      "Promotes deep relaxation and better sleep",
      "Enhances overall well-being",
    ],
    image: DropDown4,
    centerOnly: false,
  },
  {
    title: "Our Approach",
    description:
      "With expert therapeutic touch, each session is tailored to your needs leaving you feeling lighter, calmer, and renewed.",
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
        title="Massage"
        description={
          "Massage at Aspire relieves tension, improves circulation, and restores harmony between body and mind."
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
        text="The following clinicians provide Massage at Aspire:"
        cardData={CARD_DATA}
      />
    </div>
  );
}

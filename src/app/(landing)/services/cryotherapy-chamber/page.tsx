import HeroSection from "@/components/HeroSection";
import ServicePageCard from "../../service-page/components/ServicePageCard";
import { Dentist1, Dentist2, Dentist3, DropDown4 } from "@/assets";
import ServiceProvider from "../../components/ServiceProvider";

const SERVICE_PAGE_CARD_DATA = [
  {
    title: "Cryotherapy Chamber",
    description:
      "Cryotherapy uses controlled cold exposure to reduce inflammation, speed recovery, and refresh body and mind.",
    descrptionList: [
      "Relieves soreness and aids recovery",
      "Reduces inflammation and swelling",
      "Enhances mood, calmness, and mental clarity",
      "Boosts energy and metabolism",
      "Supports overall well-being and resilience",
    ],
    image: DropDown4,
    centerOnly: false,
  },
  {
    title: "Our Approach",
    description:
      "Our team guides you safely through every session, tailoring the experience to your comfort and goals so you leave feeling revitalised and restored.",
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
        title="Cryotherapy Chamber"
        description="Cryotherapy is a cutting-edge wellness treatment that harnesses the power of cold to promote recovery, dramatically reduce inflammation, and boost overall well-being."
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
        text="The following clinicians provide Cryotherapy Chamber at Aspire:"
        cardData={CARD_DATA}
      />
    </div>
  );
}

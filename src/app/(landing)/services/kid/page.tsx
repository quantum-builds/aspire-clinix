import HeroSection from "@/components/HeroSection";
import ServicePageCard from "../../service-page/components/ServicePageCard";
import { Dentist1, Dentist2, Dentist3, DropDown4, DropDown8 } from "@/assets";
import ServiceProvider from "../../components/ServiceProvider";

const SERVICE_PAGE_CARD_DATA = [
  {
    title: "Kids Clinic",
    description:
      "From routine check-ups to more specialised care, we provide the full range of children’s dentistry, ensuring comfort and confidence at every stage.",
    descrptionList: [
      "Fun, stress-free dental visits",
      "Early prevention of dental issues",
      "Builds confidence and trust in dentistry",
      "Specialist care for complex cases",
      "Encourages positive lifelong oral habits",
    ],
    image: DropDown4,
    centerOnly: false,
  },
  {
    title: "General and Specialist Care",
    description:
      "Most children are cared for by a general dentist for routine check-ups and everyday dental needs. A referral to a specialist is usually only recommended in cases of more complex concerns such as extensive decay, developmental dental conditions, or significant dental anxiety.",
    descrptionList: [],
    image: DropDown8,
    reverse: true,
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
        title="Kids Clinic"
        description={
          "At Aspire, we create a welcoming, child-friendly environment where dental visits are fun, gentle, and stress-free. Our team focuses on building positive experiences, supporting oral health, and helping children develop healthy habits for life."
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
              {...(data.image && { image: data.image })}
              reverse={data.reverse}
              centerOnly={data.centerOnly}
            />
          );
        })}
      </div>
      <ServiceProvider
        text="The following clinicians provide Kids Clinic at Aspire:"
        cardData={CARD_DATA}
      />
    </div>
  );
}

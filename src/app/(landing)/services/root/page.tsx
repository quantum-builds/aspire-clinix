import HeroSection from "@/components/HeroSection";
import ServicePageCard from "../../service-page/components/ServicePageCard";
import { Dentist1, Dentist2, Dentist3, DropDown4, DropDown8 } from "@/assets";
import ServiceProvider from "../../components/ServiceProvider";

const SERVICE_PAGE_CARD_DATA = [
  {
    title: "Root Canal Clinic",
    description:
      "Root canal treatment (Endodontics) is often the best way to preserve a natural tooth that has been damaged by decay or trauma reaching the nerve. When performed at the right time, it can prevent the need for extraction and help maintain your long-term oral health.",
    descrptionList: [
      "Preserves natural teeth after trauma or decay",
      "Relieves pain and infection",
      "Prevents the need for extraction",
      "Advanced imaging for precision treatment",
      "Surprisingly comfortable experience",
    ],
    image: DropDown4,
    centerOnly: false,
  },
  {
    description:
      "<strong>Expert Care</strong><br/><br/>Our specialist team uses advanced techniques, 3D scanning, and microscopic precision to deliver effective, gentle treatment that preserves compromised teeth with the highest level of care.<br/><br/><strong>Comfortable Experience</strong><br/><br/> Despite its reputation, root canal treatment is often more comfortable than expected. With our calm surroundings, supportive team, and exceptionally comfortable chairs, patients frequently find the experience surprisingly relaxing.<br/><br/><strong>Personalised Consultation</strong><br/><br/>As root canal therapy is sometimes the last chance to save a tooth, it isn’t always suitable. We carry out a thorough consultation and examination to ensure you fully understand your options and feel confident in your decision.",
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
        title="Root Canal Clinic"
        description="Root canal treatment (Endodontics) is often the best way to preserve a natural tooth that has been damaged by decay or trauma reaching the nerve. When performed at the right time, it can prevent the need for extraction and help maintain your long-term oral health."
        backgroundColor="#1D120C"
        descLineHeight={40.86}
        buttonColor="#ECE8E3"
        textColor="white"
        titleFontSize="text-[35px] md:text-[60px] "
        heroScreenHieght="min-h-[55vh] md:min-h-[70vh]"
      />
      <div className="bg-feeGuide">
        {SERVICE_PAGE_CARD_DATA.map((data, index) => {
          return (
            <ServicePageCard
              key={index}
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
        text="The following clinicians provide Root Canal Clinic at Aspire:"
        cardData={CARD_DATA}
      />
    </div>
  );
}

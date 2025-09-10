import HeroSection from "@/components/HeroSection";
import ServicePageCard from "../../service-page/components/ServicePageCard";
import { Dentist1, Dentist2, Dentist3, DropDown4 } from "@/assets";
import ServiceProvider from "../../components/ServiceProvider";

const SERVICE_PAGE_CARD_DATA = [
  {
    title: "Fillings",
    description:
      "At Aspire, we use strong, natural-looking composite materials designed to blend beautifully with your existing teeth.<br/><br/>We do not use toxic metallic materials anywhere on site. If you have these already and they are removed strict protocols will be used to ensure you are protected and safe at all times.<br/><br/>Our approach focuses on preserving as much of the healthy tooth as possible through minimally invasive techniques, ensuring both function and aesthetics are restored. Every treatment is carefully planned and carried out with precision so you can feel confident in a result that looks and feels just right.<br/><br/>Once your treatment is complete, you'll be invited to take part in our personalised prevention programme if you do need a filling, it may well be the last one you ever need.",
    descrptionList: [],
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
        title="Fillings"
        description="Fillings play a vital role in restoring teeth that have been affected by decay or minor damage, helping to maintain tooth structure and avoid more extensive treatment in the future."
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
        text="The following clinicians provide Fillings at Aspire:"
        cardData={CARD_DATA}
      />
    </div>
  );
}

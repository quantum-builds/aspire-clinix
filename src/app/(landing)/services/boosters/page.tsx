import HeroSection from "@/components/HeroSection";
import ServicePageCard from "../../service-page/components/ServicePageCard";
import { Dentist1, Dentist2, Dentist3, DropDown4 } from "@/assets";
import ServiceProvider from "../../components/ServiceProvider";

const SERVICE_PAGE_CARD_DATA = [
  {
    title: "Skin Boosters",
    description:
      "Our Skin Boosters are designed to deeply hydrate nd rejuvenate your skin from within, restoring a radiant, glowing complexion. Using advanced techniques, we deliver targeted treatments that enhance skin texture, improve elasticity, and promote long-lasting hydration. Ideal for those seeking a natural, refreshed look, skin boosters help revitalise your skin's appearance, leaving it smoother, plumper, and more youthful.",
    descrptionList: [
      "Deeply hydrates tired, dull skin",
      "Improves elasticity and firmness",
      "Reduces fine lines and uneven texture",
      "Restores a youthful, radiant glow",
      "Restores a youthful, radiant glow",
    ],
    image: DropDown4,
    centerOnly: false,
  },
  {
    title: "Our Approach",
    description:
      "We design each treatment around your skin’s unique needs, helping you achieve a natural, refreshed, and luminous complexion.",
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
        title="Skin Boosters"
        description={
          "Skin boosters hydrate and rejuvenate skin from within, improving texture, glow, and elasticity."
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
              centerOnly={data.centerOnly}
            />
          );
        })}
      </div>
      <ServiceProvider
        text="The following clinicians provide Skin Boosters at Aspire:"
        cardData={CARD_DATA}
      />
    </div>
  );
}

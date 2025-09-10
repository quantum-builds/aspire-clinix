import HeroSection from "@/components/HeroSection";
import ServicePageCard from "../../service-page/components/ServicePageCard";
import { Dentist1, Dentist2, Dentist3, DropDown4, DropDown8 } from "@/assets";
import ServiceProvider from "../../components/ServiceProvider";

const SERVICE_PAGE_CARD_DATA = [
  {
    title: "Porcelain Crowns and Onlays",
    description:
      "We use highest quality, tooth coloured porcelain to achieve results that are both durable and virtually indistinguishable from your natural teeth. Often they can create an aesthetic result that is better than the natural tooth.<br/><br/>Onlays are ideal for reinforcing weaker back teeth if they have been damaged by larger cavities, tooth wear or fractures. Crowns offer full coverage for teeth that need more extensive support and onlays are similarly effective but require far less natural tooth removal.<br/><br/>Each restoration is custom-made for a precise fit and a seamless appearance, using techniques that prioritise longevity and tooth tissue preservation. A tooth with a large filling may have a remaining fracture resistance of under 20%, an onlay can improve this to over 90%. This means the best time to have an onlay is before the tooth fractures!<br/><br/>Our careful, minimally invasive approach ensures lasting results that not only function beautifully, but also enhance the overall aesthetics of your smile.",
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
        title="Porcelain Crowns and Onlays"
        description="Porcelain crowns and onlays are advanced solutions for restoring teeth that are heavily worn, damaged, or weakened helping to protect and preserve them while restoring their former beauty, natural shape and strength."
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
        text="The following clinicians provide Porcelain Crowns and Onlays at Aspire:"
        cardData={CARD_DATA}
      />
    </div>
  );
}

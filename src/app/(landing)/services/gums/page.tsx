import HeroSection from "@/components/HeroSection";
import ServicePageCard from "../../service-page/components/ServicePageCard";
import { Dentist1, Dentist2, Dentist3, DropDown4, DropDown8 } from "@/assets";
import ServiceProvider from "../../components/ServiceProvider";

const SERVICE_PAGE_CARD_DATA = [
  {
    title: "Gums Clinic",
    description:
      "We know that losing a tooth is never planned, so we make the experience as smooth, painless, and stress-free as possible. Our clinicians are highly experienced in both simple and advanced procedures, with referrals to accredited oral surgery specialists only when additional risk factors are present.<br/><br/>With precision, care, and reassurance at every stage, we prioritise your comfort and safety throughout.",
    descrptionList: [
      "Safe removal of wisdom teeth and other problem teeth",
      "Reduces pain, infection, and complications",
      "Experienced care in simple and complex cases",
      "Accredited specialists for high-risk procedures",
      "Calm, supportive experience throughout",
    ],
    image: DropDown4,
    centerOnly: false,
  },
  {
    title: "The science of gum health Periodontology",
    description:
      "Periodontology is the branch of dentistry focused on the health of your gums, and the science is clear: the condition of your gums can have a profound impact on your overall health.<br/><br/>That's why our entire team is committed to helping you avoid gum problems altogether and, if they do arise, to resolving them swiftly and effectively.",
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
        title="Gum Clinic"
        description="Your gums are the foundation of a strong, beautiful smile. Having healthy and beautiful gums is a key foundation to all dental health and offer your teeth and smile protection they deserve."
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
        text="The following clinicians provide Gum Clinic at Aspire:"
        cardData={CARD_DATA}
      />
    </div>
  );
}

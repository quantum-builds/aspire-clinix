import HeroSection from "@/components/HeroSection";
import ServicePageCard from "./components/ServicePageCard";
import { DropDown4, DropDown8 } from "@/assets";

const SERVICE_PAGE_CARD_DATA = [
  {
    title: "Dental Bridges",
    description:
      "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit.\n\n Lorem ipsum odor amet, consectetuer adipiscing elit. \nSociosqu a nec magna habitant nec. Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. \n\nLorem ipsum odor amet, consectetuer adipiscing elit. \nSociosqu a nec magna habitant nec. Ullamcorper dui varius volutpat primis lacinia elit morbi velit.",
    descrptionList: [
      "Lorem ipsum odor amet, consectetuer adipiscing elit.",
      "Lorem ipsum odor amet, consectetuer adipiscing elit.",
      "Lorem ipsum odor amet, consectetuer adipiscing elit.",
      "Lorem ipsum odor amet, consectetuer adipiscing elit.",
    ],
    image: DropDown4,
  },
  {
    title: "Dental Crowns",
    description:
      "Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit.\n\n Lorem ipsum odor amet, consectetuer adipiscing elit. \nSociosqu a nec magna habitant nec. Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Ullamcorper dui varius volutpat primis lacinia elit morbi velit. Lorem ipsum odor amet, consectetuer adipiscing elit. \n\nLorem ipsum odor amet, consectetuer adipiscing elit. \nSociosqu a nec magna habitant nec. Ullamcorper dui varius volutpat primis lacinia elit morbi velit.",
    descrptionList: [
      "Lorem ipsum odor amet, consectetuer adipiscing elit.",
      "Lorem ipsum odor amet, consectetuer adipiscing elit.",
      "Lorem ipsum odor amet, consectetuer adipiscing elit.",
      "Lorem ipsum odor amet, consectetuer adipiscing elit.",
    ],
    image: DropDown8,
  },
];
export default function ServiceDetailPage() {
  return (
    <div className="flex flex-col w-full h-full">
      <HeroSection
        title="Dental Treatment Fee Guide"
        description="Lorem ipsum odor amet, consectetuer adipiscing elit. 
    Sociosqu a nec magna habitant nec. Ullamcorper dui varius volutpat primis lacinia elit morbi velit"
        backgroundColor="#1D120C"
        descLineHeight={40.86}
        buttonColor="#ECE8E3"
        textColor="white"
        titleFontSize="text-[35px] md:text-[60px]"
        heroScreenHieght="min-h-[55vh] md:min-h-[70vh]"
      />
      <div className="bg-feeGuide">
        {SERVICE_PAGE_CARD_DATA.map((data) => {
          return (
            <ServicePageCard
              title={data.title}
              description={data.description}
              descriptionList={data.descrptionList}
              image={data.image}
            />
          );
        })}
      </div>

      <div className="flex justify-center items-center mx-0 px-3 lg:mx-auto min-h-[40vh] lg:min-h-[70vh] bg-feeGuide w-full py-[4%] xl:py-0">
        <video
          className="top-0 left-0 w-full h-full object-cover lg:w-[70vw] xl:w-[50vw] lg:h-[50vh] xl:h-[60vh]"
          src="/videos/landing-page-video-1.mp4"
          controls
          loop
          preload="auto"
        ></video>
      </div>
    </div>
  );
}

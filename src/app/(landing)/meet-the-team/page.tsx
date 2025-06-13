import { Dentist1, Dentist2, Dentist3, image1 } from "@/assets";
import HeroSection from "@/components/HeroSection";
import ServiceDetailCard from "@/components/ServiceDetailCard";

const CARD_DATA = [
  {
    path: "/dr-richardporter",
    card_width: 424,
    buttonText: "Read Bio",
    card_height: 613,
    doc_name: "Dr. Richard Porter",
    backgroundContent: Dentist1,
  },
  {
    path: "/dr-raheelmalik",
    card_width: 424,
    buttonText: "Read Bio",
    card_height: 613,
    doc_name: "Dr. Raheel Malik",
    backgroundContent: Dentist2,
  },
  {
    path: "/dr-liuxinyang",
    card_width: 424,
    buttonText: "Read Bio",
    card_height: 613,
    doc_name: "Dr. Liu Xin Yang",
    backgroundContent: Dentist3,
  },
  {
    path: "/dr-alexanderhorsham",
    card_width: 424,
    buttonText: "Read Bio",
    card_height: 613,
    doc_name: "Dr. Alexander Horsham",
    backgroundContent: Dentist1,
  },
  {
    path: "/dr-muhammedisham",
    card_width: 424,
    buttonText: "Read Bio",
    card_height: 613,
    doc_name: "Dr. Muhammed Isham",
    backgroundContent: Dentist2,
  },
  {
    path: "/dr-liuxinyang",
    card_width: 424,
    buttonText: "Read Bio",
    card_height: 613,
    doc_name: "Dr. Liu Xin Yang",
    backgroundContent: Dentist3,
  },
  {
    path: "/dr-alexanderhorsham",
    card_width: 424,
    buttonText: "Read Bio",
    card_height: 613,
    doc_name: "Dr. Alexander Horsham",
    backgroundContent: Dentist1,
  },
  {
    path: "/dr-muhammedisham",
    card_width: 424,
    buttonText: "Read Bio",
    card_height: 613,
    doc_name: "Dr. Muhammed Isham",
    backgroundContent: Dentist2,
  },
];

const HERO_SECTION_DATA = {
  title: "Meet the Team",
  titleTextSize: 64,
  titleLineHeight: 72.64,
  description:
    "Lorem ipsum odor amet, consectetuer adipiscing elit. Sociosqu a nec magna habitant nec. Ullamcorper dui varius volutpat primis lacinia elit morbi velit.",
  descTextSize: 32,
  descLineHeight: 36.36,
  contentWidth: 100,
  backgroundColor: "#D9D9D9",
  buttonColor: "#EBEBEB",
};

export default function GeneralDentistry() {
  return (
    <div className="flex flex-col" id="dentistry">
      <HeroSection
        title={HERO_SECTION_DATA.title}
        backgroundColor={HERO_SECTION_DATA.backgroundColor}
        buttonColor={HERO_SECTION_DATA.buttonColor}
        description={HERO_SECTION_DATA.description}
        contentWidth={HERO_SECTION_DATA.contentWidth}
        descLineHeight={HERO_SECTION_DATA.descLineHeight}
        titleFontSize="md:text-[45px] text-[25px] lg:text-[64px]"
        isVideo={false}
        backgroundContent={image1}
      />
      <div className="zoom-out bg-footerBackground flex flex-col gap-16 md:gap-20 lg:gap-28 w-full mx-auto min-h-screen py-[5%]">
        <div className="flex flex-col w-full gap-16 md:gap-20 lg:gap-28 lg:px-12">
          {/* First Row - 2 Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 md:gap-x-4 lg:gap-x-16 gap-y-16 md:gap-y-20 lg:gap-y-28 justify-items-center mx-0 md:mx-auto">
            {CARD_DATA.slice(0, 2).map((card, index) => (
              <ServiceDetailCard
                key={index}
                path={card.path}
                backgroundContent={card.backgroundContent}
                card_width={card.card_width}
                buttonText={card.buttonText}
                card_height={card.card_height}
                doc_name={card.doc_name}
                className="w-[320px] sm:w-[360px] md:w-[424px] h-auto xl:w-[380px] 2xl:w-[424px]"
              />
            ))}
          </div>

          {/* Remaining Rows - 3 Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 lg:gap-x-8 gap-y-16 md:gap-y-20 lg:gap-y-28 justify-items-center  mx-0 md:mx-auto">
            {CARD_DATA.slice(2).map((card, index) => (
              <ServiceDetailCard
                key={index + 2}
                path={card.path}
                backgroundContent={card.backgroundContent}
                card_width={card.card_width}
                buttonText={card.buttonText}
                card_height={card.card_height}
                doc_name={card.doc_name}
                className="w-[320px] sm:w-[360px] md:w-[424px] h-auto xl:w-[380px] 2xl:w-[424px]"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

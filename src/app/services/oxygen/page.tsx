import HeroSection from "@/components/HeroSection"
import ServicePageCard from "../../(landing)/service-page/components/ServicePageCard"
import { DropDown4 } from "@/assets"

const SERVICE_PAGE_CARD_DATA = [
  {
    title: "Hyperbaric Oxygen",
    description:
      "Hyperbaric Oxygen Therapy is a powerful treatment designed to accelerate healing and promote overall wellness. It is completely safe, painless and effective.<br/><br/>Unlock your body's true potential as every breath of enriched oxygen gently restores vitality, promotes deep cellular healing, and enhances your overall well-being.<br/><br/>By breathing in oxygen at higher-than-normal pressures, your body's cells are infused, aiding in faster recovery, improved circulation, and enhanced detoxification.<br/><br/>This incredible therapy supports everything from injury recovery to boosting energy levels and improving skin health. Now you can experience the future of wellness as pure oxygen bathes every cell, awakening your body's innate ability to heal and thrive.<br/><br/>When you attend the clinic we will ensure we provide a calm and supportive environment where each session is tailored to help you achieve maximum healing potential, leaving you feeling revitalised and empowered. There's nothing for you to worry about — simply sit back, take a deep breath, and allow the healing to begin.",
    descrptionList: [],
    image: DropDown4,
    centerOnly: false,
  },
]

export default function ServiceDetailPage() {
  return (
    <div className="flex flex-col w-full h-full">
      <HeroSection
        title="Hyperbaric Oxygen"
        description="Hyperbaric Oxygen Therapy is a powerful treatment designed to accelerate healing and promote overall wellness. It is completely safe, painless and effective."
        backgroundColor="#1D120C"
        descLineHeight={40.86}
        buttonColor="#ECE8E3"
        textColor="white"
        titleFontSize="md:text-[48px] text-[25px]"
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
          )
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
  )
}

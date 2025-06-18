import HeroSection from "@/components/HeroSection"
import ServicePageCard from "../../(landing)/service-page/components/ServicePageCard"
import { DropDown4 } from "@/assets"

const SERVICE_PAGE_CARD_DATA = [
  {
    title: "IV Lounge",
    description:
      "Revitalise your body and mind at Aspire's IV Lounge, where personalised intravenous treatments deliver essential nutrients, vitamins, and hydration directly to your bloodstream.<br/><br/>Most people suffer from deficiencies and that can be due to natural decline, a gap in your nourishment or indeed illness and poor health. Delivery of an infusion tailored to meet your exact needs can have an immediate powerful and long lasting beneficial effect.<br/><br/>Whether you're recovering from a busy week, looking to manage the effects of stress on your body, combating fatigue, or simply boosting your energy levels, our tailored IV therapy options are designed to meet your exact needs and you can choose the right treatment for you.<br/><br/>This will require nothing more than for you to relax in a luxurious stunning and tranquil environment as you replenish and rejuvenate—enhancing everything from immune function to skin health.<br/><br/>Indulge in a moment of self-care and leave feeling refreshed and recharged.",
    descrptionList: [],
    image: DropDown4,
    centerOnly: false,
  },
]

export default function ServiceDetailPage() {
  return (
    <div className="flex flex-col w-full h-full">
      <HeroSection
        title="IV Lounge"
        description="Revitalise your body and mind at Aspire's IV Lounge, where personalised intravenous treatments deliver essential nutrients, vitamins, and hydration directly to your bloodstream."
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

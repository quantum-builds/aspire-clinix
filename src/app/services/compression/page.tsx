import HeroSection from "@/components/HeroSection"
import ServicePageCard from "../../(landing)/service-page/components/ServicePageCard"
import { DropDown4 } from "@/assets"

const SERVICE_PAGE_CARD_DATA = [
  {
    title: "Compression Therapy",
    description:
      "Experience the rejuvenating benefits of Compression Therapy at Aspire. This non-invasive treatment uses controlled pressure to stimulate circulation, reduce swelling, and enhance lymphatic drainage.<br/><br/>Ideal for those seeking relief from muscle tension, soreness, or inflammation, our advanced compression therapy technology promotes quicker recovery and boosts overall well-being.",
    descrptionList: [],
    image: DropDown4,
    centerOnly: false,
  },
]

export default function ServiceDetailPage() {
  return (
    <div className="flex flex-col w-full h-full">
      <HeroSection
        title="Compression Therapy"
        description="Experience the rejuvenating benefits of Compression Therapy at Aspire. This non-invasive treatment uses controlled pressure to stimulate circulation, reduce swelling, and enhance lymphatic drainage."
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

import HeroSection from "@/components/HeroSection"
import ServicePageCard from "../../(landing)/service-page/components/ServicePageCard"
import { DropDown4 } from "@/assets"

const SERVICE_PAGE_CARD_DATA = [
  {
    title: "Fillings",
    description:
      "Fillings play a vital role in restoring teeth that have been affected by decay or minor damage, helping to maintain tooth structure and avoid more extensive treatment in the future. At Aspire, we use strong, natural-looking composite materials designed to blend beautifully with your existing teeth.<br/><br/>We do not use toxic metallic materials anywhere on site. If you have these already and they are removed strict protocols will be used to ensure you are protected and safe at all times.<br/><br/>Our approach focuses on preserving as much of the healthy tooth as possible through minimally invasive techniques, ensuring both function and aesthetics are restored. Every treatment is carefully planned and carried out with precision—so you can feel confident in a result that looks and feels just right.<br/><br/>Once your treatment is complete, you'll be invited to take part in our personalised prevention programme — if you do need a filling, it may well be the last one you ever need.",
    descrptionList: [],
    image: DropDown4,
    centerOnly: false,
  },
  {
    title: "Specialist care available?",
    description: "There is no current GDC recognised specialty for fillings.",
    descrptionList: [],
    centerOnly: true,
  },
]

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

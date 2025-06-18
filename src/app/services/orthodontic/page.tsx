import HeroSection from "@/components/HeroSection"
import ServicePageCard from "../../(landing)/service-page/components/ServicePageCard"
import { DropDown4, DropDown8 } from "@/assets"

const SERVICE_PAGE_CARD_DATA = [
  {
    title: "Orthodontic Clinic",
    description:
      "Our Orthodontic Clinic offers expert care to help you achieve a beautifully aligned smile.<br/><br/>Orthodontics is the movement of teeth by the use of either braces or increasingly popular are clear aligners.<br/><br/>Whether you're looking for more traditional braces or modern less visible alternatives like clear aligners, our skilled team will work with you to create a personalised treatment plan that suits your needs. We use the very best aligner systems and take great care in planning your final result before treatment even begins. You'll be shown detailed simulations of your potential outcome, so you can see what may be possible before starting your journey.",
    descrptionList: [],
    image: DropDown4,
    centerOnly: false,
  },
  {
    title: "Comfort and Excellence",
    description:
      "We prioritise comfort and convenience throughout the process, ensuring that every stage of your orthodontic journey is as smooth as possible.<br/><br/>From correcting bite issues to enhancing the appearance of your smile, we are committed to delivering results that boost both your confidence, oral health and give you a natural smile you love to show off.",
    descrptionList: [],
    image: DropDown8,
    reverse: true,
    centerOnly: false,
  },
  {
    title: "Specialist care available?",
    description:
      "There is a GDC recognised specialty for Orthodontics and clinicians with this recognition at The Aspire Clinic are..",
    descrptionList: [],
    centerOnly: true,
  },
]

export default function ServiceDetailPage() {
  return (
    <div className="flex flex-col w-full h-full">
      <HeroSection
        title="Orthodontic Clinic"
        description="Our Orthodontic Clinic offers expert care to help you achieve a beautifully aligned smile. Whether you're looking for more traditional braces or modern less visible alternatives like clear aligners, our skilled team will work with you to create a personalised treatment plan that suits your needs."
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
              {...(data.image && { image: data.image })}
              reverse={data.reverse}
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

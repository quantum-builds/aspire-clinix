import HeroSection from "@/components/HeroSection"
import ServicePageCard from "../../(landing)/service-page/components/ServicePageCard"
import { DropDown4 } from "@/assets"

const SERVICE_PAGE_CARD_DATA = [
  {
    title: "Oral Surgery",
    description:
      "Our expert team at Aspire specialises in a wide range of oral surgical procedures, from managing wisdom tooth problems to simple dental extractions.<br/><br/>We understand that no one ever plans to lose a tooth — so when it does become necessary, we're here to make the experience as smooth, painless, and stress-free as possible.",
    descrptionList: [],
    image: DropDown4,
    centerOnly: false,
  },
  {
    title: "Specialist care available?",
    description:
      "Oral Surgery is a GDC-recognised specialty, and The Aspire Clinic is proud to have clinicians with this formal accreditation.<br/><br/>Many of the clinicians at The Aspire Clinic are highly experienced in both simple and complex extractions. A referral to a specialist is only made when there is increased risk — such as proximity to major nerves or blood vessels, or if you have significant medical considerations like a compromised immune system.",
    descrptionList: [],
    centerOnly: true,
  },
]

export default function ServiceDetailPage() {
  return (
    <div className="flex flex-col w-full h-full">
      <HeroSection
        title="Oral Surgery"
        description="Our expert team at Aspire specialises in a wide range of oral surgical procedures, from managing wisdom tooth problems to simple dental extractions."
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

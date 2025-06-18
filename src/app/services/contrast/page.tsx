import HeroSection from "@/components/HeroSection"
import ServicePageCard from "../../(landing)/service-page/components/ServicePageCard"
import { DropDown4 } from "@/assets"

const SERVICE_PAGE_CARD_DATA = [
  {
    title: "Contrast Therapy",
    description:
      "Contrast Therapy combines the powerful benefits of heat and cold to support recovery, improve circulation, and ease muscle tension. By alternating between hot and cold treatments, this therapy stimulates the body's natural healing processes, helping to reduce inflammation, relieve soreness, and boost overall vitality.<br/><br/>Designed to enhance recovery, reduce stress, and improve energy levels, each session is tailored to fit your specific wellness goals, leaving you feeling refreshed, revitalised, and balanced.<br/><br/>The use of alternating hot and cold therapy — known as contrast therapy — is well supported by scientific evidence for promoting enhanced healing, recovery, and resilience across a range of conditions and wellness goals.<br/><br/>While still in the early stages of research, there is growing interest in complementary therapies to support cancer treatment outcomes. Approaches such as touch therapy, emotional support, and contrast therapy are being increasingly explored for their potential to aid the body's natural healing processes.<br/><br/>At The Aspire Clinic, we believe that anything which supports the body's capacity and willingness to heal is worth understanding deeply. We are committed to helping every individual thrive, flourish, and smile.",
    descrptionList: [],
    image: DropDown4,
    centerOnly: false,
  },
]

export default function ServiceDetailPage() {
  return (
    <div className="flex flex-col w-full h-full">
      <HeroSection
        title="Contrast Therapy"
        description="Contrast Therapy combines the powerful benefits of heat and cold to support recovery, improve circulation, and ease muscle tension."
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

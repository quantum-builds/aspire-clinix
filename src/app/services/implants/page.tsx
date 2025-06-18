import HeroSection from "@/components/HeroSection"
import ServicePageCard from "../../(landing)/service-page/components/ServicePageCard"
import { DropDown4 } from "@/assets"

const SERVICE_PAGE_CARD_DATA = [
  {
    title: "Dental Implants",
    description:
      "Dental implants are a long-lasting, natural-looking solution for replacing missing teeth—restoring both function and confidence. At Aspire, we offer expert implant dentistry using advanced techniques and high-quality materials to deliver results that feel as good as they look.<br/><br/>Dental implants are small titanium or ceramic posts carefully and painlessly placed into the jawbone, creating a strong and stable foundation for crowns, bridges, or dentures.<br/><br/>We use only world-leading implant systems with proven biocompatibility — designed to work in harmony with your body and even stimulate a natural healing response from your body.<br/><br/>Implants can significantly enhance quality of life and are widely regarded as one of the most reliable, long-term solutions for replacing missing teeth.<br/><br/>Whether you're replacing a single tooth or seeking a full smile restoration, we tailor every treatment plan to your individual needs, ensuring precision, comfort, and long-term success.<br/><br/>Our approach combines clinical excellence with a focus on aesthetics, so you can enjoy a healthy, secure smile that lasts.",
    descrptionList: [],
    image: DropDown4,
    centerOnly: false,
  },
  {
    title: "Specialist care available?",
    description: "There is no current GDC recognised specialty for implant dentistry.",
    descrptionList: [],
    centerOnly: true,
  },
]

export default function ServiceDetailPage() {
  return (
    <div className="flex flex-col w-full h-full">
      <HeroSection
        title="Dental Implants"
        description="Dental implants are a long-lasting, natural-looking solution for replacing missing teeth—restoring both function and confidence. At Aspire, we offer expert implant dentistry using advanced techniques and high-quality materials to deliver results that feel as good as they look."
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

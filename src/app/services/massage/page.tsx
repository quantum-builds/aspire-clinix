import HeroSection from "@/components/HeroSection"
import ServicePageCard from "../../(landing)/service-page/components/ServicePageCard"
import { DropDown4 } from "@/assets"

const SERVICE_PAGE_CARD_DATA = [
  {
    title: "Massage",
    description:
      "Our Massage Therapy services at Aspire are designed to relax both body and mind, helping to ease tension, improve circulation, and enhance overall wellness.<br/><br/>Whether you're seeking relief from muscle stiffness, stress, or simply want to unwind, our skilled therapists use a variety of techniques tailored to your specific needs.<br/><br/>Human touch is not a luxury but a fundamentally therapeutic experience that heals and nourishes us. Combined with massage expertise we can ensure you leave feeling your massage has made you feel nothing short of amazing.<br/><br/>With a focus on comfort and relaxation, each session is crafted to promote deep relaxation, alleviate discomfort, and leave you feeling balanced and restored. Unwind, rejuvenate, and restore harmony to your body and mind.",
    descrptionList: [],
    image: DropDown4,
    centerOnly: false,
  },
]

export default function ServiceDetailPage() {
  return (
    <div className="flex flex-col w-full h-full">
      <HeroSection
        title="Massage"
        description="Our Massage Therapy services at Aspire are designed to relax both body and mind, helping to ease tension, improve circulation, and enhance overall wellness."
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

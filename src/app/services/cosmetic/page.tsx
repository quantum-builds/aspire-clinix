import HeroSection from "@/components/HeroSection"
import ServicePageCard from "../../(landing)/service-page/components/ServicePageCard"
import { DropDown4 } from "@/assets"

const SERVICE_PAGE_CARD_DATA = [
  {
    title: "Cosmetic Clinic",
    description:
      "At our Cosmetic Clinic, we specialise in enhancing your smile to reflect your true confidence and individuality. Whether you're seeking a brighter smile with teeth whitening, perfecting your look with custom veneers, or undergoing a complete smile transformation, our skilled team is here to guide you through every step. We use the latest techniques and high-quality materials to deliver results that are both stunning and natural.<br/><br/>Your dream smile is within reach, and we're committed to helping you achieve it with care, precision, and personalised attention. Your dream smile is entirely your own — uniquely suited to you and your features. Our team is here to help you craft something beautiful, natural, and perfectly tailored to you.",
    descrptionList: [],
    image: DropDown4,
    centerOnly: false,
  },
  {
    title: "Specialist care available?",
    description:
      "There is no GDC recognised specialty for Cosmetic Dentistry and all our clinicians are extremely well trained in helping you design and receive the beautiful smile you deserve.",
    descrptionList: [],
    centerOnly: true,
  },
]

export default function ServiceDetailPage() {
  return (
    <div className="flex flex-col w-full h-full">
      <HeroSection
        title="Cosmetic Clinic"
        description="At our Cosmetic Clinic, we specialise in enhancing your smile to reflect your true confidence and individuality. Whether you're seeking a brighter smile with teeth whitening, perfecting your look with custom veneers, or undergoing a complete smile transformation, our skilled team is here to guide you through every step."
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

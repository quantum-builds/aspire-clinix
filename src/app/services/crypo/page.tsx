import HeroSection from "@/components/HeroSection"
import ServicePageCard from "../../(landing)/service-page/components/ServicePageCard"
import { DropDown4 } from "@/assets"

const SERVICE_PAGE_CARD_DATA = [
  {
    title: "Cryotherapy Chamber",
    description:
      "Cryotherapy is a cutting-edge wellness treatment that harnesses the power of cold to promote recovery, dramatically reduce inflammation, and boost overall well-being. By exposing the body to brief and controlled cold temperatures, this therapy stimulates circulation, aids muscle recovery, and enhances energy levels.<br/><br/>Many top athletes use cold strategically to enhance recovery and thus improve performance.<br/><br/>It's also highly effective in enhancing mood, promoting calmness, improving mental clarity and inner peace — while supporting better body composition and boosting metabolic rate.<br/><br/>Whether you're recovering from exercise, managing chronic pain, or simply looking to boost your mood, cryotherapy offers a rejuvenating experience that can leave you feeling refreshed and revitalised.<br/><br/>Our experienced team is here to gently guide you through the process, ensuring a safe and effective treatment tailored to your needs.",
    descrptionList: [],
    image: DropDown4,
    centerOnly: false,
  },
]

export default function ServiceDetailPage() {
  return (
    <div className="flex flex-col w-full h-full">
      <HeroSection
        title="Cryotherapy Chamber"
        description="Cryotherapy is a cutting-edge wellness treatment that harnesses the power of cold to promote recovery, dramatically reduce inflammation, and boost overall well-being."
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

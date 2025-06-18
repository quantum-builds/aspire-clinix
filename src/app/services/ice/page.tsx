import HeroSection from "@/components/HeroSection"
import ServicePageCard from "../../(landing)/service-page/components/ServicePageCard"
import { DropDown4 } from "@/assets"

const SERVICE_PAGE_CARD_DATA = [
  {
    title: "Ice Baths",
    description:
      "Ice Baths are a powerful and dynamic recovery tool that helps reduce muscle soreness, promote healing, and boost overall wellness. They offer a huge dopamine hit to anyone who uses them!<br/><br/>By immersing the body in cold water, this therapy reduces inflammation, flushes out toxins, and supports faster recovery. Ideal for athletes or anyone seeking quick relief after intense physical activity, ice baths also enhance circulation and improve mental focus.<br/><br/>Many clients seek guidance when deciding which form of cold exposure is right for them — and we're always happy to help you make the best choice for your needs and goals.",
    descrptionList: [],
    image: DropDown4,
    centerOnly: false,
  },
  {
    title: "The Deep Effects",
    description:
      "<strong>Depth of Effect:</strong> Cold water immersion penetrates deeper, rapidly affecting deep muscle tissue, joints, and the core temperature, resulting in potent systemic anti-inflammatory responses.<br/><br/><strong>Emotional Response:</strong> Ice baths trigger a robust activation of the calming parasympathetic nervous system post-immersion, facilitating deep relaxation afterward and profound restorative sleep.<br/><br/><strong>Circulation:</strong> Intense constriction of your bodies out blood vessels occurs rapidly, followed by significant rebound upon warming, promoting deep circulatory enhancement and metabolic waste clearance.<br/><br/>Ice baths offer a powerful physical and mental experience. The sensation is intense, immediate, and deeply invigorating — often described as confronting a raw, elemental force.<br/><br/>You're welcome to begin with shorter, gentler sessions, gradually building your confidence and resilience. As you progress, we'll be right beside you to ensure you get the most from this extraordinary practice.",
    descrptionList: [],
    centerOnly: true,
  },
]

export default function ServiceDetailPage() {
  return (
    <div className="flex flex-col w-full h-full">
      <HeroSection
        title="Ice Baths"
        description="Ice Baths are a powerful and dynamic recovery tool that helps reduce muscle soreness, promote healing, and boost overall wellness."
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

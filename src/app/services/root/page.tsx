import HeroSection from "@/components/HeroSection"
import ServicePageCard from "../../(landing)/service-page/components/ServicePageCard"
import { DropDown4, DropDown8 } from "@/assets"

const SERVICE_PAGE_CARD_DATA = [
  {
    title: "Root Canal Clinic",
    description:
      "Root canal treatment (Endodontics) is often the best way to preserve a natural tooth that has been damaged by decay or trauma reaching the nerve. When performed at the right time, it can prevent the need for extraction and help maintain your long-term oral health.<br/><br/>Our specialist team is highly skilled in providing effective, gentle root canal treatment, using the latest techniques to save infected or compromised teeth. With state-of-the-art 3D scanning and microscopic visualisation, you can feel confident that your treatment is carried out with the utmost precision and care.",
    descrptionList: [],
    image: DropDown4,
    centerOnly: false,
  },
  {
    title: "Comfortable Treatment Experience",
    description:
      "Despite its reputation, many of our patients are pleasantly surprised by how comfortable root canal treatment can be — often finding it more relaxing than other dental procedures. While it may take a little longer, the combination of our serene surroundings, supportive team, and exceptionally comfortable chairs helps patients feel calm, at ease, and completely relaxed throughout their treatment.<br/><br/>As root canal treatment is often the final opportunity to save a badly damaged tooth, it isn't always suitable. That's why we carry out a thorough consultation and examination beforehand — ensuring you understand all options and feel confident in your decision.",
    descrptionList: [],
    image: DropDown8,
    reverse: true,
    centerOnly: false,
  },
  {
    title: "Specialist care available:",
    description:
      "Endodontics is a GDC-recognised specialty. At The Aspire Clinic, we are proud to have accredited specialists including Dr Risha and Dr RP.",
    descrptionList: [],
    centerOnly: true,
  },
]

export default function ServiceDetailPage() {
  return (
    <div className="flex flex-col w-full h-full">
      <HeroSection
        title="Root Canal Clinic"
        description="Root canal treatment (Endodontics) is often the best way to preserve a natural tooth that has been damaged by decay or trauma reaching the nerve. When performed at the right time, it can prevent the need for extraction and help maintain your long-term oral health."
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

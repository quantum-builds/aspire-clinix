import HeroSection from "@/components/HeroSection"
import ServicePageCard from "../../(landing)/service-page/components/ServicePageCard"
import { DropDown4, DropDown8 } from "@/assets"

const SERVICE_PAGE_CARD_DATA = [
  {
    title: "Kids Clinic",
    description:
      "Our Kids' Clinic is dedicated to providing a welcoming and friendly environment where children can receive top-quality dental care. With a gentle approach and a focus on making dental visits fun and stress-free, our experienced team ensures that your child feels comfortable and confident throughout their treatment.<br/><br/>From routine check-ups to more specialised care, we offer a wide range of services designed to support your child's oral health and build good dental habits for life.",
    descrptionList: [],
    image: DropDown4,
    centerOnly: false,
  },
  {
    title: "General and Specialist Care",
    description:
      "Most children are cared for by a general dentist for routine check-ups and everyday dental needs. A referral to a specialist is usually only recommended in cases of more complex concerns — such as extensive decay, developmental dental conditions, or significant dental anxiety.",
    descrptionList: [],
    image: DropDown8,
    reverse: true,
    centerOnly: false,
  },
  {
    title: "Specialist care available:",
    description:
      "There is a GDC recognised specialty for Paediatric Dentistry and clinicians with this recognition at The Aspire Clinic are...",
    descrptionList: [],
    centerOnly: true,
  },
]

export default function ServiceDetailPage() {
  return (
    <div className="flex flex-col w-full h-full">
      <HeroSection
        title="Kids Clinic"
        description="Our Kids' Clinic is dedicated to providing a welcoming and friendly environment where children can receive top-quality dental care. With a gentle approach and a focus on making dental visits fun and stress-free, our experienced team ensures that your child feels comfortable and confident throughout their treatment."
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

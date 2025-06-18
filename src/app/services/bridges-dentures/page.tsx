import HeroSection from "@/components/HeroSection"
import ServicePageCard from "../../(landing)/service-page/components/ServicePageCard"
import { DropDown4 } from "@/assets"

const SERVICE_PAGE_CARD_DATA = [
  {
    title: "Bridges and Denture Clinic",
    description:
      "Replacing missing teeth may be crucial not only for restoring your smile but also for maintaining proper bite function and oral health. At Aspire, we offer a variety of custom-made bridges and dentures to suit your individual needs and lifestyle.<br/><br/>Dental bridges are an excellent option for filling gaps left by missing teeth. They are designed to anchor securely to adjacent healthy teeth, providing a stable, definitive solution that restores your smile and bite.<br/><br/>Bridges may be either adhesive or conventional and can be made with a inert metal core or all ceramic. These options will be discussed with you in detail so you can make the choice that best suits you.<br/><br/>We offer a comprehensive range of denture services designed to restore both function and confidence. Whether you're looking for full or partial dentures, our experienced team works closely with you to create custom solutions that fit comfortably and naturally. Using the latest techniques and high-quality - non-allergenic materials, we ensure that your dentures not only enhance your smile but also improve your overall oral health.<br/><br/>Our goal is to provide you with dentures that look and feel like your natural teeth, helping you regain comfort and confidence in your daily life.",
    descrptionList: [],
    image: DropDown4,
    centerOnly: false,
  },
  {
    title: "Specialist care available?",
    description:
      "There is a GDC recognised specialty for Prosthodontics (this covers dentures and fixed in restorations like bridges and crowns). Clinicians with this recognition at The Aspire Clinic are...FJ RP Elena etc",
    descrptionList: [],
    centerOnly: true,
  },
]

export default function ServiceDetailPage() {
  return (
    <div className="flex flex-col w-full h-full">
      <HeroSection
        title="Bridges and Denture Clinic"
        description="Replacing missing teeth may be crucial not only for restoring your smile but also for maintaining proper bite function and oral health."
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

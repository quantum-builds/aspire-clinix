import HeroSection from "@/components/HeroSection"
import ServicePageCard from "../../(landing)/service-page/components/ServicePageCard"
import { DropDown4, DropDown8 } from "@/assets"

const SERVICE_PAGE_CARD_DATA = [
  {
    title: "Porcelain Crowns and Onlays",
    description:
      "Porcelain crowns and onlays are advanced solutions for restoring teeth that are heavily worn, damaged, or weakened—helping to protect and preserve them while restoring their former beauty, natural shape and strength.<br/><br/>We use highest quality, tooth-coloured porcelain to achieve results that are both durable and virtually indistinguishable from your natural teeth. Often they can create an aesthetic result that is better than the natural tooth.<br/><br/>Onlays are ideal for reinforcing weaker back teeth if they have been damaged by larger cavities, tooth wear or fractures. Crowns offer full coverage for teeth that need more extensive support and onlays are similarly effective but require far less natural tooth removal.<br/><br/>Each restoration is custom-made for a precise fit and a seamless appearance, using techniques that prioritise longevity and tooth tissue preservation. A tooth with a large filling may have a remaining fracture resistance of under 20%, an onlay can improve this to over 90%. This means the best time to have an onlay is before the tooth fractures!<br/><br/>Our careful, minimally invasive approach ensures lasting results that not only function beautifully, but also enhance the overall aesthetics of your smile.",
    descrptionList: [],
    image: DropDown4,
    centerOnly: false,
  },
  {
    title: "Porcelain Crowns and Onlays",
    description:
      "Porcelain crowns and onlays are advanced solutions for restoring teeth that are heavily worn, damaged, or weakened—helping to protect and preserve them while restoring their former beauty, natural shape and strength.<br/><br/>We use highest quality, tooth-coloured porcelain to achieve results that are both durable and virtually indistinguishable from your natural teeth. Often they can create an aesthetic result that is better than the natural tooth.<br/><br/>Onlays are ideal for reinforcing weaker back teeth if they have been damaged by larger cavities, tooth wear or fractures. Crowns offer full coverage for teeth that need more extensive support and onlays are similarly effective but require far less natural tooth removal.<br/><br/>Each restoration is custom-made for a precise fit and a seamless appearance, using techniques that prioritise longevity and tooth tissue preservation. A tooth with a large filling may have a remaining fracture resistance of under 20%, an onlay can improve this to over 90%. This means the best time to have an onlay is before the tooth fractures!<br/><br/>Our careful, minimally invasive approach ensures lasting results that not only function beautifully, but also enhance the overall aesthetics of your smile.",
    descrptionList: [],
    image: DropDown8,
    reverse: true,
    centerOnly: false,
  },
 
]

export default function ServiceDetailPage() {
  return (
    <div className="flex flex-col w-full h-full">
      <HeroSection
        title="Porcelain Crowns and Onlays"
        description="Porcelain crowns and onlays are advanced solutions for restoring teeth that are heavily worn, damaged, or weakened—helping to protect and preserve them while restoring their former beauty, natural shape and strength."
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

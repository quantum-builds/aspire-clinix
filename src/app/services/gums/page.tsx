import HeroSection from "@/components/HeroSection"
import ServicePageCard from "../../(landing)/service-page/components/ServicePageCard"
import { DropDown4, DropDown8 } from "@/assets"

const SERVICE_PAGE_CARD_DATA = [
  {
    title: "Gums Clinic",
    description:
      "Your gums are the foundation of a strong, beautiful smile. Having healthy and beautiful gums is a key foundation to all dental health and offer your teeth and smile protection they deserve.<br/><br/>Your gums are similar to your skin. They shouldn't bleed and will only do so when unhealthy or damaged.<br/><br/>Gum health is just as important as your teeth.<br/><br/>Whether you're looking to treat gum disease, manage sensitivity, or simply keep your gums in top condition, our expert team is here to help with personalised care and the latest in gum treatments.",
    descrptionList: [],
    image: DropDown4,
    centerOnly: false,
  },
  {
    title: "The science of gum health — Periodontology",
    description:
      "Periodontology is the branch of dentistry focused on the health of your gums, and the science is clear: the condition of your gums can have a profound impact on your overall health.<br/><br/>That's why our entire team is committed to helping you avoid gum problems altogether — and, if they do arise, to resolving them swiftly and effectively.",
    descrptionList: [],
    image: DropDown8,
    reverse: true,
    centerOnly: false,
  },
  {
    title: "Specialist care available?",
    description:
      "Periodontology is a recognised specialty by the GDC, and at The Aspire Clinic, we are proud to have clinicians with this accreditation.<br/><br/>That said, lasting gum health depends on supporting the body's ability to heal — by removing the cause of disease and strengthening the immune response. Our experienced hygiene therapists and general dentists are exceptionally skilled in delivering this care.",
    descrptionList: [],
    centerOnly: true,
  },
]

export default function ServiceDetailPage() {
  return (
    <div className="flex flex-col w-full h-full">
      <HeroSection
        title="Gum Clinic"
        description="Your gums are the foundation of a strong, beautiful smile. Having healthy and beautiful gums is a key foundation to all dental health and offer your teeth and smile protection they deserve."
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

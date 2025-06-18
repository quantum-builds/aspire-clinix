import HeroSection from "@/components/HeroSection"
import ServicePageCard from "../../(landing)/service-page/components/ServicePageCard"
import { DropDown4, DropDown8 } from "@/assets"

const SERVICE_PAGE_CARD_DATA = [
  {
    title: "Infrared Sauna",
    description:
      "Our Sunlighten Infrared Sauna offers a relaxing and rejuvenating experience that promotes deep detoxification, improved circulation, and enhanced relaxation.<br/><br/>Using infrared wavelengths of healing light, this therapy penetrates deep beyond the skin to stimulate your body's natural healing processes, helping to relieve muscle tension, reduce stress, and promote better sleep.<br/><br/>Every cell in your body runs on an energy source and our Sunlighten Sauna refills the batteries providing that energy. The results can be remarkable to every system and part of your body.<br/><br/>Ideal for boosting skin health, increasing energy, healing injuries faster, and supporting overall wellness, our infrared sauna provides a soothing environment for both physical and mental rejuvenation. Step in and unwind as the gentle heat works to revitalise your body from the inside out.",
    descrptionList: [],
    image: DropDown4,
    centerOnly: false,
  },
  {
    title: "What can you expect?",
    description:
      "<strong>IMPROVED CARDIOVASCULAR HEALTH:</strong><br/>Improved circulation: Infrared heat increases core body temperature, dilating blood vessels, boosting circulation, and reducing arterial stiffness. Blood pressure regulation: Regular infrared sauna sessions have shown potential for lowering blood pressure, contributing significantly to cardiovascular disease prevention.<br/><br/><strong>MUSCLE RELAXATION AND PAIN RELIEF:</strong><br/>Reduction in muscle tension: Heat from infrared penetrates deeply, promoting muscle relaxation, reducing spasms, and alleviating chronic pain conditions such as Tension Myositis Syndrome (TMS). Joint health improvement: Infrared therapy has shown effectiveness in managing arthritis and chronic pain through reduced inflammation and enhanced joint mobility.<br/><br/><strong>IMPROVED SKIN HEALTH AND ANTI AGING AFFECT:</strong><br/>Collagen stimulation: Near-infrared wavelengths promote collagen production, reducing wrinkles, improving elasticity, and promoting faster wound healing. Improved skin appearance: Regular infrared sauna use leads to clearer, healthier skin through enhanced circulation, toxin removal, and cellular regeneration.",
    descrptionList: [],
    image: DropDown8,
    reverse: true,
    centerOnly: false,
  },
  {
    title: "Additional Benefits",
    description:
      "<strong>ENHANCED TOXIN ELIMINATION:</strong><br/>Infrared saunas stimulate sweating, helping eliminate toxins such as heavy metals (lead, mercury), BPA, phthalates, and environmental pollutants.<br/><br/><strong>STRESS REDUCTION AND EMOTIONAL HEALTH:</strong><br/>Lower cortisol levels: Infrared sauna sessions induce relaxation, reducing stress hormones like cortisol and helping to balance autonomic nervous system activity. Improved mood and sleep quality: Infrared heat promotes deep relaxation and can enhance serotonin production, reducing anxiety and symptoms of depression, and improving sleep quality.<br/><br/><strong>Immune System Enhancement:</strong><br/>Immune boosting: Elevated body temperature activates immune cells, enhances lymphatic circulation, and can help prevent or reduce the severity of illnesses.<br/><br/>If you would like to take a deep dive into the science behind these effects please let our team know and we can send you the link you are looking for!",
    descrptionList: [],
    centerOnly: true,
  },
]

export default function ServiceDetailPage() {
  return (
    <div className="flex flex-col w-full h-full">
      <HeroSection
        title="Infrared Sauna"
        description="Our Sunlighten Infrared Sauna offers a relaxing and rejuvenating experience that promotes deep detoxification, improved circulation, and enhanced relaxation."
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

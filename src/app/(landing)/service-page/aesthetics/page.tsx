import HeroSection from "@/components/HeroSection"
import ServicePageCard from "../components/ServicePageCard"
import { DropDown4, DropDown8 } from "@/assets"

const HERO_SECTION_DATA = {
  title: "Aesthetics Treatment",
  description:
    "Utilising the latest, cutting-edge techniques, we are committed to delivering refined, harmonious, and natural-looking results that complement your unique features",
  backgroundColor: "#1D120C",
  descLineHeight: 40.86,
  buttonColor: "#ECE8E3",
  textColor: "white",
  titleFontSize: "md:text-[48px] text-[25px]",
  heroScreenHieght: "min-h-[55vh] md:min-h-[70vh]",
}

const ABOUT_US_SECTION_DATA = {
  description: "",
  hasButton: false,
  buttonText: null,
  backgroundColor: "#F5F5F5",
  textColor: "#1D120C",
  buttonBackgroundColor: "#ECE8E3",
  buttonClickLink: "",
}

const SERVICE_PAGE_CARD_DATA = [
  {
    title: "Anti Wrinkle Injections",
    description:
      "Our Anti-Wrinkle Injections are designed to help you achieve a smoother, more youthful appearance with minimal downtime. Whether you're looking to reduce the appearance of fine lines or prevent deeper wrinkles, our expert team uses the latest techniques to deliver natural-looking results tailored to your needs.<br/><br/>We take a personalised approach to ensure that each treatment enhances your features while maintaining your unique expressions.",
    descrptionList: [
      "Lorem ipsum odor amet, consectetuer adipiscing elit.",
      "Lorem ipsum odor amet, consectetuer adipiscing elit.",
      "Lorem ipsum odor amet, consectetuer adipiscing elit.",
      "Lorem ipsum odor amet, consectetuer adipiscing elit.",
    ],
    image: DropDown4,
    reverse: false,
  },
  {
    title: "Fillers",
    description:
      "Our Dermal Fillers are crafted to enhance your natural features and restore youthful volume. Using advanced techniques and high-quality products, we provide subtle, yet impactful results that are tailored to your individual needs.<br/><br/>Each treatment is designed to smooth lines, restore balance, and create a refreshed, more vibrant appearance. With a personalised approach, we ensure your results are both natural-looking and long-lasting, helping you feel confident and revitalised in your own skin.",
    descrptionList: [
      "Lorem ipsum odor amet, consectetuer adipiscing elit.",
      "Lorem ipsum odor amet, consectetuer adipiscing elit.",
      "Lorem ipsum odor amet, consectetuer adipiscing elit.",
      "Lorem ipsum odor amet, consectetuer adipiscing elit.",
    ],
    image: DropDown8,
    reverse: true,
  },
  {
    title: "Skin Boosters",
    description:
      "Our Skin Boosters are designed to deeply hydrate and rejuvenate your skin from within, restoring a radiant, glowing complexion. Using advanced techniques, we deliver targeted treatments that enhance skin texture, improve elasticity, and promote long-lasting hydration.<br/><br/>Ideal for those seeking a natural, refreshed look, skin boosters help revitalise your skin's appearance, leaving it smoother, plumper, and more youthful. With a personalised approach, we ensure that each treatment meets your unique skin needs, helping you achieve a refreshed and healthy glow.",
    descrptionList: [
      "Lorem ipsum odor amet, consectetuer adipiscing elit.",
      "Lorem ipsum odor amet, consectetuer adipiscing elit.",
      "Lorem ipsum odor amet, consectetuer adipiscing elit.",
      "Lorem ipsum odor amet, consectetuer adipiscing elit.",
    ],
    image: DropDown4,
    reverse: false,
  },
]

export default function ServiceDetailPage() {
  return (
    <div className="flex flex-col w-full h-full">
      <HeroSection
        title={HERO_SECTION_DATA.title}
        description={HERO_SECTION_DATA.description}
        backgroundColor={HERO_SECTION_DATA.backgroundColor}
        descLineHeight={HERO_SECTION_DATA.descLineHeight}
        buttonColor={HERO_SECTION_DATA.buttonColor}
        textColor={HERO_SECTION_DATA.textColor}
        titleFontSize={HERO_SECTION_DATA.titleFontSize}
        heroScreenHieght={HERO_SECTION_DATA.heroScreenHieght}
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
              reverse={data.reverse}
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

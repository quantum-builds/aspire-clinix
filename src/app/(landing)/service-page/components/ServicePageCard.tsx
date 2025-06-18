import Image, { type StaticImageData } from "next/image"
import Link from "next/link"

interface ServicePageCardProps {
  title: string
  description: string
  descriptionList: string[]
  image?: StaticImageData
  reverse?: boolean
  buttonText?: string
  buttonLink?: string
  centerOnly?: boolean
}

export default function ServicePageCard({
  title,
  description,
  descriptionList,
  image,
  reverse = false,
  buttonText,
  buttonLink,
  centerOnly = false,
}: ServicePageCardProps) {
  if (centerOnly) {
    return (
      <div className="h-full py-12 xl:py-24 px-[10%] flex justify-center items-center">
        <div className="flex flex-col items-center gap-10 max-w-4xl text-center">
          <p className="font-opus text-3xl md:text-4xl">{title}</p>
          <span className="font-gillSans text-xl leading-6" dangerouslySetInnerHTML={{ __html: description }} />
        </div>
      </div>
    )
  }

  return (
    <div
      className={`h-full md:min-h-[80vh] flex flex-col ${reverse ? "xl:flex-row-reverse" : "xl:flex-row"} gap-16 xl:gap-36 py-12 xl:py-24 px-[10%] items-center`}
    >
      <div className="flex flex-col items-start gap-10 xl:w-1/2">
        <p className="font-opus text-3xl md:text-4xl">{title}</p>
        <span className="font-gillSans text-xl leading-6" dangerouslySetInnerHTML={{ __html: description }} />
        {buttonText && buttonLink && (
          <Link
            href={buttonLink}
            className="bg-[#1D120C] text-[#ECE8E3] px-6 py-3 rounded-md font-gillSans text-lg hover:bg-[#2A1F18] transition-colors duration-200"
          >
            {buttonText}
          </Link>
        )}
      </div>
      {image && (
        <div className="xl:w-1/2 flex items-center justify-center">
          <Image
            src={image || "/placeholder.svg"}
            width={600}
            height={400}
            alt="service-image"
            className="rounded-xl"
          />
        </div>
      )}
    </div>
  )
}

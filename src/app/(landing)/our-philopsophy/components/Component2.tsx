import clsx from "clsx"
import Image, { type StaticImageData } from "next/image"

interface Component2Props {
  title: string
  firstDescriptionText: string
  secondDescriptionText: string
  thirdDescriptionText?: string
  fourthDescriptionText?: string
  backgroundColor: string
  titleFontSize?: string
  imagePath: StaticImageData
}

export default function Component2({
  title,
  firstDescriptionText,
  secondDescriptionText,
  thirdDescriptionText,
  fourthDescriptionText,
  backgroundColor,
  titleFontSize,
  imagePath,
}: Component2Props) {
  return (
    <div
      className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-6 min-h-[45vh] font-opus py-6 md:py-8 px-4 md:px-8"
      style={{ backgroundColor: backgroundColor }}
    >
      {/* Image Section */}
      <div className="w-full md:w-[45%] lg:w-[50%] flex justify-center md:justify-start items-center">
        <div className="w-full max-w-none md:max-w-[85%] lg:max-w-[75%] xl:max-w-[80%]">
          <Image src={imagePath || "/placeholder.svg"} alt={title} className="w-full h-auto object-cover rounded-2xl" />
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col justify-center items-start gap-4 md:gap-6 w-full md:w-[55%] lg:w-[50%]">
        {/* Title */}
        <h1
          className={clsx(
            "w-full max-w-none md:max-w-[85%] lg:max-w-[75%] font-opus font-normal leading-tight md:leading-[1.2] lg:leading-[1.3] text-center md:text-start",
            titleFontSize,
          )}
        >
          {title}
        </h1>

        {/* Description Texts - Reduced spacing */}
        <div className="w-full md:w-[85%] lg:w-[75%] flex flex-col gap-3 md:gap-4">
          <p className="text-left text-sm sm:text-base md:text-lg lg:text-xl font-opus leading-relaxed">
            {firstDescriptionText}
          </p>

          <p className="text-left text-sm sm:text-base md:text-lg lg:text-xl font-opus leading-relaxed">
            {secondDescriptionText}
          </p>

          {thirdDescriptionText && (
            <p className="text-left text-sm sm:text-base md:text-lg lg:text-xl font-opus leading-relaxed">
              {thirdDescriptionText}
            </p>
          )}

          {fourthDescriptionText && (
            <p className="text-left text-sm sm:text-base md:text-lg lg:text-xl font-opus leading-relaxed">
              {fourthDescriptionText}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

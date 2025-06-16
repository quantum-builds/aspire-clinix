interface Component1Props {
  title: string
  descriptionText: string
  backgroundColor?: string
  titleFontSize?: string
}

export default function Component1({
  title,
  descriptionText,
  backgroundColor = "#ECE8E3",
  titleFontSize = "text-[16px] sm:text-[20px] md:text-[28px] lg:text-[36px] xl:text-[44px]",
}: Component1Props) {
  return (
    <div
      className="w-full flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 sm:py-10 md:py-12 lg:py-16 xl:py-20"
      style={{ backgroundColor }}
    >
      <div className="w-full max-w-7xl flex flex-col lg:flex-row items-start lg:items-center gap-6 md:gap-8 lg:gap-12 xl:gap-16">
        {/* Title */}
        <div className="w-full lg:w-[40%] xl:w-[35%] flex items-center">
          <h2 className={`${titleFontSize} font-opus text-left text-[#1D120C] leading-tight`}>{title}</h2>
        </div>

        {/* Description Text */}
        <div className="w-full lg:w-[60%] xl:w-[65%] flex flex-col gap-3 md:gap-4 lg:gap-5">
          <div
            className="text-left text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-opus leading-relaxed text-[#1D120C]"
            dangerouslySetInnerHTML={{ __html: descriptionText }}
          />
        </div>
      </div>
    </div>
  )
}
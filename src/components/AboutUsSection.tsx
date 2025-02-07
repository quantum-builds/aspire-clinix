import Link from "next/link";

interface AboutUsSectionProps {
  description: string;
  descriptionTextSize: number;
  descriptionLeadingHeight: number;
  hasButton: boolean | null;
  buttonText: string | null;
  backgroundColor: string;
  textColor: string;
  descriptionWidth: number;
  buttonBackgroundColor: string;
}
export default function AboutUsSection({
  description,
  descriptionTextSize,
  descriptionLeadingHeight,
  hasButton,
  buttonText,
  backgroundColor,
  textColor,
  descriptionWidth,
  buttonBackgroundColor,
}: AboutUsSectionProps) {
  return (
    <div
      className={`flex flex-col justify-center items-center gap-[70px] md:gap-[5px] min-h-screen font-opus`}
      style={{ backgroundColor: backgroundColor }}
    >
      <p
        className={`zoom-out text-center w-[${descriptionWidth}%] lg:w-[792px] w-full md:w-[600px] md:h-[190px] px-2 md:px-0 h-[170px] text-[16px] sm:text-[30px] md:text-[${descriptionTextSize}] font-opus`}
        style={{
          color: textColor,
          lineHeight: `${descriptionLeadingHeight}px`,
        }}
      >
        {description}
      </p>

      {hasButton && (
        <Link href={"/our-philopsophy"}>
          <button
            className="zoom-out text-textColor font-opus text-[20px] flex justify-center items-center md:rounded-[20px] rounded-[5px] md:w-[232px] w-[155px] h-[50px] md:h-[77px]"
            style={{
              backgroundColor: buttonBackgroundColor,
            }}
          >
            {buttonText}
          </button>
        </Link>
      )}
    </div>
  );
}

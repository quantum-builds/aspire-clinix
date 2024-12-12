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
}: AboutUsSectionProps) {
  return (
    <div
      className={`flex flex-col justify-center items-center gap-[60px] h-[72vh] font-opus`}
      style={{ backgroundColor: backgroundColor }}
    >
      <p
        className={`text-center w-[${descriptionWidth}%]`}
        style={{
          color: textColor,
          fontSize: `${descriptionTextSize}px`,
          lineHeight: `${descriptionLeadingHeight}px`,
        }}
      >
        {description}
      </p>

      {hasButton && (
        <Link href={"/"}>
          <button
            className=" text-black text-[20px] rounded-[20px] py-[24px] px-[40px] leading-[22.7px]"
            style={{
              backgroundColor: textColor,
            }}
          >
            {buttonText}
          </button>
        </Link>
      )}
    </div>
  );
}

import Link from "next/link";

interface AboutUsSectionProps {
  description: string;
  hasButton: boolean | null;
  buttonText: string | null;
  backgroundColor: string;
  textColor: string;
  buttonBackgroundColor: string;
  buttonClickLink: string;
}

export default function AboutUsSection({
  description,
  hasButton,
  buttonText,
  backgroundColor,
  textColor,
  buttonBackgroundColor,
  buttonClickLink,
}: AboutUsSectionProps) {
  return (
    <div
      className={`flex flex-col justify-center items-center gap-8 min-h-[70vh] py-16 md:py-20 lg:py-24 font-opus px-8 md:px-16`}
      style={{ backgroundColor: backgroundColor }}
    >
      <div
        className={`text-center max-w-4xl text-xl md:text-2xl lg:text-3xl leading-relaxed font-opus`}
        style={{
          color: textColor,
        }}
        dangerouslySetInnerHTML={{ __html: description }}
      />
      {hasButton && (
        <Link href={buttonClickLink}>
          <button
            className="zoom-out text-trueBlack font-opus text-sm sm:text-base md:text-lg lg:text-2xl flex justify-center items-center rounded-[5px] md:rounded-[20px]  px-11 py-6"
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

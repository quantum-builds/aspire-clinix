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
      className={`flex flex-col justify-center items-center gap-3 md:gap-8 xl:gap-16 min-h-[80vh] font-opus`}
      style={{ backgroundColor: backgroundColor }}
    >
      <p
        className={`zoom-out text-center w-full md:w-3/4 2xl:w-2/3 px-2 md:px-0 text-base sm:text-3xl xl:text-6xl leading-[25px] md:leading-[50px] xl:leading-[80px] font-opus`}
        style={{
          color: textColor,
        }}
      >
        {description}
      </p>

      {hasButton && (
        <Link href={buttonClickLink}>
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

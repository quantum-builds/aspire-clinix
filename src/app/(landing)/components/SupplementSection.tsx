import { image1 } from "@/assets";
import Link from "next/link";

interface SupplementSectionProps {
  title?: string | null;
  description: string;
  hasButton: boolean | null;
  buttonText: string | null;
  backgroundColor: string;
  textColor: string;
  buttonBackgroundColor: string;
  buttonClickLink: string;
}

export default function SupplementSection({
  title,
  description,
  hasButton,
  buttonText,
  textColor,
  buttonBackgroundColor,
  buttonClickLink,
}: SupplementSectionProps) {
  const backgroundImage = image1.src;

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-[#D9D9D9]  relative p-4">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          filter: "brightness(50%)",
        }}
      ></div>

      {/* Content */}
      <div className="flex flex-col justify-center items-center gap-3 md:gap-8 xl:gap-12 z-10 ">
        {title && (
          <p className="zoom-out text-[35px] md:text-7xl leading-{72.64px} font-opus text-white">
            {title}
          </p>
        )}
        <p
          className={`text-center zoom-out w-full md:w-3/4 2xl:w-2/3 px-2 md:px-0 text-base sm:text-3xl xl:text-5xl leading-[25px] md:leading-[50px] xl:leading-[80px] font-opus text-white`}
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
    </div>
  );
}

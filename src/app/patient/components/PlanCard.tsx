import { StaticImageData } from "next/image";
import Link from "next/link";

interface PlanCardProps {
  title: string;
  description: string;
  price: string;
  features: string[];
  isSubscribed: boolean;
  path: string;
  buttonText: string;
  backgroundContent: string | StaticImageData;
  className?: string;
}

export default function PlanCard({
  title,
  description,
  price,
  features,
  isSubscribed,
  path,
  buttonText,
  backgroundContent,
}: PlanCardProps) {
  return (
    <div
      className={`relative flex flex-col items-center justify-center gap-4 h-full w-full font-opus overflow-hidden`}
    >

      <div className="absolute top-0 left-0 w-full h-full bg-gray-400"></div>

      <div className="flex flex-col items-center gap-7  px-6 py-10">
        <div className="z-10 flex flex-col items-center text-center gap-6">
          <h2 className="text-[35px] md:text-[52px] leading-[59.02px] font-bold ">
            {title}
          </h2>
          <p className="text-lg md:text-xl font-light text-white">
            {description}
          </p>
          <p className="text-2xl font-semibold text-white">{price}</p>
          <ul className="list-disc pl-5 text-base text-white text-left">
            {features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>

        <div className=" bottom-[4rem] z-10">
          <Link href={path}>
            <button
              className={`text-[18px] md:text-xl rounded-[10px] md:rounded-[20px] w-[150px] md:w-[232px] h-[50px] md:h-[77px] font-opus ${
                isSubscribed
                  ? "bg-gray-500 text-white"
                  : "bg-[#C9BCA9] text-white"
              }`}
              disabled={isSubscribed}
            >
              {isSubscribed ? "Subscribed" : buttonText}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

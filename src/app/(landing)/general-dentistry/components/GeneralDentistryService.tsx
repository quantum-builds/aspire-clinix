import { InstagramIcon, LinkedinIcon, XIcon } from "@/assets";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";

interface GeneralDentistryServiceProp {
  title: string;
  description?: string;
  container_side: string;
  imagePath: string | StaticImageData;
  isContact?: boolean;
  phoneNumber?: string;
  email?: string;
  address?: string;
}

export default function GeneralDentistryService({
  title,
  description,
  container_side,
  isContact = false,
  imagePath,
  phoneNumber,
  email,
  address,
}: GeneralDentistryServiceProp) {
  return (
    <div className="w-full bg-feeGuide px-[10%]">
      <div className="zoom-out py-[5%] grid grid-cols-1 md:grid-cols-2 items-center gap-8 md:gap-16 ">
        {/* Text Section */}
        <div
          className={`flex flex-col justify-center gap-6 md:gap-7 lg:gap-[67px] w-full ${
            container_side === "right"
              ? "md:order-2 md:text-left"
              : "md:order-1 md:text-left"
          }`}
        >
          <h2 className="text-[22px] md:text-[52px] leading-[59.02px] font-bold font-opus ">
            {title}
          </h2>

          {!isContact ? (
            <p className="text-base md:text-2xl lg:w-[410px] xl:w-[471px] md:w-[360px] md:h-[150px] lg:h-[107px] xl:h-[81px] leading-[27.27px] tracking-widest font-gillSans">
              {description}
            </p>
          ) : (
            <div className="flex flex-col gap-4 md:gap-8 font-gillSans text-base md:text-xl xl:text-2xl">
              <div className="flex flex-col gap-2 md:gap-4">
                <p>Phone : {phoneNumber}</p>
                <p>Email : {email}</p>
                <p>Address : {address}</p>
              </div>
              <div className="flex flex-col gap-2 md:gap-4">
                <p>Connect with us</p>
                <div className="flex gap-4">
                  <Image alt="instagram" src={InstagramIcon} />
                  <Image alt="X" src={XIcon} />
                  <Image alt="linkedIn" src={LinkedinIcon} />
                </div>
              </div>
            </div>
          )}

          {!isContact && (
            <div className="w-full flex justify-start ">
              <Link href={"/service-page"}>
                <button
                  className="font-gillSans rounded-2xl px-16 py-8 bg-[#D9D9D9] text-base md:text-2xl tracking-widest"
                  style={{ lineHeight: "18.18px" }}
                >
                  Learn More
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Image Section */}
        <div
          className={`w-full flex justify-center items-center md:h-[650px] ${
            container_side === "right" ? "md:order-1" : "md:order-2"
          }`}
        >
          <Image
            src={imagePath}
            alt={title}
            width={400}
            className="object-cover rounded-xl w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}

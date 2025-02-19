import { InstagramIcon, LinkedinIcon, XIcon } from "@/assets";
import Image, { StaticImageData } from "next/image";

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
    <div className="w-full bg-feeGuide py-[97px] px-[10%]">
      <div className="zoom-out h-[79vh] grid grid-cols-1 md:grid-cols-2 items-center gap-8 ">
        {/* Text Section */}
        <div
          className={`flex flex-col justify-center gap-6 md:gap-[30px] lg:gap-[67px] w-full ${
            container_side === "right" ? "md:order-2" : "md:order-1"
          }`}
        >
          <h2 className="text-[22px] md:text-[52px] leading-[59.02px] font-bold font-opus">
            {title}
          </h2>

          {!isContact ? (
            <p className="text-[16px] md:text-[24px] lg:w-[410px]  xl:w-[471px] md:w-[360px] md:h-[150px] lg:h-[107px] xl:h-[81px] leading-[27.27px] tracking-widest font-gillSans">
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
        </div>

        {/* Image Section */}
        <div
          className={`w-full flex justify-center items-center ${
            container_side === "right" ? "md:order-1" : "md:order-2"
          }`}
        >
          <Image
            src={imagePath}
            alt={title}
            width={800}
            height={800}
            className="object-cover rounded-md"
          />
        </div>
      </div>
    </div>
  );
}

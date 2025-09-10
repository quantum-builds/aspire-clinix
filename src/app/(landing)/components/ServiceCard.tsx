import Image, { StaticImageData } from "next/image";
import Link from "next/link";

interface CardProps {
  text: string;
  path: string;
  image: string | StaticImageData;
}
export default function ServiceCard({ text, path, image }: CardProps) {
  return (
    <div className="zoom-out relative flex flex-col items-center justify-center gap-1 w-full md:w-1/2 lg:w-[30%] h-[100vh] font-opus overflow-hidden rounded-3xl hover:scale-105 duration-500 transition-transform">
      <div className="absolute top-0 left-0 w-full h-full">
        {/* <Image src={image} alt="" layout="fill" objectFit="cover" priority /> */}
        <Image
          src={image}
          alt=""
          className="object-cover w-full h-full"
          style={{ filter: "brightness(0.5)" }}
          priority
        />
      </div>

      <div className="flex z-10 justify-center items-center flex-col">
        <h2 className="text-[35px] md:text-[52px] md:text-wrap lg:text-nowrap leading-[59.02px] font-opus text-white">
          {text}
        </h2>
      </div>
      <div className="absolute bottom-[6rem]">
        <Link className="" href={path}>
          <button className="bg-feeGuide text-[18px] md:text-xl lg:text-2xl md:rounded-[20px] px-11 py-5 rounded-[10px] font-opus">
            Explore
          </button>
        </Link>
      </div>
    </div>
  );
}

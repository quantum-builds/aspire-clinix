import Image, { StaticImageData } from "next/image";
import Link from "next/link";

interface CardProps {
  text: string;
  path: string;
  image: string | StaticImageData;
}
export default function ServiceCard({ text, path, image }: CardProps) {
  return (
    <div className="relative flex flex-col items-center justify-center gap-1 h-screen md:h-[1119px] w-full font-opus bg-gray-100  overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full">
        {/* <Image src={image} alt="" layout="fill" objectFit="cover" priority /> */}
        <Image
          src={image}
          alt=""
          className="object-cover w-full h-full"
          priority
        />
      </div>

      <div className="flex z-10 justify-center items-center flex-col">
        <h2 className="text-[35px] md:text-[52px] md:text-wrap lg:text-nowrap leading-[59.02px] font-opus">
          {text}
        </h2>
      </div>
      <div className="absolute bottom-[4rem]">
        <Link className="" href={path}>
          <button className="bg-feeGuide text-[18px] md:text-xl md:rounded-[20px] md:w-[232px] rounded-[10px] w-[150px] h-[50px] md:h-[77px] font-opus">
            Explore
          </button>
        </Link>
      </div>
    </div>
  );
}

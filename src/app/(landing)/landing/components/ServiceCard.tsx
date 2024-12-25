import Image, { StaticImageData } from "next/image";
import Link from "next/link";

interface CardProps {
  text: string;
  path: string;
  image: string | StaticImageData;
}
export default function ServiceCard({ text, path, image }: CardProps) {
  return (
    <div className="relative flex flex-col items-center justify-center gap-1 h-screen md:h-[1119px] w-full font-opus bg-gray-100 rounded-lg overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full">
        <Image src={image} alt="" layout="fill" objectFit="cover" priority />
      </div>

      <div className="flex z-10 justify-center items-center flex-col">
        <h2 className="text-[22px] md:text-[52px] md:text-wrap lg:text-nowrap leading-[59.02px] font-opus">
          {text}
        </h2>
      </div>
      <div className="absolute bottom-[4rem]">
        <Link className="" href={path}>
          <button className="bg-[#F4F3F0] text-xl rounded-[20px] w-[232px] h-[77px] font-opus">
            Explore
          </button>
        </Link>
      </div>
    </div>
  );
}

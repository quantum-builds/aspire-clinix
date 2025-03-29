import Image, { StaticImageData } from "next/image";
import React from "react";

interface ServicePageCardProps {
  title: string;
  description: string;
  descriptionList: string[];
  image: StaticImageData;
}

export default function ServicePageCard({
  title,
  description,
  descriptionList,
  image,
}: ServicePageCardProps) {
  return (
    <div className="h-full md:min-h-[80vh] flex flex-col xl:flex-row gap-16 xl:gap-36 py-12 xl:py-24 px-[10%]">
      <div className="flex flex-col items-start gap-10 xl:w-1/2">
        <p className="font-opus text-3xl md:text-4xl">{title}</p>
        <span className="font-gillSans text-xl leading-6">
          {description.split("\n").map((line, index) => (
            <React.Fragment key={index}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </span>
        <ul className="font-gillSans text-xl list-disc pl-5">
          {descriptionList.map((point, index) => (
            <li className=" leading-9" key={index}>
              {point}
            </li>
          ))}
        </ul>
      </div>
      <div className="mx-auto xl:mx-0 flex items-center">
        <Image
          src={image}
          width={600}
          alt="service-image"
          className="rounded-xl"
        />
      </div>
    </div>
  );
}

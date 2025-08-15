import AspireLogo from "./components/AspireLogo";
import ServiceButtons from "./components/ServiceButtons";
import ExistingPatientSignIn from "./components/ExistingPatientSignIn";
import {  image2 } from "@/assets";
import Image from "next/image";

export default function BookTreatment() {
  return (
    <div
      id="book-treatment"
      className="flex justify-center items-center min-h-screen w-full relative"
    >
      <div className="absolute top-0 left-0 w-full h-full">
        <Image
          src={image2}
          alt=""
          className="object-cover w-full h-full"
          style={{ filter: "brightness(0.4)" }}
          priority
        />
      </div>
      <div className="bg-[#C9BCA9] opacity-70 flex flex-col items-center  justify-center w-full min-h-screen md:w-1/2 gap-[2rem] p-6  shadow-lg">
        <AspireLogo />
        <div className="flex flex-col gap-[1rem]">
          <ServiceButtons />
          <ExistingPatientSignIn />
        </div>
      </div>
    </div>
  );
}

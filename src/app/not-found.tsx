import { AspireDarkLogo } from "@/assets";
import Footer from "@/components/Footer";
import HeroNav from "@/components/HeroNav";
import Link from "next/link";

export default function NotFound() {
  return (
    <div>
      <div className="bg-feeGuide min-h-screen flex flex-col">
        <HeroNav
          aspireLogo={AspireDarkLogo}
          textColor="trueBlack"
          backgroundColor="backgroundColor"
          buttonColor={"#D9D9D9"}
        />
        <div className="flex flex-col justify-center items-center flex-grow gap-5 md:gap-8 text-center font-opus">
          <p className="text-6xl md:text-8xl ">404</p>
          <p className="text-lg md:text-2xl">Sorry, page not found</p>
          <Link href={"/"}>
            <button
              className="flex justify-center items-center ml-auto w-[105px] h-[45px] md:w-[160px] md:h-[60px] lg:w-[220px] lg:h-[67px] font-normal md:text-[20px] text-[13px] font-opus rounded-[5px] md:rounded-[20px]"
              style={{ backgroundColor: "#D9D9D9" }}
            >
              Back To Home
            </button>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}

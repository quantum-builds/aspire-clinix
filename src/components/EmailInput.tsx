import { ArrowLight } from "@/assets";
import Image from "next/image";

interface EmailInputProp {
  borderColor?: string;
  textColor?: string;
  arrowColor?: string;
}

export default function EmailInput({ borderColor, textColor }: EmailInputProp) {
  return (
    <div
      className="flex items-center border px-6 py-3 md:text-[16px] text-[10px] rounded-[10px] w-[220px] h-[40px] lg:w-[312px] md:w-[215px] md:h-[42px] lg:h-[52px]"
      style={{ borderColor: borderColor }}
    >
      <input
        type="email"
        name="userEmail"
        placeholder="Email Address"
        className="p-2 border-none focus:outline-none w-full text-white bg-footerBackground"
        style={{
          caretColor: textColor,
        }}
      />
      <Image src={ArrowLight} alt="Submit Arrow" />
    </div>
  );
}

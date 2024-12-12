import { ArrowLight } from "@/assets";
import Image from "next/image";

interface EmailInputProp {
  backgroundColor: string;
  borderColor?: string;
  textColor?: string;
  placeholderColor?: string;
  arrowColor?: string;
}

export default function EmailInput({
  backgroundColor,
  borderColor,
  textColor,
}: EmailInputProp) {
  return (
    <div
      className="flex items-center border px-6 py-3 rounded-[10px] w-full"
      style={{ borderColor: borderColor }}
    >
      <input
        type="email"
        name="userEmail"
        placeholder="Email Address"
        className="p-2 border-none focus:outline-none w-full"
        style={{
          backgroundColor: backgroundColor,
          color: textColor,
          caretColor: textColor,
        }}
      />
      <Image src={ArrowLight} alt="Submit Arrow" />
    </div>
  );
}

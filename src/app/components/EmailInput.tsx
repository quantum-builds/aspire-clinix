import { ArrowRightIcon } from "@/assets";
import Image from "next/image";

interface EmailInputProp {
  background_color: string;
}

export default function EmailInput({ background_color }: EmailInputProp) {
  return (
    <div className="flex items-center border px-6 py-3 rounded-[10px] border-black w-full">
      <input
        type="email"
        name="userEmail"
        placeholder="Email Address"
        className="p-2 border-none text-black focus:outline-none w-full"
        style={{ backgroundColor: background_color }}
      />
      <Image src={ArrowRightIcon} alt="Submit Arrow" />
    </div>
  );
}

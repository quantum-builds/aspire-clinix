import Image from "next/image";
import { AspireDarkLogo } from "@/assets";

export default function AspireLogo() {
  return (
    <Image
      src={AspireDarkLogo}
      alt="Aspire Clinic"
      width={189}
      height={88}
      className="mt-[53px]"
    />
  );
}

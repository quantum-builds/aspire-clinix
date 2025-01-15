import Image from "next/image";
import { AspireDarkLogo } from "@/assets";
import Link from "next/link";

export default function AspireLogo() {
  return (
    <Link href="/" scroll={false}>
      <Image
        src={AspireDarkLogo}
        alt="Aspire Clinic"
        className="zoom-out w-[150px] h-[70px] 2xl:w-[189px] 2xl:h-[88px]"
      />
    </Link>
  );
}

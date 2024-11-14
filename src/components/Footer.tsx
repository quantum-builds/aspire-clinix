import { AspireClinixIcon, InstagramIcon, LinkedinIcon, XIcon } from "@/assets";
import Image from "next/image";
import EmailInput from "./EmailInput";
import Link from "next/link";

const IN_PAGE_NAV_LINKS = [
  {
    label: "Our Philopsophy",
    path: "/",
  },
  {
    label: "Aspire Dental",
    path: "/",
  },
  {
    label: "Aspire Aesthetics",
    path: "/",
  },
  {
    label: "Aspire Wellness",
    path: "/",
  },

  {
    label: "Referral Portal",
    path: "/",
  },
];

const SOCIAL_ICONS = [
  {
    src: InstagramIcon,
    alt: "Instagram icon",
    path: "/",
    height: 30,
    width: 30,
  },
  {
    src: XIcon,
    alt: "X icon",
    path: "/",
    height: 30,
    width: 30,
  },
  {
    src: LinkedinIcon,
    alt: "Linkedin icon",
    path: "/",
    height: 25,
    width: 25,
  },
];

export default function Footer() {
  return (
    <div className="mx-auto w-full flex justify-around text-xl px-[150px] mt-[40px]">
      <div className="flex flex-col gap-[60px]">
        <Image
          src={AspireClinixIcon}
          alt="Apsire Clinic "
          width={189}
          height={88}
        />
        <div className="flex flex-col gap-[15px]">
          <p>hello@aspireclinic.co.uk</p>
          <p>27 Mortimer Street, </p>
          <p>W1N 7RJ, London, UK</p>
          <p>0207 333 333</p>
        </div>
        <p className="text-[16px]">Copyright 2024 Aspire Clinic</p>
      </div>
      <div className="flex flex-col gap-[60px]">
        <p className="text-[20px] ">Sign up to our newsletter</p>
        <EmailInput />
      </div>
      <div className="flex flex-col pl-[30px] gap-[60px] ">
        <p>Quick Links</p>
        <ul className="flex flex-col gap-[10px]">
          {IN_PAGE_NAV_LINKS.map((link, index) => (
            <li key={index} className="">
              <Link href={link.path}>{link.label}</Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col pl-[30px] gap-[20px]">
        <p>Connect with us</p>
        <div className="flex justify-between">
          {SOCIAL_ICONS.map((icon, index) => (
            <Link key={index} href={icon.path}>
              <Image
                src={icon.src}
                alt={icon.alt}
                width={icon.width}
                height={icon.height}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

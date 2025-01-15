import { AspireLightLogo, InstagramIcon, LinkedinIcon, XIcon } from "@/assets";
import Image from "next/image";
import EmailInput from "./EmailInput";
import Link from "next/link";

const IN_PAGE_NAV_LINKS = [
  { label: "Our Philosophy", path: "/" },
  { label: "Dentistry", path: "/#dentistry" },
  { label: "Aesthetics", path: "/#aesthetic" },
  { label: "Wellness", path: "/landing#wellness" },
  { label: "Referral Portal", path: "/referral#form" },
];

const SOCIAL_ICONS = [
  { src: InstagramIcon, alt: "Instagram", path: "/", height: 30, width: 30 },
  { src: XIcon, alt: "X (Twitter)", path: "/", height: 30, width: 30 },
  { src: LinkedinIcon, alt: "LinkedIn", path: "/", height: 25, width: 25 },
];

export default function Footer() {
  return (
    <footer className="bg-footerBackground">
      <div className="zoom-out grid gap-12 md:gap-[3rem] md:px-3 lg:px-0 md:grid-cols-4 px-3 justify-items-start md:justify-items-center py-12">
        {/* Logo and Address Section */}
        <div className="flex flex-col items-start gap-8">
          <Image
            src={AspireLightLogo}
            alt="Aspire Clinic Logo"
            width={189}
            height={88}
            className="w-[100px] h-[50px] lg:w-[189px] lg:h-[88px] md:w-[120px] md:h-[50px]"
          />
          <address className="not-italic  md:text-[16px] text-[16px] sm:text-[20px] text-white flex flex-col items-start font-gillSans gap-2">
            <p>hello@aspireclinic.co.uk</p>
            <p>27 Mortimer Street</p>
            <p>W1N 7RJ, London, UK</p>
            <p>0207 333 333</p>
          </address>
        </div>

        {/* Newsletter Signup Section */}
        <div className="flex flex-col  items-start gap-9">
          <p className="text-[16px] sm:text-[20px] text-white font-normal font-opus">
            Sign up to our newsletter
          </p>
          <EmailInput />
        </div>

        {/* Quick Links Section */}
        <div className="flex flex-col items-start gap-4">
          <p className="text-white text-[18px] sm:text-[20px] font-normal font-opus">
            Quick Links
          </p>
          <ul className="flex flex-col gap-2">
            {IN_PAGE_NAV_LINKS.map((link, index) => (
              <li key={index}>
                <Link
                  href={link.path}
                  className="font-gillSans text-white hover:underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Social Icons Section */}
        <div className="flex flex-col items-start gap-4">
          <p className="text-[16px] lg:text-[20px] text-white font-normal font-opus">
            Connect with us
          </p>
          <div className="flex pr-2  gap-6">
            {SOCIAL_ICONS.map((icon, index) => (
              <Link key={index} href={icon.path} aria-label={icon.alt}>
                <Image
                  src={icon.src}
                  alt={icon.alt}
                  width={icon.width}
                  height={icon.height}
                  className="filter grayscale-0 invert hover:opacity-80"
                />
              </Link>
            ))}
          </div>
        </div>
        <p className="text-left text-white font-opus">
          Copyright 2024 Aspire Clinic
        </p>
      </div>
    </footer>
  );
}

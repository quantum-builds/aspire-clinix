import Link from "next/link";

export default function SupplementSection() {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-[#D9D9D9] gap-[20px]">
      <p className="text-[64px] leading-{72.64px} font-opus">Our Supplements</p>
      <div className="flex flex-col items-center justify-center gap-[5px] text-[32px] text-[#382F26] leading-{36.36px} font-gillSans">
        <p>Lorem ipsum odor amet, consectetuer adipiscing elit.</p>
        <p>
          Sociosqu a nec magna habitant nec. Ullamcorper dui varius volutpat
          primis
        </p>
        <p>lacinia elit morbi velit.</p>
      </div>
      <Link href="/">
        <button className="py-[42px] px-[121px] rounded-[20px] leading-{27.24px} bg-white text-[24px] font-opus">
          Learn More
        </button>
      </Link>
    </div>
  );
}

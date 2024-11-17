import Link from "next/link";

export default function AboutUsSection() {
  return (
    <div className="flex flex-col justify-center items-center gap-[60px] h-[72vh] bg-[#382F26] text-[#C9BCA9]">
      <div className="flex flex-col items-center gap-[10px] text-[40px] leading-[45.4px]">
        <p>Lorem ipsum odor amet, consectetuer adipiscing elit. </p>
        <p> Sociosqu a nec magna habitant nec. Ullamcorper dui varius </p>
        <p>volutpat primis lacinia elit morbi velit.</p>
      </div>
      <Link href={"/"}>
        <button className="text-[#382F26] bg-[#C9BCA9] text-[20px] rounded-[20px] py-[24px] px-[40px] leading-[22.7px]">
          Our Philopsophy
        </button>
      </Link>
    </div>
  );
}

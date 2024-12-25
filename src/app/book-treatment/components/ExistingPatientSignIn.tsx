import Link from "next/link";

export default function ExistingPatientSignIn() {
  return (
    <div className="flex flex-col items-center gap-[27px]">
      <p>Existing Patients sign in</p>
      <Link href={"/"}>
        <button className="rounded-[10px] bg-[#AAAAAA] text-[13px] leading-[14.75px] px-[45px] py-[16px]">
          Sign in
        </button>
      </Link>
    </div>
  );
}

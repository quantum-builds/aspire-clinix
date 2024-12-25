import Link from "next/link";

export default function ExistingPatientSignIn() {
  return (
    <div className="flex flex-col items-center gap-[27px] mt-5">
      <p className="text-[16px] font-normal">Existing Patients sign in</p>
      <Link href={"/login"}>
        <button className="rounded-[10px] font-normal bg-grey101 text-[13px] leading-[14.75px] px-[45px] py-[16px]">
          Sign in
        </button>
      </Link>
    </div>
  );
}

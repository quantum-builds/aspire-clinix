import Link from "next/link";
import { cookies } from "next/headers"; // To read cookies in Next.js 13+ server components

export default async function ExistingPatientSignIn() {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get("next-auth.session-token");

  return (
    <div className="flex flex-col items-center gap-[27px] mt-5">
      <p className="text-[16px] font-normal">Existing Patients sign in</p>
      <Link href={sessionToken ? "/" : "/login"}>
        <button className="rounded-[10px] font-normal font-opus bg-bookATreatment text-[13px] leading-[14.75px] w-[115px] h-[45px]">
          Sign in
        </button>
      </Link>
    </div>
  );
}

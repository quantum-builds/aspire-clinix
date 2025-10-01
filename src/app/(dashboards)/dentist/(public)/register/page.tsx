import Image from "next/image";
import DentistRegisterForm from "./components/RegisterForm";
import { AspireDarkLogo } from "@/assets";
import BackButton from "@/app/(dashboards)/components/BackButton";
import { Response } from "@/types/common";
import { TPracticeResponse } from "@/types/practice";
import { getPractices } from "@/services/practice/practiceQuery";

export default async function RegisterPage() {
  const response: Response<TPracticeResponse> = await getPractices({});
  const practices = response.data
    ? response.data.practices
      ? response.data.practices
      : []
    : [];
  return (
    <main className="min-h-[103vh] ">
      <BackButton
        className="bg-gray hover:bg-lightGray w-fit mb-5"
        backToWebsite={true}
        text="Back To Website"
      />

      <div className="mx-auto w-full  bg-dashboardBarBackground rounded-2xl flex flex-col  justify-center max-w-4xl p-6 md:p-10">
        <div className="w-full flex items-center justify-center mb-8">
          <Image
            src={AspireDarkLogo}
            alt="Aspire Logo"
            width={129}
            height={60}
          />
        </div>
        <header className="mb-8 text-start">
          <h1 className="text-pretty text-2xl font-semibold tracking-tight md:text-3xl">
            Register Dentist
          </h1>
          <p className="text-muted-foreground mt-2">
            Create a dentist profile with basic details and an optional profile
            image.
          </p>
        </header>

        <section className="w-full grid gap-6 md:grid-cols-5">
          <div className="md:col-span-5 ">
            <DentistRegisterForm practices={practices} />
          </div>
        </section>
      </div>
    </main>
  );
}

import Image from "next/image";
import DentistRegisterForm from "./components/RegisterForm";
import { AspireDarkLogo } from "@/assets";

export default function RegisterPage() {
  return (
    <main className="min-h-full ">
      <div className="w-full flex items-center justify-center">
        <Image src={AspireDarkLogo} alt="Aspire Logo" width={129} height={60} />
      </div>
      <div className="mx-auto w-full flex flex-col items-center justify-center max-w-7xl p-6 md:p-10">
        <header className="mb-8 text-center">
          <h1 className="text-pretty text-2xl font-semibold tracking-tight md:text-3xl">
            Register Patient
          </h1>
          <p className="text-muted-foreground mt-2">
            Create a patient profile with basic details and an optional profile
            image.
          </p>
        </header>

        <section className="w-full grid gap-6 md:grid-cols-5">
          <div className="md:col-span-5 ">
            <DentistRegisterForm />
          </div>
        </section>
      </div>
    </main>
  );
}

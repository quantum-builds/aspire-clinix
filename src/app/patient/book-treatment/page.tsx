import AspireLogo from "./components/AspireLogo";
import ServiceButtons from "./components/ServiceButtons";
import ExistingPatientSignIn from "./components/ExistingPatientSignIn";
import { ClinicChair } from "@/assets";

export default function BookTreatment() {
  return (
    <div
      id="book-treatment"
      className="flex justify-center items-center min-h-screen w-full"
      style={{
        backgroundImage: `url(${ClinicChair.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-[#C9BCA9] opacity-70 flex flex-col items-center  justify-center w-full min-h-screen md:w-1/2 gap-[2rem] p-6  shadow-lg">
        <AspireLogo />
        <div className="flex flex-col gap-[1rem]">
          <ServiceButtons />
          <ExistingPatientSignIn />
        </div>
      </div>
    </div>
  );
}

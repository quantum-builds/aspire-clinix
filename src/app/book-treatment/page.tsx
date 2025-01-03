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
      <div className="flex flex-col items-center justify-center py-[5%] w-full min-h-screen md:w-1/2 gap-60 bg-bookATreatmentBackground p-6  shadow-lg">
        <div>
          <AspireLogo />
        </div>
        <div className="flex flex-col gap-52">
          <div>
            <ServiceButtons />
          </div>
          <div>
            <ExistingPatientSignIn />
          </div>
        </div>
      </div>
    </div>
  );
}

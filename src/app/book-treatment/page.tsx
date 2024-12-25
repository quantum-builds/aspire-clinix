import AspireLogo from "./components/AspireLogo";
import ServiceButtons from "./components/ServiceButtons";
import ExistingPatientSignIn from "./components/ExistingPatientSignIn";

export default function BookTreatment() {
  return (
    <div
      id="book-treatment"
      className="flex justify-center h-screen bg-[#AAAAAA]"
    >
      <div className="flex flex-col items-center w-[40%] h-full gap-20 bg-white">
        <AspireLogo />
        <ServiceButtons />
        <ExistingPatientSignIn />
      </div>
    </div>
  );
}

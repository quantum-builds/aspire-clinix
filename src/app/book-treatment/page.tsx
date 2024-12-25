import AspireLogo from "./components/AspireLogo";
import ServiceButtons from "./components/ServiceButtons";
import ExistingPatientSignIn from "./components/ExistingPatientSignIn";

export default function BookTreatment() {
  return (
    <div
      id="book-treatment"
      className="flex justify-center items-center min-h-screen bg-grey100 px-4 sm:px-8"
    >
      <div className="flex flex-col items-center w-full sm:w-[90%] md:w-[70%] lg:w-[40%] gap-5 bg-menuBar p-6  shadow-lg">
        <AspireLogo />
        <ServiceButtons />
        <ExistingPatientSignIn />
      </div>
    </div>
  );
}

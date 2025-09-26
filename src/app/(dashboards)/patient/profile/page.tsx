import BackButton from "@/app/(dashboards)/components/BackButton";
import ProfileForm from "./component/ProfileForm";
import { Response } from "@/types/common";
import { TPatient } from "@/types/patient";
import { getPatient } from "@/services/patient/patientQuery";

export default async function ProfilePage() {
  const response: Response<TPatient> = await getPatient(
    "cmfplxicq0000l6qaof724vtk"
  );

  return (
    <div className=" w-full h-full flex flex-col gap-7">
      <div className="flex items-center justify-between">
        <h1 className="font-medium text-3xl">Profile Details</h1>
        <BackButton />
      </div>
      <ProfileForm patient={response.data} />
    </div>
  );
}

import ProfileForm from "./component/ProfileForm";
import { Response } from "@/types/common";
import { TPatient } from "@/types/patient";
import { getPatient } from "@/services/patient/patientQuery";
import PageTopBar from "@/app/(dashboards)/components/custom-components/PageTopBar";

export default async function ProfilePage() {
  const response: Response<TPatient> = await getPatient(
    "cmfplxicq0000l6qaof724vtk"
  );

  return (
    <div className=" w-full min-h-[101vh] flex flex-col gap-5">
      <PageTopBar
        pageHeading="Profile Details"
        statusOptions={null}
        showFilters={false}
        showSearch={false}
        showBackBtn={true}
      />
      <ProfileForm patient={response.data} />
    </div>
  );
}
